/**
 * POST /api/control/licenses/activate
 *
 * The user pastes their Dodo license key (from the purchase email); we
 * validate it via the same `activateLicense` helper the desktop app
 * uses, then persist a `licenses` row in D1 linked to the current user.
 */
import { error, json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { License } from "$lib/entities/license";
import { requireUserId } from "$lib/server/control/auth";
import { activateLicense, type LicenseProxyResponse } from "$lib/license";
import { auth as betterAuth } from "$lib/server/remult/better-auth";
import { enforceRateLimit } from "$lib/server/rate-limit";

export const POST: RequestHandler = async (event) => {
  // Throttle license-key brute force. The endpoint is session-gated so
  // an attacker needs a real account first, but a compromised account
  // could still iterate keys at the Dodo API's pace; 10/min/IP keeps
  // that to a useful-only-for-human-paste rate.
  await enforceRateLimit(event, {
    bucket: "licenses-activate",
    windowSeconds: 60,
    max: 10,
  });

  const userId = requireUserId();

  const session = await betterAuth.api.getSession({
    headers: event.request.headers,
  });
  if (!session?.user.email) {
    throw error(401, "session missing user email");
  }
  const userEmail = session.user.email;

  const body = (await event.request.json()) as { licenseKey?: string };
  if (!body.licenseKey?.trim()) {
    throw error(400, "licenseKey is required");
  }
  const licenseKey = body.licenseKey.trim();

  // Fast path: already activated for this user.
  const existing = await remult
    .repo(License)
    .findFirst({ licenseKey, ownerUserId: userId });
  if (existing) {
    return json({ ok: true, license: existing });
  }

  // Never move a license another account already owns — for an N-seat
  // purchase the buyer owns every key, and a teammate pasting their seat
  // key here must not take it over. Checked before calling Dodo so a
  // rejected attempt doesn't burn one of the key's activations.
  const ownedElsewhere = await remult.repo(License).findFirst({ licenseKey });
  if (ownedElsewhere?.ownerUserId && ownedElsewhere.ownerUserId !== userId) {
    throw error(409, "This license key is already linked to another account");
  }

  const mode = env.DODO_MODE || "test";
  const instanceName = `cloud-${userId}`;
  const dodoRes = await activateLicense(
    licenseKey,
    instanceName,
    mode,
    publicEnv.PUBLIC_DODO_PRODUCT_MAP,
  );

  if (!dodoRes.ok) {
    const body = await dodoRes.json() as { message?: string };
    console.error("[license:activate] Dodo rejected", {
      status: dodoRes.status,
      mode,
      body,
    });
    throw error(400, "Invalid or expired license key");
  }

  let dodo: LicenseProxyResponse;
  try {
    dodo = (await dodoRes.json()) as LicenseProxyResponse;
  } catch (e) {
    console.error("[license:activate] failed to parse Dodo response", e);
    throw error(502, "Unexpected response from license service");
  }

  // Use the product_id directly from Dodo's response as planId.
  // Fall back to reverse-lookup from tier name if Dodo didn't include it.
  let planId = dodo.product_id ?? "";
  if (!planId) {
    const productMap: Record<string, string> = JSON.parse(
      publicEnv.PUBLIC_DODO_PRODUCT_MAP || "{}",
    );
    planId =
      Object.entries(productMap).find(([, v]) => v === dodo.tier)?.[0] ?? "";
  }

  const dodoCustomerId = dodo.customer_id ?? "";

  try {
    // 1. A webhook may already have created a row WITH the key
    //    (`license_key.created` arrived before activation).
    const byKey = await remult
      .repo(License)
      .findFirst({ licenseKey });
    if (byKey) {
      const linked = await remult.repo(License).save({
        ...byKey,
        ownerUserId: userId,
        planId: planId || byKey.planId,
        dodoCustomerId: dodoCustomerId || byKey.dodoCustomerId,
      });
      return json({ ok: true, license: linked });
    }

    // 2. Race window: `subscription.active` landed first (creates a row
    //    keyed by dodoSubscriptionId with `licenseKey = ""`) but
    //    `license_key.created` hasn't arrived. Find that keyless row by
    //    customer + owner and attach the key here so the later upsert
    //    by dodoSubscriptionId is a no-op rather than a UNIQUE-key clash.
    const keyless = dodoCustomerId
      ? await remult.repo(License).findFirst({
          ownerUserId: userId,
          dodoCustomerId,
          licenseKey: "",
        })
      : null;
    if (keyless) {
      const linked = await remult.repo(License).save({
        ...keyless,
        licenseKey,
        planId: planId || keyless.planId,
      });
      return json({ ok: true, license: linked });
    }

    // 3. No webhook row exists — create one. Seats default to 1; the
    //    eventual webhook upsert will overwrite seats with the real
    //    quantity.
    const license = await remult.repo(License).insert({
      email: dodo.customer_email ?? userEmail,
      planId,
      licenseKey,
      seats: 1,
      dodoCustomerId,
      dodoSubscriptionId: "",
      status: "active",
      ownerUserId: userId,
    });

    return json({ ok: true, license });
  } catch (e) {
    console.error("[license:activate] DB error", e);
    throw error(500, "Failed to save license");
  }
};
