import { error } from "@sveltejs/kit";
import { remult } from "remult";
import { Tenant } from "$lib/entities/tenant";
import { TenantMember } from "$lib/entities/tenant-member";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  const user = remult.user;
  if (!user?.id) throw error(401, "unauthorized");

  // Look up the tenant first, then verify membership. We return 404
  // uniformly for "doesn't exist" and "not a member" so we don't leak
  // tenant existence to callers who aren't on the seat list.
  const tenant = await remult
    .repo(Tenant)
    .findFirst({ slug: params.slug });
  if (!tenant) throw error(404, "tenant not found");

  const isOwner = tenant.ownerUserId === user.id;
  const member = isOwner
    ? null
    : await remult.repo(TenantMember).findFirst({
        tenantId: tenant.id,
        userId: user.id,
        status: "active",
      });
  if (!isOwner && !member) throw error(404, "tenant not found");

  return {
    tenant,
    isOwner,
  };
};
