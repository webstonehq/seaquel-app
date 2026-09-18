import {
  Allow,
  BackendMethod,
  Entity,
  Fields,
  Relations,
  Validators,
  remult,
} from "remult";
import { User } from "./auth-entities";
import { License } from "./license";
import { TenantMember } from "./tenant-member";

export interface CreateTenantInput {
  slug: string;
  licenseId: string;
  platform?: "fly" | "cloudflare";
}

/**
 * Shape returned by `/api/cloud/tenant-info`, `/api/cloud/register-install`,
 * and `Tenant.createSelfHostedShell`. Keep these three call sites in
 * lockstep — the self-hosted container stores this verbatim.
 */
export interface TenantContext {
  tenantId: string;
  slug: string;
  status: string;
  publicUrl: string;
  anchorLicenseId: string;
  subscriptionId: string;
  tier: string;
  ownerEmail: string;
  seatLimit: number;
  /** ISO 8601 string, or null if the license has no billing cycle yet. */
  currentPeriodEnd: string | null;
}

/**
 * A single provisioned Seaquel Cloud instance. Each tenant is bound to
 * exactly one paid `License` (`licenseId` is UNIQUE) — buy a license to
 * provision a tenant; buy another license to provision a second tenant.
 *
 * `ownerUserId` is denormalized from `License.ownerUserId` so the
 * dashboard's "my tenants" query stays a single round-trip. The two are
 * always equal — keep them in sync at the API boundary.
 *
 * Access is mediated by the control-plane API routes
 * (`/api/control/tenants/*`). Ownership is checked by
 * `ownerUserId === remult.user.id`; tenant member access is checked
 * separately via `TenantMember`. Routes return 404 (not 403) for
 * unauthorized reads — leaking "tenant X exists" is a data point we
 * don't want to hand out.
 */
@Entity<Tenant>("tenants", {
  // HTTP access is read-only + owner-scoped. Create / delete go through
  // the `Tenant.create` and `Tenant.softDelete` BackendMethods below so
  // the orchestrator side-effects (platform provision, DNS, member seat,
  // audit events) always run on the same code path as the row change.
  allowApiRead: Allow.authenticated,
  allowApiInsert: false,
  allowApiUpdate: false,
  allowApiDelete: false,
  apiPrefilter: () => ({ ownerUserId: remult.user?.id ?? "" }),
})
export class Tenant {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  /** Subdomain component: `{slug}.seaquel.app`. Must be globally unique. */
  @Fields.string({
    required: true,
    validate: [Validators.unique(), validateSlug],
    allowApiUpdate: false,
  })
  slug = "";

  /**
   * The license that funds this tenant. Required + UNIQUE — enforces
   * the 1:1 invariant (one license = one tenant). Set at creation,
   * never updated. To "move" a tenant to a different license you'd
   * deprovision and re-provision under the new license.
   */
  @Fields.string({
    required: true,
    validate: Validators.unique(),
    allowApiUpdate: false,
  })
  licenseId = "";
  @Relations.toOne<Tenant, License>(() => License, "licenseId")
  license!: License;

  @Fields.string({ required: true, allowApiUpdate: false })
  ownerUserId = "";
  @Relations.toOne<Tenant, User>(() => User, "ownerUserId")
  owner!: User;

  /**
   * Which platform hosts this tenant's container. `"fly"` and `"cloudflare"`
   * are managed Cloud tenants provisioned via the orchestrator;
   * `"self-hosted"` is the synthetic platform value used for tenants
   * minted by `/api/cloud/register-install` on first-boot of a self-hosted
   * install (where the container is running outside our infrastructure
   * and no provisioning happens).
   */
  @Fields.string({
    required: true,
    allowApiUpdate: false,
    validate: (_r, f) =>
      ["fly", "cloudflare", "self-hosted"].includes(f.value) ||
      "invalid platform",
  })
  platform = "";

  @Fields.string({ required: true, allowApiUpdate: false })
  region = "";

  /** Platform-specific opaque machine id, populated after provisioning. */
  @Fields.string({ required: false })
  machineId = "";

  /** e.g. `https://acme.seaquel.app` — written on provision success. */
  @Fields.string({ required: false })
  publicUrl = "";

