/**
 * Loads the seat roster + license capacity for a tenant. Owner-only —
 * non-owners get an empty list and the page renders a read-only view.
 */
import { error } from "@sveltejs/kit";
import { remult } from "remult";
import type { PageServerLoad } from "./$types";
import { TenantMember } from "$lib/entities/tenant-member";
import { License } from "$lib/entities/license";

export const load: PageServerLoad = async ({ parent }) => {
  const { tenant, isOwner } = await parent();

  if (!isOwner) {
    // Non-owners see only themselves on the member list. Cheaper to
    // render a degraded view than to 404 the whole tab.
    const userId = remult.user?.id ?? "";
    const me = userId
      ? await remult
          .repo(TenantMember)
          .findFirst({ tenantId: tenant.id, userId })
      : null;
    return {
      members: me ? [me] : [],
      license: null,
      isOwner: false,
    };
  }

  const license = await remult.repo(License).findId(tenant.licenseId);
  if (!license) throw error(500, "tenant has no backing license");

  const members = await remult
    .repo(TenantMember)
    .find({ where: { tenantId: tenant.id } });

  return {
    members,
    license,
    isOwner: true,
  };
};
