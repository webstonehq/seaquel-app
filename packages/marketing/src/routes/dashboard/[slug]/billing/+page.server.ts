/**
 * Creates a Dodo customer portal session at load time so the billing
 * page can render a plain link.
 *
 * Resolves the Dodo customer ID via the License linked to this tenant
 * (1:1 — Tenant.licenseId is required and unique). Falls back to a
 * Dodo API lookup by the user's email when the License row is missing
 * the customer id (manual activation path).
 */
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { remult } from "remult";
import { License } from "$lib/entities/license";
import { BASE_URLS } from "$lib/server/control/dodo";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { tenant, isOwner } = await parent();
  // The portal link grants full control of the owner's Dodo customer
  // account (payment method, invoices, cancellation) — owner only.
  if (!isOwner) throw error(404, "not found");

  const apiKey = env.DODO_API_KEY;
  const mode = env.DODO_MODE || "test";
  const baseUrl = BASE_URLS[mode] ?? BASE_URLS.test;
  if (!apiKey) return { portalLink: null };

  const customerId = await resolveCustomerId(tenant.licenseId, baseUrl, apiKey);
  if (!customerId) return { portalLink: null };

  try {
    const res = await fetch(
      `${baseUrl}/customers/${customerId}/customer-portal/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[billing] portal session error", {
        status: res.status,
        customerId,
        body: text,
      });
      return { portalLink: null };
    }
    const data = (await res.json()) as { link: string };
    return { portalLink: data.link };
  } catch (e) {
    console.error("[billing] portal session fetch failed", e);
    return { portalLink: null };
  }
};

async function resolveCustomerId(
  licenseId: string,
  baseUrl: string,
  apiKey: string,
): Promise<string | null> {
  const license = await remult.repo(License).findId(licenseId);
  if (!license) return null;
  if (license.dodoCustomerId) return license.dodoCustomerId;

  // No customer id on the License (manual activation path that didn't
  // pick one up). Try Dodo's email lookup and backfill so we don't hit
  // the API on every page load.
  if (!license.email) return null;

  const id = await lookupCustomerByEmail(license.email, baseUrl, apiKey);
  if (id) {
    await remult.repo(License).save({ ...license, dodoCustomerId: id });
    return id;
  }
  return null;
}

async function lookupCustomerByEmail(
  email: string,
  baseUrl: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `${baseUrl}/customers?email=${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(3000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ customer_id: string }>;
    return data[0]?.customer_id ?? null;
  } catch {
    return null;
  }
}
