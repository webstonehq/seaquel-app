/**
 * POST /api/cloud/register-install — server-to-server.
 *
 * First call every Seaquel install makes to the control plane. The
 * install presents:
 *
 *   - `X-Install-Id` (also echoed in the JSON body) — a UUID minted on
 *     the seaquel side, one per install.
 *   - `X-License-Key` (also echoed in the JSON body) — an *owner-tier*
 *     license key (a subscription anchor key, identified by having
 *     `ownerUserId` set on the License row).
 *
 * Two paths from there:
 *
 *   1. **Cloud existing-tenant:** there's already a `Tenant` row whose
 *      `licenseId` matches the presented license — return the existing
 *      TenantContext, idempotently upsert the install row.
 *   2. **Self-hosted first-boot:** no `Tenant` for that license — we
 *      synthesise one with `slug = "self-{installId-prefix}"`, create
 *      the owner `TenantMember`, then insert the install row.
 *
 * Re-calling with the same `(installId, license)` is idempotent — the
 * install row is created once, subsequent calls return the same
 * TenantContext. Re-using an installId under a *different* Dodo
 * subscription is a 409 (`install_subscription_mismatch`) so a single
 * install can't impersonate two subscriptions.
 *
 * Auth is loose here by necessity: there's no install row to verify
 * against yet on first boot. We instead require an owner-tier license
 * key (active, `ownerUserId` set) — that's our trust anchor.
 *
 * Returns the same TenantContext shape as `/tenant-info` — the seaquel
 * side stores it identically.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { Install } from "$lib/entities/install";
import { License } from "$lib/entities/license";
import { Tenant, findTenantForSubscription } from "$lib/entities/tenant";
import { TenantMember } from "$lib/entities/tenant-member";
import { parseProductMap } from "$lib/server/control/dodo";
import { readEnv } from "$lib/server/control/env";
import { enforceRateLimit } from "$lib/server/rate-limit";

interface RegisterRequest {
  installId: string;
  licenseKey: string;
}

export const POST: RequestHandler = async (event) => {
  // Rate-limit before any header / license-key inspection. This is the
  // primary path for owner-tier license-key brute force — there's no
  // install row to verify against on first boot, so the only trust
  // anchor is the key itself. A legitimate install hits this endpoint
  // once in its lifetime; 5/min/IP leaves headroom for retries on a
  // dropped network without giving an attacker meaningful throughput.
  await enforceRateLimit(event, {
    bucket: "register-install",
    windowSeconds: 60,
    max: 5,
  });

  const installIdHdr = event.request.headers.get("x-install-id")?.trim() ?? "";
  const licenseKeyHdr = event.request.headers.get("x-license-key")?.trim() ?? "";
  if (!installIdHdr || !licenseKeyHdr) {
    throw error(400, "X-Install-Id and X-License-Key headers required");
  }

  let body: RegisterRequest;
  try {
    body = (await event.request.json()) as RegisterRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  if (
    !body ||
    body.installId !== installIdHdr ||
    body.licenseKey !== licenseKeyHdr
  ) {
    throw error(400, "body installId/licenseKey must match headers");
  }

  const licenseRepo = remult.repo(License);
  const tenantRepo = remult.repo(Tenant);
  const memberRepo = remult.repo(TenantMember);
  const installRepo = remult.repo(Install);

  const license = await licenseRepo.findFirst({ licenseKey: licenseKeyHdr });
  if (!license) throw error(400, "license_not_found");
  if (license.status !== "active") throw error(400, "license_inactive");
  // Owner-tier guard: the License must be claimed by a Better Auth
  // user. Member-tier keys (joiners) have empty `ownerUserId` and go
  // through `bind-member`, not `register-install`.
  if (!license.ownerUserId) throw error(400, "owner_key_required");

  // Set a system user so the Tenant + TenantMember apiPrefilters don't
  // reject our writes during the self-hosted auto-create branch.
  remult.user = {
    id: `system:register-install:${installIdHdr}`,
    name: "register-install",
    roles: [],
  };

  // Existing Cloud tenant? Or self-hosted first-boot needing a synthetic
  // tenant? Look up by licenseId — Tenant.licenseId is UNIQUE.
  let tenant = await tenantRepo.findFirst({ licenseId: license.id });
  if (!tenant && (await findTenantForSubscription(license))) {
    // Another key from the same subscription already anchors a tenant —
    // one purchase funds one tenant. Register with that tenant's key.
    throw error(409, "subscription_has_tenant");
  }
  if (!tenant) {
    const slug = `self-${installIdHdr.slice(0, 8)}`;
    // Self-hosted tenant: the container runs outside our platforms, so
    // `platform`/`region` are synthetic markers. Tenant.platform validates
    // against {fly, cloudflare, self-hosted}; region just needs to be
    // non-empty to satisfy `required: true`.
    tenant = await tenantRepo.insert({
      slug,
      licenseId: license.id,
      ownerUserId: license.ownerUserId,
      platform: "self-hosted",
      region: "self-hosted",
      machineId: "",
      publicUrl: "",
      status: "active",
    });
    await memberRepo.insert({
      tenantId: tenant.id,
      userId: license.ownerUserId,
      email: license.email,
      role: "owner",
      status: "active",
      licenseKey: license.licenseKey,
      containerUserId: "",
      acceptedAt: new Date(),
      boundAt: new Date(),
    });
  }

  // Upsert install row. Idempotent on (id, subscriptionId).
  const existingInstall = await installRepo
    .findId(installIdHdr)
    .catch(() => null);
  if (!existingInstall) {
    await installRepo.insert({
      id: installIdHdr,
      subscriptionId: license.dodoSubscriptionId ?? "",
      tenantId: tenant.id,
    });
  } else if (
    existingInstall.subscriptionId !== (license.dodoSubscriptionId ?? "")
  ) {
    // installId reused across subscriptions — reject. Backfilled rows
    // and legitimate re-registrations both have a matching
    // subscriptionId; only a forged-installId case lands here.
    throw error(409, "install_subscription_mismatch");
  }

  // Build the TenantContext — keep this in lockstep with
  // `tenant-info/+server.ts`.
  const ownerRow = await memberRepo.findFirst({
    tenantId: tenant.id,
    role: "owner",
  });
  const productMap = parseProductMap(readEnv(event).PUBLIC_DODO_PRODUCT_MAP);

  return json({
    tenantId: tenant.id,
    slug: tenant.slug,
    status: tenant.status,
    publicUrl: tenant.publicUrl,
    anchorLicenseId: license.id,
    subscriptionId: license.dodoSubscriptionId,
    tier: productMap[license.planId] ?? "personal",
    ownerEmail: ownerRow?.email ?? "",
    seatLimit: license.seats,
    currentPeriodEnd: license.currentPeriodEnd?.toISOString() ?? null,
  });
};
