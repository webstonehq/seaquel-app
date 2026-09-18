/**
 * Control-plane orchestrator. Owns the sequence of steps that turn a
 * "user has a paid License" event into a live `{slug}.seaquel.app`:
 *
 *   1. Insert `tenants` row (UNIQUE on `licenseId` enforces 1:1).
 *   2. Insert the owner row in `tenant_members` (consumes seat 1).
 *   3. Generate a per-tenant `SEAQUEL_AUTH_SECRET` for the container's
 *      Better Auth session signing.
 *   4. Call the platform adapter (Fly / Cloudflare) to start a machine.
 *   5. Write `{slug}.seaquel.app` CNAME via Cloudflare DNS API.
 *   6. Flip the tenants row to `status='active'`.
 *
 * Steps 3–6 run asynchronously after the handler returns. On Cloudflare
 * Workers we thread the work through `ctx.waitUntil(...)` so the worker
 * stays alive for the 30s it takes Fly to spin up a machine.
 *
 * Every step writes to `provision_events` with a short label and a
 * `detail` blob. Operators can read that audit trail when a tenant gets
 * stuck.
 */
import { remult, withRemult } from "remult";
import { dev } from "$app/environment";
import { Tenant } from "$lib/entities/tenant";
import { TenantMember } from "$lib/entities/tenant-member";
import { ProvisionEvent } from "$lib/entities/provision-event";
import type { DnsClient } from "./dns";
import {
  getAdapter,
  type AdapterEnv,
  type PlatformName,
  type TenantHandle,
} from "./platform";
import type { Region } from "./platform/types";
import { defaultRegion, flyAppName } from "./platform/fly";

/**
 * Canonical set of provision-event labels written to `provision_events`.
 * Keep in sync with any operator UI that filters by event name.
 */
export const PROVISION_EVENTS = {
  started: "started",
  platformProvisioned: "platform_provisioned",
  dnsWritten: "dns_written",
  platformReady: "platform_ready",
  active: "active",
  failed: "failed",
  deprovisionStarted: "deprovision_started",
  deprovisionComplete: "deprovision_complete",
  deprovisionFailed: "deprovision_failed",
} as const;

export interface OrchestratorEnv extends AdapterEnv {
  /** Root domain served by the control plane (usually `seaquel.app`). */
  CF_ROOT_DOMAIN?: string;
  /**
   * Public URL of the control plane itself, e.g. `https://seaquel.app`.
   * Passed into the per-tenant container so it knows where to call back
   * for `/api/cloud/*` server-to-server requests.
   */
  SEAQUEL_CONTROL_URL?: string;
}

export interface ProvisionTenantInput {
  ownerUserId: string;
  /** Email used as the owner's TenantMember row identity. */
  ownerEmail: string;
  slug: string;
  /** Bound 1:1 to the new tenant via `Tenant.licenseId`. */
  licenseId: string;
  /** Dodo product ID. Captured into provision_events for audit only. */
  planId: string;
  platform: PlatformName;
}

export interface ProvisionTenantDeps {
  env: OrchestratorEnv;
  dns: DnsClient;
  /**
   * Cloudflare Workers' `ExecutionContext.waitUntil`. Pass it when
   * running under Workers so the async provisioning keeps running after
   * the handler returns its 2xx. In dev (node), pass `undefined` — the
   * work stays pending on the event loop naturally.
   */
  waitUntil?: (promise: Promise<unknown>) => void;
}

/**
 * Create a tenant row + owner TenantMember and kick off asynchronous
 * provisioning. Returns the just-created tenant synchronously so the
 * caller can redirect / respond immediately; the async work is either
 * attached to `ctx.waitUntil` or continues on the node event loop.
 *
 * The caller must have already verified the License is owned by the
 * current user, has `status = "active"`, and isn't already bound to a
 * tenant. The `Tenant.licenseId` UNIQUE constraint is the structural
 * backstop.
 */
