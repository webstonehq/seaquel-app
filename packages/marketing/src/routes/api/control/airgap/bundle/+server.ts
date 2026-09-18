/**
 * POST /api/control/airgap/bundle — issue a signed offline license bundle.
 *
 * The owner of a self-hosted Seaquel tenant calls this from
 * `/dashboard/[slug]/airgap` to download a new bundle. The bundle is a
 * signed Ed25519 envelope (see `$lib/server/airgap/bundle-signer`) that
 * the self-hosted container's offline dispatcher reads on next boot to
 * decide which license keys are entitled, which are revoked, and when
 * the bundle expires.
 *
 * Auth: owner-only. We require a Better Auth session whose user id
 * matches `tenant.ownerUserId`. Non-owners (and members) 404 — leaking
 * "this tenant exists" to non-members is information we don't want to
 * hand out, matching the pattern in `/dashboard/[slug]/+layout.server.ts`.
 *
 * Side effects:
 *   - Inserts one `IssuedBundle` audit row per successful issuance,
 *     capturing the canonical payload SHA-256 and the signer's pubkey
 *     fingerprint. The dashboard surfaces these to ops; a future task
 *     enforces monotonic `notAfter` against the most recent row.
 *   - Does NOT mutate `License` or `TenantMember`. Bundle issuance is
 *     a read-only snapshot of those tables at the call time.
 *
 * The response body is the JSON-serialised `SignedEnvelope`. We set
 * `Content-Type: application/octet-stream` and `Content-Disposition:
 * attachment` so a browser download lands on disk as a `.bundle` file —
 * Task 8's upload endpoint on the seaquel side accepts the same bytes
 * verbatim.
 */
import { error } from "@sveltejs/kit";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { IssuedBundle } from "$lib/entities/issued-bundle";
import { License } from "$lib/entities/license";
import { Revocation } from "$lib/entities/revocation";
import { Tenant } from "$lib/entities/tenant";
import { TenantMember } from "$lib/entities/tenant-member";
import { requireUserId } from "$lib/server/control/auth";
import {
  parseGraceSeconds,
  readEnv,
} from "$lib/server/control/env";
import { parseProductMap } from "$lib/server/control/dodo";
import { enforceRateLimit } from "$lib/server/rate-limit";
import {
  canonicalize,
  signBundle,
  type BundlePayload,
} from "$lib/server/airgap/bundle-signer";
import { bytesToHex } from "$lib/server/airgap/canonical";
import { computeBundleNotAfter } from "$lib/server/airgap/expiry";

interface BundleRequest {
  tenantId: string;
}