  /**
   * Lifecycle states:
   * - `provisioning`: row inserted, waiting for platform + DNS + health.
   * - `active`: URL is reachable, tenant accepts traffic.
   * - `failed`: async provisioning threw; surfaced to the user on the
   *    success page. Ops must inspect `provision_events` and either
   *    delete the row (freeing the license UNIQUE slot for a retry) or
   *    remediate manually.
   * - `suspended`: billing lapsed or admin-suspended; platform container
   *    stopped but data preserved.
   * - `deleting`: 30-day soft-delete grace period before hard wipe.
   */
  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["provisioning", "active", "failed", "suspended", "deleting"].includes(f.value) ||
      "invalid status",
  })
  status = "provisioning";

  @Fields.createdAt({ allowApiUpdate: false })
  createdAt!: Date;

  @Fields.date({ required: false })
  suspendedAt?: Date;

  /**
   * Provision a tenant for the current user. Validates the supplied
   * license (ownership, status, key delivered, seats, not already
   * backing another tenant), then hands off to the orchestrator bound on
   * `remult.context` (see `server/remult/api.ts`). Returns the new row
   * synchronously; platform + DNS work runs async under `waitUntil`.
   *
   * Throws plain strings on validation failure — Remult wraps them as
   * `ErrorInfo.message` on the client, which the dashboard UI displays
   * inline and pattern-matches ("already taken") to bounce the slug
   * step.
   */
  @BackendMethod({ allowed: Allow.authenticated, transactional: false })
  static async create(input: CreateTenantInput): Promise<Tenant> {
    const ownerUserId = remult.user?.id;
    if (!ownerUserId) throw "unauthorized";

    const orchestrator = remult.context.orchestrator;
    if (!orchestrator) throw "orchestrator not initialized";

    const license = await remult.repo(License).findId(input.licenseId);
    if (!license || license.ownerUserId !== ownerUserId) {
      throw "license not found";
    }
    if (license.status !== "active") throw `license is ${license.status}`;
    if (!license.licenseKey) {
      throw "license is not yet verified — activate it at /dashboard/activate";
    }
    if (license.seats < 1) throw "license has no available seats";

    const existingForLicense = await findTenantForSubscription(license);
    if (existingForLicense) throw "this license already has a tenant";

    const existingSlug = await remult
      .repo(Tenant)
      .findFirst({ slug: input.slug });
    if (existingSlug) throw `slug "${input.slug}" is already taken`;

    const ownerEmail = remult.context.userEmail ?? license.email;

    return orchestrator.provisionTenant({
      ownerUserId,
      ownerEmail,
      slug: input.slug,
      licenseId: license.id,
      planId: license.planId,
      platform: input.platform ?? "fly",
    });
  }

  /**
   * Mint a synthetic self-hosted Tenant + owner TenantMember for an
   * existing License, WITHOUT going through `/api/cloud/register-install`.
   *
   * Use case: an owner activates a license at /dashboard/activate and
   * wants to download an air-gapped bundle (Task 10's UI) before they've
   * ever booted a self-hosted Seaquel install. The bundle endpoint needs
   * a Tenant row to attach the audit record to; this BackendMethod
   * creates that row in advance.
   *
   * Idempotent — if a Tenant already exists for this license (e.g. an
   * install previously called /api/cloud/register-install), we return
   * its TenantContext instead of erroring. Same TenantContext shape as
   * register-install / tenant-info; the dashboard code is identical
   * regardless of which call site materialised the row.
   *
   * Does NOT create an Install row. That's only inserted by
   * /api/cloud/register-install when an install boots online — an
   * offline-first owner has no installId to record yet.
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async createSelfHostedShell(
    licenseId: string,
  ): Promise<TenantContext> {
    const userId = remult.user?.id;
    if (!userId) throw "unauthorized";

    const license = await remult.repo(License).findId(licenseId);
    if (!license) throw "license not found";
    if (license.ownerUserId !== userId) throw "forbidden";

    const tenantRepo = remult.repo(Tenant);
    const memberRepo = remult.repo(TenantMember);

    // Idempotent: if a Tenant already exists for this license, return it.
    // Tenant.licenseId is UNIQUE so this is at most one row.
    let tenant = await tenantRepo.findFirst({ licenseId: license.id });
    if (!tenant && (await findTenantForSubscription(license))) {
      throw "this license's subscription already has a tenant";
    }
    if (!tenant) {
      const slug = `self-${license.id.slice(0, 8)}`;
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

      // Owner member row. `boundAt` is set so the seat-quota check
      // counts this row as bound (not just invited). The container
      // will overwrite `containerUserId` on first /api/cloud/bind-member.
      const ownerEmail = remult.context?.userEmail ?? license.email;
      await memberRepo.insert({
        tenantId: tenant.id,
        userId,
        email: ownerEmail,
        role: "owner",
        status: "active",
        licenseKey: license.licenseKey,
        containerUserId: "",
        acceptedAt: new Date(),
        boundAt: new Date(),
      });
    }

    // Build the TenantContext — keep this in lockstep with
    // `/api/cloud/tenant-info` and `/api/cloud/register-install`.
    const ownerRow = await memberRepo.findFirst({
      tenantId: tenant.id,
      role: "owner",
    });

    // PUBLIC_DODO_PRODUCT_MAP isn't on remult.context, so fall back to
    // the raw planId. The bundle endpoint and dashboard load the map
    // directly via readEnv when they need a human-readable tier; for
    // this shell-create call the raw planId is fine — the consumer
    // re-derives the tier the same way it would for any other Tenant.
    return {
      tenantId: tenant.id,
      slug: tenant.slug,
      status: tenant.status,
      publicUrl: tenant.publicUrl,
      anchorLicenseId: license.id,
      subscriptionId: license.dodoSubscriptionId,
      tier: license.planId,
      ownerEmail: ownerRow?.email ?? "",
      seatLimit: license.seats,
      currentPeriodEnd: license.currentPeriodEnd?.toISOString() ?? null,
    };
  }

  /**
   * Start the soft-delete + deprovision flow for a tenant owned by the
   * current user. Flips `status='deleting'`, records a
   * `deprovision_started` event, and fires the platform + DNS teardown
   * asynchronously. The row stays for the 30-day grace window.
   */
  @BackendMethod({ allowed: Allow.authenticated, transactional: false })
  static async softDelete(id: string): Promise<void> {
    const ownerUserId = remult.user?.id;
    if (!ownerUserId) throw "unauthorized";

    const orchestrator = remult.context.orchestrator;
    if (!orchestrator) throw "orchestrator not initialized";

    const tenant = await remult.repo(Tenant).findId(id);
    if (!tenant || tenant.ownerUserId !== ownerUserId) throw "tenant not found";

    await orchestrator.deprovisionTenant(tenant.id);
  }
}