export async function provisionTenant(
  deps: ProvisionTenantDeps,
  input: ProvisionTenantInput,
): Promise<Tenant> {
  const { env } = deps;
  const rootDomain = env.CF_ROOT_DOMAIN ?? "seaquel.app";

  const tenantRepo = remult.repo(Tenant);
  const memberRepo = remult.repo(TenantMember);

  // Generate the per-tenant auth secret upfront. The cleartext is
  // captured in the closure below and threaded into the platform
  // adapter as an env var so the container can sign its own Better Auth
  // sessions; nothing else on the control plane touches it.
  const authSecret = generateAuthSecret();

  // Step 1 — create the tenant. The licenseId UNIQUE index rejects
  // any concurrent attempt to bind the same license to a second tenant.
  const tenant = await tenantRepo.insert({
    slug: input.slug,
    licenseId: input.licenseId,
    ownerUserId: input.ownerUserId,
    platform: input.platform,
    region: defaultRegion(),
    machineId: "",
    publicUrl: `https://${input.slug}.${rootDomain}`,
    status: "provisioning",
  });

  // Dev-only: surface the cleartext secret so a developer running the
  // mock platform adapter can paste it into a locally-run container.
  // Production never logs this — `dev` is false in any built/deployed
  // worker.
  if (dev) {
    console.log("\n[seaquel:provision] DEV ONLY — local container env:");
    console.log(`  SEAQUEL_AUTH_SECRET=${authSecret}\n`);
  }

  // Step 2 — owner row in tenant_members. Counts as seat 1.
  await memberRepo.insert({
    tenantId: tenant.id,
    userId: input.ownerUserId,
    email: input.ownerEmail,
    role: "owner",
    status: "active",
    acceptedAt: new Date(),
  });

  await logEvent(tenant.id, PROVISION_EVENTS.started, {
    platform: input.platform,
    region: tenant.region,
    planId: input.planId,
    licenseId: input.licenseId,
  });

  // Step 3+ — kick off async work; don't await from the caller. The
  // request's `remult` scope (and, on better-sqlite3, its short-lived
  // transaction handle) is gone by the time these promises resume — so
  // we run them in a fresh `withRemult` scope that holds the underlying
  // data provider directly.
  const dataProvider = remult.dataProvider;
  const work = withRemult(async () => {
    try {
      await runProvisioning(deps, tenant, authSecret);
    } catch (err) {
      await markTenantFailed(tenant.id, err);
    }
  }, { dataProvider });
  if (deps.waitUntil) deps.waitUntil(work);

  return tenant;
}

/**
 * Reverse of `provisionTenant`. Marks the tenant `deleting`, tells the
 * platform to deprovision, removes the DNS record. Soft-delete only —
 * the tenants row is kept for the 30-day grace window during which a
 * billing reversal would revive access. Hard deletion is a separate
 * out-of-band cron.
 */
export async function deprovisionTenant(
  deps: ProvisionTenantDeps,
  tenantId: string,
): Promise<void> {
  const { env } = deps;
  const tenant = await remult.repo(Tenant).findId(tenantId);
  if (!tenant) throw new Error("tenant not found");

  await remult.repo(Tenant).save({ ...tenant, status: "deleting" });
  await logEvent(tenantId, PROVISION_EVENTS.deprovisionStarted, {});

  const dataProvider = remult.dataProvider;
  const work = withRemult(async () => {
    try {
      // Self-hosted tenants run outside our infrastructure — no
      // container or DNS record to tear down.
      if (tenant.platform !== "self-hosted") {
        const adapter = getAdapter(tenant.platform as PlatformName, env);
        // Fly addresses everything by app name, which is derived from
        // the slug — rebuild it rather than relying on `originUrl`.
        // Called even without a `machineId` so a half-finished
        // provision (app created, machine id never persisted) is still
        // torn down.
        await adapter.deprovision({
          machineId: tenant.machineId,
          originUrl: "",
          appName:
            tenant.platform === "fly" ? flyAppName(tenant.slug) : undefined,
        });
        await deps.dns.deleteTenantCname(tenant.slug);
      }
      await logEvent(tenantId, PROVISION_EVENTS.deprovisionComplete, {});
    } catch (err) {
      await logEvent(tenantId, PROVISION_EVENTS.deprovisionFailed, {
        error: String(err),
      });
    }
  }, { dataProvider });
  if (deps.waitUntil) deps.waitUntil(work);
}

// ---------------------------------------------------------------------------
// Internal: the actual async work
// ---------------------------------------------------------------------------

