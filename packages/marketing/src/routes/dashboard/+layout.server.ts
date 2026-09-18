/**
 * Auth + license gate for the entire dashboard.
 *
 * Three tiers of access:
 *   1. **Public pages** (`/dashboard/signup`, `/dashboard/signin`) — no
 *      session required, no license required.
 *   2. **Activate page** (`/dashboard/activate`) — session required, no
 *      license required (this is where the user pastes a key).
 *   3. **Everything else** — session required. Pages render their own
 *      empty-state CTA when the user has no licenses (e.g. the
 *      dashboard root says "Buy a license"); we don't bounce to
 *      /activate anymore — manual activation is one option, not the
 *      forced path.
 */
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { remult } from "remult";
import { Tenant } from "$lib/entities/tenant";
import { TenantMember } from "$lib/entities/tenant-member";
import { License } from "$lib/entities/license";

const PUBLIC_PATHS = new Set([
  "/dashboard/signup",
  "/dashboard/signin",
]);

export const load: LayoutServerLoad = async ({ url }) => {
  const user = remult.user;
  const isPublic = PUBLIC_PATHS.has(url.pathname);

  if (!user?.id) {
    if (isPublic) {
      return { user: null, tenants: [], licenses: [] };
    }
    throw redirect(303, `/dashboard/signin?redirect=${encodeURIComponent(url.pathname)}`);
  }

  // Licenses are listed under apiPrefilter (ownerUserId == user.id).
  // Auto-linking of unlinked rows happens at sign-in (Better Auth
  // session hook → `linkByVerifiedEmail`), so by the time we run every
  // claimed License has its ownerUserId set.
  const licenses = await remult
    .repo(License)
    .find({ where: { ownerUserId: user.id } });

  // Tenants the user owns directly.
  const ownedTenants = await remult
    .repo(Tenant)
    .find({ where: { ownerUserId: user.id } });

  // Tenants the user is an active member of (as invited teammate).
  const memberRows = await remult
    .repo(TenantMember)
    .find({ where: { userId: user.id, status: "active" } });
  const memberTenantIds = memberRows
    .map((m) => m.tenantId)
    .filter((id) => !ownedTenants.some((t) => t.id === id));

  const memberTenants = memberTenantIds.length
    ? await remult.repo(Tenant).find({ where: { id: memberTenantIds } })
    : [];

  return {
    user,
    licenses: licenses,
    tenants: [...ownedTenants, ...memberTenants],
  };
};