export const POST: RequestHandler = async (event) => {
  // 5 issuances/min/IP is well above the once-per-rotation legitimate rate
  // (a human owner clicking "download bundle"). A retry loop on a flaky
  // network has plenty of headroom; a script iterating subscriptionIds
  // gets clipped fast.
  await enforceRateLimit(event, {
    bucket: "airgap-bundle",
    windowSeconds: 60,
    max: 5,
  });

  const ownerUserId = requireUserId();

  let body: BundleRequest;
  try {
    body = (await event.request.json()) as BundleRequest;
  } catch {
    throw error(400, "invalid JSON body");
  }
  const tenantId = body.tenantId?.trim();
  if (!tenantId) throw error(400, "tenantId is required");

  const tenant = await remult.repo(Tenant).findId(tenantId).catch(() => null);
  // 404 for "doesn't exist" and "not yours" — matches the dashboard
  // pattern and avoids leaking tenant existence.
  if (!tenant || tenant.ownerUserId !== ownerUserId) {
    throw error(404, "tenant not found");
  }
  if (tenant.platform !== "self-hosted") {
    throw error(400, "not_self_hosted");
  }

  const license = await remult.repo(License).findId(tenant.licenseId);
  if (!license) throw error(500, "tenant has no backing license");

  const env = readEnv(event);
  if (!env.SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY) {
    // Loud config failure rather than silently issuing an unsigned blob.
    console.error("[airgap:bundle] SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY not set");
    throw error(500, "bundle signing key not configured");
  }

  // Seat-overcommit guard: mirrors the seat-quota check in
  // `TenantMember.invite` (lines 170-176 of tenant-member.ts). We refuse
  // to issue a bundle that would entitle more keys than the license sold
  // — that would let an owner over-provision seats by going air-gapped.
  const occupied = await remult.repo(TenantMember).count({
    tenantId: tenant.id,
    status: ["active", "pending"],
  });
  if (occupied > license.seats) {
    throw error(409, "seats_overcommitted");
  }

  // Collect bound seat tokens. One entry per active/pending member with
  // a non-empty licenseKey. Removed rows free their slot, in lockstep with
  // the seat-quota math above.
  const members = await remult.repo(TenantMember).find({
    where: { tenantId: tenant.id, status: ["active", "pending"] },
  });
  const seatTokens: BundlePayload["seat_tokens"] = [];
  let ownerSeen = false;
  for (const m of members) {
    if (!m.licenseKey) continue;
    const role = m.role === "owner" ? "owner" : "member";
    if (role === "owner") ownerSeen = true;
    seatTokens.push({ key: m.licenseKey, role });
  }

  // The owner row MUST be in the bundle even if its licenseKey hasn't
  // been bound yet (e.g. the owner activated through the dashboard and
  // hasn't run /api/cloud/bind-member yet). We use the License's own
  // licenseKey as the owner key in that case — that's the same key the
  // self-hosted side activated against on first boot.
  if (!ownerSeen) {
    if (!license.licenseKey) {
      throw error(400, "license has no key — activate it at /dashboard/activate first");
    }
    seatTokens.push({ key: license.licenseKey, role: "owner" });
  }

  // Pad with synthetic vacant tokens so the bundle always advertises the
  // full seat capacity. The self-hosted dispatcher uses these to know how
  // many invitations the owner can still hand out offline.
  for (let i = seatTokens.length; i < license.seats; i++) {
    seatTokens.push({
      key: `airgap-vacant-${tenant.id}-${i}`,
      role: "member",
    });
  }

  // Revocation deny-list for this subscription. Empty array is the
  // common case and is always emitted (canonical-JSON pins this).
  const revocations = license.dodoSubscriptionId
    ? await remult.repo(Revocation).find({
        where: { subscriptionId: license.dodoSubscriptionId },
      })
    : [];
  const revokedKeys = revocations.map((r) => r.licenseKey).filter((k) => !!k);

  // Tier resolution. `License.planId` is the Dodo product id; map it to
  // our internal tier name (e.g. `individual`/`business`) via the
  // PUBLIC_DODO_PRODUCT_MAP env var. Fall back to the raw product id if
  // the map is missing or doesn't list this product — better an opaque
  // tier in the bundle than a 500 on a Dodo misconfig.
  const productMap = parseProductMap(env.PUBLIC_DODO_PRODUCT_MAP);
  const tier = productMap[license.planId] ?? license.planId ?? "personal";

  const issuedAt = Math.floor(Date.now() / 1000);
  const notBefore = issuedAt - 60;

  // `not_after` = license-cycle end + configured grace, or 7 days after
  // cancellation if the license is no longer active. The latter still
  // issues a bundle so the self-hosted side can quiesce sessions
  // gracefully rather than hard-locking on next boot — but only until
  // that window closes.
  const notAfter = computeBundleNotAfter(
    license,
    parseGraceSeconds(env.SEAQUEL_AIRGAP_GRACE_SECONDS),
    issuedAt,
  );
  if (notAfter <= issuedAt) throw error(410, "license_expired");

  const payload: BundlePayload = {
    version: 1,
    issued_at: issuedAt,
    not_before: notBefore,
    not_after: notAfter,
    subscription_id: license.dodoSubscriptionId,
    tenant_slug: tenant.slug,
    tier,
    seats: license.seats,
    seat_tokens: seatTokens,
    revoked_keys: revokedKeys,
    // Issued directly by the control plane, not delegated to an installer.
    issued_by_install_id: null,
  };

  const envelope = await signBundle(
    payload,
    env.SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY,
  );

  // Capture the canonical SHA-256 ourselves so the audit row records
  // exactly what we signed, byte-for-byte. We can't pull this off the
  // envelope (which only carries the signature + fingerprint), so
  // re-canonicalise and hash here. Same canonicaliser the signer used.
  const canonicalBytes = canonicalize(payload as unknown as Parameters<typeof canonicalize>[0]);
  const digest = await crypto.subtle.digest("SHA-256", canonicalBytes as Uint8Array<ArrayBuffer>);
  const payloadSha256 = bytesToHex(new Uint8Array(digest));

  await remult.repo(IssuedBundle).insert({
    subscriptionId: license.dodoSubscriptionId,
    licenseId: license.id,
    tenantId: tenant.id,
    issuedByUserId: ownerUserId,
    issuedAt,
    notAfter,
    seatTokensSnapshot: seatTokens as unknown[],
    revokedKeysSnapshot: revokedKeys as unknown[],
    payloadSha256,
    pubkeyFingerprint: envelope.pubkey_fingerprint,
  });

  const filename = `seaquel-airgap-${tenant.slug}-${issuedAt}.bundle`;
  return new Response(JSON.stringify(envelope), {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Bundles are short-lived in cache terms — never store, always
      // re-fetch from the control plane.
      "Cache-Control": "no-store",
    },
  });
};
