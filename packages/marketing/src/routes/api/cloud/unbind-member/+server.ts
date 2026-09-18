/**
 * POST /api/cloud/unbind-member — server-to-server.
 *
 * Called when an admin removes a member from the per-tenant container's
 * Team UI. Soft-removes the row (`status = "removed"`) so the seat
 * frees up for re-invite while preserving the audit trail. Owner rows
 * cannot be removed — a tenant always has exactly one owner. This is
 * the only path that removes members; the dashboard intentionally has
 * no remove action because it can't tear down the container's local
 * Better Auth user/session in the same atomic step.
 *
 * The binding fields (`containerUserId`, `licenseKey`, `boundAt`) are
 * cleared on removal. Otherwise a subsequent signup with the same
 * license key would 409 in `bind-member` — its collision check matches
 * by `(tenantId, licenseKey)` regardless of status, and the stored
 * `containerUserId` would point at a now-deleted local user.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireCloudAuth } from "$lib/server/control/cloud-auth";

interface UnbindRequest {
  containerUserId: string;
}

export const POST: RequestHandler = async (event) => {
  const { tenant } = await requireCloudAuth(event, { strict: true });

  let body: UnbindRequest;
  try {
    body = (await event.request.json()) as UnbindRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  const containerUserId = body.containerUserId?.trim() ?? "";
  if (!containerUserId) throw error(400, "containerUserId is required");

  const member = await remult
    .repo(TenantMember)
    .findFirst({ tenantId: tenant.id, containerUserId });
  if (!member) throw error(404, "member not found");
  if (member.role === "owner") throw error(409, "cannot remove the tenant owner");
  if (member.status === "removed") return json({ ok: true });

  await remult.repo(TenantMember).save({
    ...member,
    status: "removed",
    containerUserId: "",
    licenseKey: "",
    boundAt: undefined,
  });
  return json({ ok: true });
};