/**
 * The tenant backing `license`'s subscription, if any. An N-seat Dodo
 * subscription materialises N License rows (one per key), all carrying
 * the full seat count — so the `licenseId` UNIQUE index alone would let
 * one purchase fund N tenants. Callers that create tenants must check
 * this first. Licenses without a subscription id (manual activation
 * before the webhook landed) only match on their own id.
 */
export async function findTenantForSubscription(
  license: License,
): Promise<Tenant | undefined> {
  const licenseIds = license.dodoSubscriptionId
    ? (
        await remult
          .repo(License)
          .find({ where: { dodoSubscriptionId: license.dodoSubscriptionId } })
      ).map((l) => l.id)
    : [license.id];
  if (!licenseIds.includes(license.id)) licenseIds.push(license.id);
  return remult.repo(Tenant).findFirst({ licenseId: licenseIds });
}

// ---------------------------------------------------------------------------
// Slug validation — gates out reserved names, enforces URL-safe shape.
// ---------------------------------------------------------------------------

const RESERVED_SLUGS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "dashboard",
  "docs",
  "demo",
  "download",
  "help",
  "mail",
  "status",
  "support",
  "seaquel",
  "cloud",
  "login",
  "logout",
  "signup",
  "signin",
  "account",
  "billing",
  "control",
  // Dashboard static routes — SvelteKit prefers static over dynamic,
  // but reserving them means users can't create a tenant whose URL
  // would be unreachable from the switcher.
  "new",
  "success",
  "settings",
  "team",
]);

// Valid: 3-32 chars, lowercase alnum + hyphens, no leading/trailing hyphen.
const SLUG_RE = /^[a-z0-9]([a-z0-9-]{1,30}[a-z0-9])?$/;

function validateSlug<T>(_row: T, field: { value: string }): string | void {
  const v = field.value;
  if (!v) return "slug is required";
  if (!SLUG_RE.test(v)) {
    return "slug must be 3-32 chars, lowercase alphanumeric and hyphens, no leading/trailing hyphen";
  }
  if (RESERVED_SLUGS.has(v)) {
    return "this slug is reserved";
  }
}
