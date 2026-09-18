/**
 * POST   /api/control/airgap/revoke   — add a key to the deny-list
 * DELETE /api/control/airgap/revoke   — remove a key from the deny-list
 *
 * The owner of a subscription manages the air-gap revocation list from
 * /dashboard/[slug]/airgap. Rows here are read by
 * `/api/control/airgap/bundle` when assembling the next bundle's
 * `revoked_keys` array — the self-hosted dispatcher then refuses
 * sessions for revoked keys on next boot.
 *
 * Idempotent on (subscriptionId, licenseKey):
 *   - POST: re-revoking an already-revoked key returns 200 with
 *     `alreadyRevoked: true`. The UNIQUE index on the table is the
 *     ultimate guard; we pre-check via findFirst to keep the response
 *     informative.
 *   - DELETE: removing a non-existent row 404s. Callers that want
 *     idempotent un-revoke can treat 404 as success.
 *
 * Auth: Better Auth session, plus an ownership check —
 * `License.ownerUserId === remult.user.id AND
 *  License.dodoSubscriptionId === subscriptionId`. We don't 404 on
 * missing license (that would leak subscription ids by timing); we 403.
 */
import { error, json } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { License } from "$lib/entities/license";
import { Revocation } from "$lib/entities/revocation";
import { requireUserId } from "$lib/server/control/auth";
import { enforceRateLimit } from "$lib/server/rate-limit";

interface RevokeRequest {
  subscriptionId: string;
  licenseKey: string;
  reason?: "manual" | "cycle_reduced";
}

/**
 * Verify the caller owns the subscription. Returns the anchor License
 * row on success; throws SvelteKit errors on failure.
 */
async function requireSubscriptionOwner(
  userId: string,
  subscriptionId: string,
): Promise<License> {
  if (!subscriptionId) throw error(400, "subscriptionId is required");
  const license = await remult.repo(License).findFirst({
    dodoSubscriptionId: subscriptionId,
    ownerUserId: userId,
  });
  if (!license) throw error(403, "not authorized for this subscription");
  return license;
}

export const POST: RequestHandler = async (event) => {
  // Tight rate-limit — revoking is a low-frequency human action, and a
  // looped revoke + bundle-issue pair could otherwise spin a flood of
  // audit rows.
  await enforceRateLimit(event, {
    bucket: "airgap-revoke",
    windowSeconds: 60,
    max: 20,
  });

  const userId = requireUserId();

  let body: RevokeRequest;
  try {
    body = (await event.request.json()) as RevokeRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  const subscriptionId = body.subscriptionId?.trim() ?? "";
  const licenseKey = body.licenseKey?.trim() ?? "";
  const reason = body.reason ?? "manual";
  if (!licenseKey) throw error(400, "licenseKey is required");
  if (reason !== "manual" && reason !== "cycle_reduced") {
    throw error(400, "reason must be 'manual' or 'cycle_reduced'");
  }

  await requireSubscriptionOwner(userId, subscriptionId);

  const existing = await remult.repo(Revocation).findFirst({
    subscriptionId,
    licenseKey,
  });
  if (existing) {
    return json({ ok: true, alreadyRevoked: true });
  }

  try {
    await remult.repo(Revocation).insert({
      subscriptionId,
      licenseKey,
      revokedByUserId: userId,
      revokedAt: Math.floor(Date.now() / 1000),
      reason,
    });
  } catch (err) {
    // Concurrent insert raced us through the findFirst gap — the
    // UNIQUE index caught it. Same treatment as the Dodo webhook
    // handler: treat unique-violation as success.
    const msg = err instanceof Error ? err.message : String(err);
    if (!/unique|duplicate/i.test(msg)) {
      console.error("[airgap:revoke] insert failed", err);
      throw error(500, "failed to revoke");
    }
    return json({ ok: true, alreadyRevoked: true });
  }

  return json({ ok: true });
};

export const DELETE: RequestHandler = async (event) => {
  await enforceRateLimit(event, {
    bucket: "airgap-revoke",
    windowSeconds: 60,
    max: 20,
  });

  const userId = requireUserId();

  const subscriptionId = event.url.searchParams.get("subscriptionId")?.trim() ?? "";
  const licenseKey = event.url.searchParams.get("licenseKey")?.trim() ?? "";
  if (!licenseKey) throw error(400, "licenseKey is required");

  await requireSubscriptionOwner(userId, subscriptionId);

  const existing = await remult.repo(Revocation).findFirst({
    subscriptionId,
    licenseKey,
  });
  if (!existing) throw error(404, "revocation not found");

  await remult.repo(Revocation).delete(existing.id);
  return json({ ok: true });
};
