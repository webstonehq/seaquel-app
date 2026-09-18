/**
 * GET /api/cloud/tenant-info — server-to-server.
 *
 * The per-tenant container fetches its own context on boot (and on
 * cache miss). Returns the bare minimum needed to:
 *   - render the tenant name in chrome,
 *   - decide whether to render the suspended-tenant page,
 *   - resolve the owner email so the owner-claim signup path knows
 *     whether to bind the visitor as `owner` vs `member`.
 *
 * Authed via `requireCloudAuth` in strict mode — the `X-Install-Id` +
 * `X-License-Key` header pair, with the license required to belong to
 * the install's Dodo subscription.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { License } from "$lib/entities/license";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireCloudAuth } from "$lib/server/control/cloud-auth";
import { parseProductMap } from "$lib/server/control/dodo";
import { readEnv } from "$lib/server/control/env";

export const GET: RequestHandler = async (event) => {
  const { tenant } = await requireCloudAuth(event, { strict: true });

  const license = await remult.repo(License).findId(tenant.licenseId);
  if (!license) throw error(500, "tenant has no backing license");

  const ownerRow = await remult
    .repo(TenantMember)
    .findFirst({ tenantId: tenant.id, role: "owner" });

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