async function runProvisioning(
  deps: ProvisionTenantDeps,
  tenant: Tenant,
  authSecret: string,
): Promise<void> {
  const { env } = deps;
  const adapter = getAdapter(tenant.platform as PlatformName, env);
  const rootDomain = env.CF_ROOT_DOMAIN ?? "seaquel.app";
  const controlUrl = env.SEAQUEL_CONTROL_URL ?? `https://${rootDomain}`;

  const publicUrl = `https://${tenant.slug}.${rootDomain}`;

  // Step 2 — ask the platform to start a machine.
  const handle = await adapter.provision({
    tenantId: tenant.id,
    slug: tenant.slug,
    region: tenant.region as Region,
    env: {
      SEAQUEL_AUTH_SECRET: authSecret,
      SEAQUEL_COOKIE_DOMAIN: `.${rootDomain}`,
      SEAQUEL_TRUSTED_ORIGINS: publicUrl,
      // Container reads this to call back to the control plane for
      // license/membership verification. Install identity is established
      // separately via `/api/cloud/register-install`.
      SEAQUEL_CONTROL_URL: controlUrl,
      PORT: "8787",
      NODE_ENV: "production",
    },
  });
  await persistHandle(tenant.id, handle);
  await logEvent(tenant.id, PROVISION_EVENTS.platformProvisioned, {
    machineId: handle.machineId,
    originUrl: handle.originUrl,
  });

  // Step 3 — DNS record pointing the public subdomain at the platform.
  const dnsResult = await deps.dns.writeTenantCname(
    tenant.slug,
    handle.originUrl,
  );
  await logEvent(tenant.id, PROVISION_EVENTS.dnsWritten, {
    recordId: dnsResult.recordId,
  });

  // Step 4 — poll platform status until the container reports healthy.
  await waitForReady(adapter, handle);
  await logEvent(tenant.id, PROVISION_EVENTS.platformReady, {});

  // Step 5 — flip tenant status to active.
  const latest = await remult.repo(Tenant).findId(tenant.id);
  if (latest) {
    await remult.repo(Tenant).save({
      ...latest,
      publicUrl,
      status: "active",
    });
  }
  await logEvent(tenant.id, PROVISION_EVENTS.active, {});
}

async function waitForReady(
  adapter: ReturnType<typeof getAdapter>,
  handle: TenantHandle,
  { timeoutMs = 25_000, intervalMs = 1_000 } = {},
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  // Small initial backoff so the mock adapter has time to transition.
  await sleep(intervalMs);
  while (Date.now() < deadline) {
    const status = await adapter.status(handle);
    if (status.state === "ready") return;
    if (status.state === "failed") {
      throw new Error(`platform reported failure: ${status.reason}`);
    }
    await sleep(intervalMs);
  }
  throw new Error(
    `platform did not report ready within ${timeoutMs}ms — tenant stays in provisioning, retry later`,
  );
}

async function persistHandle(tenantId: string, handle: TenantHandle) {
  const latest = await remult.repo(Tenant).findId(tenantId);
  if (!latest) return;
  await remult.repo(Tenant).save({ ...latest, machineId: handle.machineId });
}

/**
 * Flip the tenant row to `failed` and record the cause in
 * `provision_events`. The success page reads the status and surfaces
 * the failure to the user instead of polling until the 60s timeout.
 */
async function markTenantFailed(tenantId: string, err: unknown): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  const latest = await remult.repo(Tenant).findId(tenantId);
  if (latest) {
    await remult.repo(Tenant).save({ ...latest, status: "failed" });
  }
  await logEvent(tenantId, PROVISION_EVENTS.failed, { error: message });
}

async function logEvent(
  tenantId: string,
  event: string,
  detail: Record<string, unknown>,
): Promise<void> {
  await remult.repo(ProvisionEvent).insert({
    tenantId,
    event,
    detail,
  });
}

function generateAuthSecret(): string {
  // 32 random bytes, base64 — matches `openssl rand -base64 32`. The
  // cleartext is passed into the container's env and used for Better
  // Auth session signing inside the container. The control plane never
  // persists it — inbound `/api/cloud/*` calls authenticate via the
  // `X-Install-Id` + `X-License-Key` header pair instead.
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
