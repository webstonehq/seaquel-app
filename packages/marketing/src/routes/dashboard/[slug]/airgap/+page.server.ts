/**
 * Owner-facing dashboard tab for managing the air-gapped (offline)
 * license bundle of a self-hosted tenant. Mirrors the auth/404 pattern
 * in `dashboard/[slug]/members/+page.server.ts` (owner-only, 404
 * uniformly for "no access").
 *
 * Surfaces five things to the page:
 *   - The anchor License row (tier, seats, billing cycle).
 *   - Active+pending TenantMember rows (the seat tokens the next bundle
 *     would carry, plus a row each for revocation toggling).
 *   - Existing Revocation rows for the subscription (the deny-list).
 *   - The 5 most-recent IssuedBundle audit rows.
 *   - `computedNotAfter` — the unix-seconds expiry the NEXT-downloaded
 *     bundle would carry. We replicate the bundle endpoint's math here
 *     so the dashboard can preview the date without a network roundtrip
 *     (see `/api/control/airgap/bundle/+server.ts` lines 174-184).
 *
 * Self-hosted only. Cloud tenants get a 404 because they never download
 * a bundle — they're always online against the control plane.
 */
import { error } from "@sveltejs/kit";
import { remult } from "remult";
import type { PageServerLoad } from "./$types";
import { IssuedBundle } from "$lib/entities/issued-bundle";
import { License } from "$lib/entities/license";
import { Revocation } from "$lib/entities/revocation";
import { TenantMember } from "$lib/entities/tenant-member";
import {
  DEFAULT_AIRGAP_GRACE_SECONDS,
  parseGraceSeconds,
  readEnv,
} from "$lib/server/control/env";
import { parseProductMap } from "$lib/server/control/dodo";
import { computeBundleNotAfter } from "$lib/server/airgap/expiry";


export const load: PageServerLoad = async (event) => {
  const { tenant, isOwner } = await event.parent();

  // Self-hosted only. Cloud tenants never download a bundle — keep the
  // tab invisible by 404ing rather than rendering a stub page.
  if (tenant.platform !== "self-hosted") throw error(404, "not found");
  // Consistent with the rest of the dashboard: non-owners 404 instead
  // of seeing a degraded view. Bundle issuance is owner-only by design.
  if (!isOwner) throw error(404, "not found");

  const license = await remult.repo(License).findId(tenant.licenseId);
  if (!license) throw error(500, "tenant has no backing license");

  const subscriptionId = license.dodoSubscriptionId;

  const [members, revocations, recentBundles] = await Promise.all([
    remult.repo(TenantMember).find({
      where: { tenantId: tenant.id, status: ["active", "pending"] },
      orderBy: { invitedAt: "asc" },
    }),
    subscriptionId
      ? remult
          .repo(Revocation)
          .find({ where: { subscriptionId } })
      : Promise.resolve([]),
    subscriptionId
      ? remult.repo(IssuedBundle).find({
          where: { subscriptionId },
          orderBy: { issuedAt: "desc" },
          limit: 5,
        })
      : Promise.resolve([]),
  ]);

  // Preview the next-bundle expiry. The endpoint recomputes from scratch
  // when issuing, so this is read-only — the UI just shows the user what
  // the click-through download WOULD bake in.
  const env = readEnv(event);
  const graceSeconds = parseGraceSeconds(env.SEAQUEL_AIRGAP_GRACE_SECONDS);
  const issuedAt = Math.floor(Date.now() / 1000);
  const computedNotAfter = computeBundleNotAfter(license, graceSeconds, issuedAt);

  // Resolve the human-readable tier label the same way the bundle
  // endpoint does, so the dashboard's metadata header matches what the
  // bundle's `tier` claim will say.
  const productMap = parseProductMap(env.PUBLIC_DODO_PRODUCT_MAP);
  const tier = productMap[license.planId] ?? license.planId ?? "personal";

  return {
    license: {
      id: license.id,
      planId: license.planId,
      seats: license.seats,
      status: license.status,
      currentPeriodEnd: license.currentPeriodEnd?.toISOString() ?? null,
      dodoSubscriptionId: license.dodoSubscriptionId,
      licenseKey: license.licenseKey,
    },
    tier,
    members: members.map((m) => ({
      id: m.id,
      email: m.email,
      role: m.role,
      status: m.status,
      licenseKey: m.licenseKey,
    })),
    revocations: revocations.map((r) => ({
      id: r.id,
      licenseKey: r.licenseKey,
      reason: r.reason,
      revokedAt: r.revokedAt,
    })),
    recentBundles: recentBundles.map((b) => ({
      id: b.id,
      issuedAt: b.issuedAt,
      notAfter: b.notAfter,
      payloadSha256: b.payloadSha256,
      pubkeyFingerprint: b.pubkeyFingerprint,
      issuedByUserId: b.issuedByUserId,
    })),
    computedNotAfter,
    graceSeconds,
    defaultGraceSeconds: DEFAULT_AIRGAP_GRACE_SECONDS,
  };
};
