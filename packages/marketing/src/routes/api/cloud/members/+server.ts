/**
 * GET /api/cloud/members — server-to-server.
 *
 * Returns the active member list for the calling tenant so the
 * container's Team settings UI can render it. License keys are masked
 * (last 4 chars only) — the container has no business knowing the full
 * key for a different user.
 */
import { json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireCloudAuth } from "$lib/server/control/cloud-auth";

export const GET: RequestHandler = async (event) => {
  const { tenant } = await requireCloudAuth(event, { strict: true });

  const members = await remult.repo(TenantMember).find({
    where: { tenantId: tenant.id, status: "active" },
    orderBy: { invitedAt: "asc" },
  });

  return json(
    members.map((m) => ({
      tenantMemberId: m.id,
      containerUserId: m.containerUserId,
      email: m.email,
      role: m.role,
      boundAt: m.boundAt?.toISOString() ?? m.acceptedAt?.toISOString() ?? null,
      maskedLicenseKey: maskKey(m.licenseKey),
    })),
  );
};

function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 4) return key;
  return `••••-${key.slice(-4)}`;
}
