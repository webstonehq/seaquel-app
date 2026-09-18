/**
 * The dashboard layout already guards on auth, so by the time we run the
 * user is signed in. We need three extra things for the onboarding form:
 *   - the owner's email (so we can skip the Profile step)
 *   - the License we're provisioning a tenant for (resolved from
 *     `?licenseId=`); this drives the plan summary in the form
 *   - early validation that the License is active, owned by the caller,
 *     and not already backing a tenant — so we fail fast on the form
 *     instead of after the user fills out fields and clicks Launch
 */
import { error, redirect } from "@sveltejs/kit";
import { remult } from "remult";
import type { PageServerLoad } from "./$types";
import { auth as betterAuth } from "$lib/server/remult/better-auth";
import { License } from "$lib/entities/license";
import { findTenantForSubscription } from "$lib/entities/tenant";

export const load: PageServerLoad = async ({ url, request }) => {
  const userId = remult.user?.id;
  if (!userId) throw error(401, "unauthorized");

  const licenseId = url.searchParams.get("licenseId") ?? "";
  if (!licenseId) {
    // Send the user back to the dashboard where they can pick (or buy)
    // a license. This page is not reachable without one.
    throw redirect(303, "/dashboard");
  }

  const license = await remult.repo(License).findId(licenseId);
  if (!license || license.ownerUserId !== userId) {
    throw error(404, "license not found");
  }
  if (license.status !== "active") {
    throw error(403, `license is ${license.status}`);
  }
  // Mirror the API-side gate: the form should never be reachable for
  // a half-initialised purchase. Bounce back to the dashboard which
  // surfaces the "Verify license" CTA in this state.
  if (!license.licenseKey) {
    throw redirect(303, "/dashboard/activate");
  }
  const existing = await findTenantForSubscription(license);
  if (existing) {
    // Already provisioned — bounce to it instead of letting the user
    // double-fund the same license.
    throw redirect(303, `/dashboard/${existing.slug}`);
  }

  const session = await betterAuth.api.getSession({ headers: request.headers });

  return {
    ownerEmail: session?.user.email ?? null,
    license,
  };
};
