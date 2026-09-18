/**
 * POST /api/cloud/bind-member — server-to-server.
 *
 * Called by the per-tenant container after it has successfully verified
 * a license and created the local Better Auth user. Records the binding
 * in `tenant_members` so:
 *   - the seat quota is enforced (one row per active member),
 *   - subsequent verify-membership-license calls reject the same key
 *     in another tenant,
 *   - subscription-cancel webhooks can find affected memberships.
 *
 * Two cases:
 *
 *   1. **Owner claim** — an existing owner row (created at provision
 *      time with `containerUserId = ""`) matches the email; we update
 *      it in place rather than inserting.
 *   2. **New member** — insert a new row.
 *
 * Idempotent on (tenantId, licenseKey): re-calling with the same key
 * returns the existing row instead of erroring, so a flaky retry from
 * the container's signup action doesn't double-bind.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireCloudAuth } from "$lib/server/control/cloud-auth";
import { enforceRateLimit } from "$lib/server/rate-limit";

interface BindRequest {
  licenseKey: string;
  containerUserId: string;
  email: string;
  role?: "owner" | "member";
}

export const POST: RequestHandler = async (event) => {
  // Strict cloud-auth still applies below, but rate-limit first so a
  // misbehaving container (or a forged install header that happens to
  // match) can't hammer this path. 5/min/IP is well above the
  // once-per-signup legitimate rate.
  await enforceRateLimit(event, {
    bucket: "bind-member",
    windowSeconds: 60,
    max: 5,
  });

  const { tenant } = await requireCloudAuth(event, { strict: true });

  let body: BindRequest;
  try {
    body = (await event.request.json()) as BindRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  const licenseKey = body.licenseKey?.trim() ?? "";
  const containerUserId = body.containerUserId?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const role = body.role ?? "member";
  if (!licenseKey || !containerUserId || !email) {
    throw error(
      400,
      "licenseKey, containerUserId, and email are required",
    );
  }
  if (role !== "owner" && role !== "member") {
    throw error(400, "role must be 'owner' or 'member'");
  }

  // Idempotent retry: same tenant + same key → return existing.
  const existing = await remult
    .repo(TenantMember)
    .findFirst({ tenantId: tenant.id, licenseKey });
  if (existing) {
    if (existing.containerUserId && existing.containerUserId !== containerUserId) {
      throw error(409, "license already bound to a different user in this tenant");
    }
    if (!existing.containerUserId || !existing.boundAt) {
      const updated = await remult.repo(TenantMember).save({
        ...existing,
        containerUserId,
        email,
        status: "active",
        boundAt: new Date(),
        acceptedAt: existing.acceptedAt ?? new Date(),
      });
      return json({ tenantMemberId: updated.id });
    }
    return json({ tenantMemberId: existing.id });
  }

  // Owner-claim path: there's a pre-existing owner row from provisioning
  // that we update in place. The role check is defense in depth — the
  // verify-membership-license handler is what actually decides this.
  if (role === "owner") {
    const ownerRow = await remult
      .repo(TenantMember)
      .findFirst({ tenantId: tenant.id, role: "owner" });
    if (ownerRow && !ownerRow.containerUserId) {
      const updated = await remult.repo(TenantMember).save({
        ...ownerRow,
        email,
        licenseKey,
        containerUserId,
        status: "active",
        boundAt: new Date(),
        acceptedAt: ownerRow.acceptedAt ?? new Date(),
      });
      return json({ tenantMemberId: updated.id });
    }
  }

  const inserted = await remult.repo(TenantMember).insert({
    tenantId: tenant.id,
    email,
    licenseKey,
    containerUserId,
    role,
    status: "active",
    acceptedAt: new Date(),
    boundAt: new Date(),
  });

  return json({ tenantMemberId: inserted.id });
};
