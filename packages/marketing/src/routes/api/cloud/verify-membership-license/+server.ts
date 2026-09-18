/**
 * POST /api/cloud/verify-membership-license — server-to-server.
 *
 * The per-tenant container's signup action calls this when a visitor
 * presents a license key. We answer:
 *
 *   - Is the license real and active in our local mirror?
 *   - Does it share the tenant's anchor `dodoSubscriptionId`?
 *   - Is it not already in use by another `TenantMember` (in any tenant)?
 *   - Is the visitor the tenant owner — should we bind as `owner`?
 *
 * The same license being re-presented on the same tenant by the same
 * email is treated as `ok` with the existing role, so an interrupted
 * signup can be retried without surfacing "already in use".
 *
 * Errors are returned as `{ ok: false, error: <enum> }` rather than
 * thrown — the caller renders them inline on the signup form.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { License } from "$lib/entities/license";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireCloudAuth } from "$lib/server/control/cloud-auth";
import { parseProductMap } from "$lib/server/control/dodo";
import { readEnv } from "$lib/server/control/env";
import { enforceRateLimit } from "$lib/server/rate-limit";

interface VerifyRequest {
  licenseKey: string;
  signupEmail: string;
}

type VerifyError =
  | "license_not_found"
  | "license_inactive"
  | "wrong_subscription"
  | "license_already_in_other_tenant";

export const POST: RequestHandler = async (event) => {
  // A visitor presenting a license key on a tenant signup form is the
  // attack surface here. Throttle before the (non-strict) auth check so
  // license-key probing pays an IP-level cost. A human re-typing a typo
  // a few times stays comfortably under 10/min.
  await enforceRateLimit(event, {
    bucket: "verify-membership-license",
    windowSeconds: 60,
    max: 10,
  });

  const { tenant } = await requireCloudAuth(event, { strict: false });

  let body: VerifyRequest;
  try {
    body = (await event.request.json()) as VerifyRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  const licenseKey = body.licenseKey?.trim() ?? "";
  const signupEmail = body.signupEmail?.trim().toLowerCase() ?? "";
  if (!licenseKey || !signupEmail) {
    throw error(400, "licenseKey and signupEmail are required");
  }

  const tenantLicense = await remult.repo(License).findId(tenant.licenseId);
  if (!tenantLicense) throw error(500, "tenant has no backing license");

  const presented = await remult
    .repo(License)
    .findFirst({ licenseKey });
  if (!presented) {
    return json({ ok: false, error: "license_not_found" satisfies VerifyError });
  }
  if (presented.status !== "active") {
    return json({ ok: false, error: "license_inactive" satisfies VerifyError });
  }
  if (presented.dodoSubscriptionId !== tenantLicense.dodoSubscriptionId) {
    return json({
      ok: false,
      error: "wrong_subscription" satisfies VerifyError,
    });
  }

  // Existing membership on this same tenant by this same license — let
  // them retry signup without surfacing a duplicate error.
  const sameTenantSameKey = await remult
    .repo(TenantMember)
    .findFirst({
      tenantId: tenant.id,
      licenseKey,
      status: ["active", "pending"],
    });

  // Otherwise, no other tenant should already claim this key. Owner
  // rows pre-exist on this tenant from provisioning — those don't
  // count as "another tenant".
  const otherActive = await remult
    .repo(TenantMember)
    .findFirst({
      licenseKey,
      status: "active",
    });
  if (
    otherActive &&
    !sameTenantSameKey &&
    otherActive.tenantId !== tenant.id
  ) {
    return json({
      ok: false,
      error: "license_already_in_other_tenant" satisfies VerifyError,
    });
  }

  const productMap = parseProductMap(readEnv(event).PUBLIC_DODO_PRODUCT_MAP);

  // Owner-claim path: the visitor is the owner if their email matches
  // the unbound owner row AND the license they're presenting is the
  // tenant's anchor license. Otherwise they bind as `member`.
  const ownerRow = await remult
    .repo(TenantMember)
    .findFirst({ tenantId: tenant.id, role: "owner" });
  const isOwnerClaim =
    !!ownerRow &&
    ownerRow.email.toLowerCase() === signupEmail &&
    presented.id === tenantLicense.id &&
    !ownerRow.containerUserId;

  return json({
    ok: true,
    subscriptionId: presented.dodoSubscriptionId,
    tier: productMap[presented.planId] ?? "personal",
    role: isOwnerClaim ? "owner" : "member",
  });
};
