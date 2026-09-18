/**
 * GET /api/control/tenants/[id]/status
 *
 * Cheap polling endpoint for the dashboard's "we're provisioning your
 * tenant" loading screen. Returns the bare minimum fields the UI needs:
 * status (provisioning/active/etc), publicUrl, and the most recent
 * provision_event so we can surface "still waiting on Fly" vs "DNS
 * record written" without reloading the world.
 *
 * Ownership-checked the same way as the parent route — 404 not 403.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { Tenant } from "$lib/entities/tenant";
import { ProvisionEvent } from "$lib/entities/provision-event";
import { requireUserId } from "$lib/server/control/auth";

export const GET: RequestHandler = async (event) => {
  const ownerUserId = requireUserId();
  const tenant = await remult.repo(Tenant).findId(event.params.id!);
  if (!tenant || tenant.ownerUserId !== ownerUserId) {
    throw error(404, "tenant not found");
  }

  const lastEvent = await remult
    .repo(ProvisionEvent)
    .findFirst(
      { tenantId: tenant.id },
      { orderBy: { at: "desc" } },
    );

  return json({
    id: tenant.id,
    status: tenant.status,
    publicUrl: tenant.publicUrl,
    lastEvent: lastEvent?.event ?? null,
    lastEventAt: lastEvent?.at ?? null,
  });
};
