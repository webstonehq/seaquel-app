/**
 * POST /api/control/dodo/webhook — Dodo Payments webhook receiver.
 *
 * Two events together construct a License row, in either order:
 *
 *   - `subscription.active` carries `quantity`, `current_period_end`,
 *     `product_id`, `customer_id`, `subscription_id`, and the optional
 *     `metadata.userId` we set at checkout.
 *   - `license_key.created` carries the actual `key` string plus the
 *     same `subscription_id` that ties it back to the subscription.
 *
 * Dodo doesn't guarantee delivery order, so both handlers **upsert by
 * `dodoSubscriptionId`** — find the row if present, fill in whatever the
 * current event provides, otherwise create it. The unique idempotency
 * gate on `webhook-id` prevents a single event from being applied twice.
 *
 * Subscription lifecycle events (`cancelled`, `failed`, `expired`) flip
 * the License status AND mark the linked Tenant `suspended` so the
 * dashboard surfaces the change. Container/data deletion is a separate
 * grace-period sweep — we never destroy paid data on a single webhook.
 */
import { error, json, text } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { remult } from "remult";
import type { RequestHandler } from "./$types";
import { AppliedEvent } from "$lib/entities/applied-event";
import { License } from "$lib/entities/license";
import { Revocation } from "$lib/entities/revocation";
import { Tenant } from "$lib/entities/tenant";
import {
  BASE_URLS,
  type DodoWebhookPayload,
  type DodoWebhookData,
  verifyWebhookSignature,
} from "$lib/server/control/dodo";
import { readEnv } from "$lib/server/control/env";

/**
 * Dodo subscription statuses we act on → our internal license status.
 * Anything unlisted is ignored; falling back to "expired" would silently
 * deactivate on unrecognized events.
 */
const SUBSCRIPTION_STATUS_MAP: Record<string, "canceled" | "expired"> = {
  cancelled: "canceled",
  failed: "expired",
  expired: "expired",
};

export const POST: RequestHandler = async (event) => {
  const cpEnv = readEnv(event);
  if (!cpEnv.DODO_WEBHOOK_SECRET) {
    throw error(500, "DODO_WEBHOOK_SECRET not configured");
  }

  const raw = await event.request.text();
  const ok = await verifyWebhookSignature({
    rawBody: raw,
    headers: {
      "webhook-id": event.request.headers.get("webhook-id"),
      "webhook-timestamp": event.request.headers.get("webhook-timestamp"),
      "webhook-signature": event.request.headers.get("webhook-signature"),
    },
    secret: cpEnv.DODO_WEBHOOK_SECRET,
  });
  if (!ok) throw error(401, "invalid webhook signature");

  remult.user = { id: "system:dodo-webhook", name: "Dodo Webhook", roles: [] };

  let payload: DodoWebhookPayload;
  try {
    payload = JSON.parse(raw) as DodoWebhookPayload;
  } catch {
    throw error(400, "invalid JSON body");
  }

  const webhookId = event.request.headers.get("webhook-id") ?? "";
  if (!webhookId) throw error(400, "missing webhook-id header");

  try {
    // Idempotency gate. Treat the insert failure as a duplicate ONLY
    // when the error message indicates the UNIQUE constraint fired —
    // otherwise a transient DB error between our insert and a concurrent
    // successful insert could silently drop this webhook.
    let applied: AppliedEvent;
    try {
      applied = await remult.repo(AppliedEvent).insert({
        dodoEventId: webhookId,
        eventType: payload.type,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const looksLikeUniqueViolation = /unique|duplicate/i.test(msg);
      if (!looksLikeUniqueViolation) throw err;
      return text("duplicate", { status: 200 });
    }

    try {
      switch (payload.type) {
        case "subscription.active":
          await applySubscriptionActive(payload.data);
          break;
        case "license_key.created":
          await applyLicenseKeyCreated(payload.data);
          break;
        case "subscription.cancelled":
        case "subscription.failed":
        case "subscription.expired":
          await applySubscriptionLifecycle(payload.data);
          break;
        // payment.succeeded etc. — recorded in applied_events for audit,
        // no License action needed.
        default:
          break;
      }
    } catch (err) {
      // Release the idempotency gate so Dodo's retry of this event is
      // processed instead of being short-circuited as a duplicate.
      await remult
        .repo(AppliedEvent)
        .delete(applied.id)
        .catch((e) => console.error("[dodo:webhook] failed to release gate", e));
      throw err;
    }

    return json({ received: true });
  } catch (e) {
    console.error("[dodo:webhook] handler error", e);
    throw error(500, "webhook processing failed");
  }
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/**
 * `subscription.active` is the canonical "this purchase exists" event
 * for a Dodo subscription. Carries seat count, billing period, plan id,
 * customer info — but NOT the actual license key strings (those arrive
 * via `license_key.created`, one per seat).
 *
 * For an N-seat purchase we maintain N License rows, all sharing the
 * same `dodoSubscriptionId`. This event materializes them: empty
 * placeholder rows on first arrival, in-place metadata refresh on
 * later arrivals (period extension, status change). Dodo doesn't
 * guarantee event order, so license_key.created may have already
 * created some rows — we update those, then top up to `seats` with
 * empty placeholders.
 */
async function applySubscriptionActive(d: DodoWebhookData): Promise<void> {
  const subscriptionId = d.subscription_id ?? "";
  if (!subscriptionId) {
    console.warn("[dodo:webhook] subscription.active with no subscription_id");
    return;
  }

  const customerId = d.customer_id ?? d.customer?.customer_id ?? "";
  const email =
    d.customer?.email ?? (customerId ? await fetchCustomerEmail(customerId) : "");
  const ownerUserId = d.metadata?.userId ?? "";
  const seats = d.quantity ?? 1;
  const periodEnd = d.current_period_end
    ? new Date(d.current_period_end)
    : undefined;
  const planId = d.product_id ?? "";

  const existing = await remult
    .repo(License)
    .find({ where: { dodoSubscriptionId: subscriptionId } });

  // Refresh subscription-level metadata on every existing row. Don't
  // clobber `licenseKey` — that's per-row and only license_key.created
  // sets it.
  for (const row of existing) {
    await remult.repo(License).save({
      ...row,
      planId: planId || row.planId,
      seats,
      status: "active",
      dodoCustomerId: customerId || row.dodoCustomerId,
      currentPeriodEnd: periodEnd ?? row.currentPeriodEnd,
      email: email || row.email,
      ownerUserId: ownerUserId || row.ownerUserId,
    });
  }

  // Top up to `seats` empty placeholders if we're short. Covers both
  // the cold-start case (existing.length === 0) and the seat-add-on
  // case (existing.length < seats after a quantity increase).
  for (let i = existing.length; i < seats; i++) {
    await remult.repo(License).insert({
      email,
      planId,
      licenseKey: "",
      seats,
      dodoCustomerId: customerId,
      dodoSubscriptionId: subscriptionId,
      status: "active",
      currentPeriodEnd: periodEnd,
      ownerUserId,
    });
  }
}

/**
 * `license_key.created` carries one activation key. Dodo emits N of
 * these for an N-seat subscription, in any order with respect to
 * `subscription.active`.
 *
 * Strategy: fill the next empty-key row for this subscription. If
 * none exist (key arrived before subscription.active, or we have more
 * keys than placeholders), insert a new row inheriting whatever
 * metadata a sibling row has — subscription.active will refresh it
 * when it lands.
 */
async function applyLicenseKeyCreated(d: DodoWebhookData): Promise<void> {
  const key = d.key ?? "";
  if (!key) {
    console.warn("[dodo:webhook] license_key.created with no key");
    return;
  }

  // Idempotent: if this exact key already lives somewhere, return.
  // Covers re-delivery and the manual /dashboard/activate path.
  const byKey = await remult.repo(License).findFirst({ licenseKey: key });
  if (byKey) return;

  const subscriptionId = d.subscription_id ?? "";

  if (!subscriptionId) {
    // No sub id — orphan license_key event (shouldn't happen, but
    // harmless to insert standalone).
    await remult.repo(License).insert({
      licenseKey: key,
      planId: d.product_id ?? "",
      dodoCustomerId: d.customer_id ?? d.customer?.customer_id ?? "",
      dodoSubscriptionId: "",
      email: d.customer?.email ?? "",
      status: "active",
      seats: 1,
      ownerUserId: d.metadata?.userId ?? "",
    });
    return;
  }

  // Fast path: an empty placeholder is waiting — fill it.
  const empty = await remult
    .repo(License)
    .findFirst({ dodoSubscriptionId: subscriptionId, licenseKey: "" });
  if (empty) {
    await remult.repo(License).save({ ...empty, licenseKey: key });
    return;
  }

  // Out-of-order or excess key: insert a new row. Inherit whatever
  // sibling metadata we can — subscription.active refreshes it later.
  const sibling = await remult
    .repo(License)
    .findFirst({ dodoSubscriptionId: subscriptionId });
  await remult.repo(License).insert({
    licenseKey: key,
    planId: d.product_id ?? sibling?.planId ?? "",
    dodoCustomerId:
      d.customer_id ?? d.customer?.customer_id ?? sibling?.dodoCustomerId ?? "",
    dodoSubscriptionId: subscriptionId,
    email: d.customer?.email ?? sibling?.email ?? "",
    status: sibling?.status ?? "active",
    seats: sibling?.seats ?? 1,
    currentPeriodEnd: sibling?.currentPeriodEnd,
    ownerUserId: d.metadata?.userId ?? sibling?.ownerUserId ?? "",
  });
}

/**
 * Cancel/fail/expire: flip License status AND suspend the linked Tenant
 * so the dashboard reflects the change. Container teardown is a
 * separate grace-period job.
 *
 * Per-tenant containers learn about the suspension lazily — they cache
 * `tenantInfo()` for ~5 minutes, so the worst-case lag between webhook
 * and "this tenant is suspended" rendering in the container is the
 * cache TTL. We deliberately do NOT push a notification: we'd need to
 * persist the cleartext SEAQUEL_AUTH_SECRET to sign the call, defeating
 * the point of storing only its hash. The TTL is the SLA.
 */
async function applySubscriptionLifecycle(d: DodoWebhookData): Promise<void> {
  const subscriptionId = d.subscription_id;
  if (!subscriptionId) return;

  const newStatus = d.status ? SUBSCRIPTION_STATUS_MAP[d.status] : undefined;
  if (!newStatus) return;

  // Update every License row that shares this subscription — for an
  // N-seat purchase that's N rows.
  const rows = await remult
    .repo(License)
    .find({ where: { dodoSubscriptionId: subscriptionId } });
  const now = new Date();
  for (const row of rows) {
    await remult.repo(License).save({
      ...row,
      status: newStatus,
      // Stamp only on the active → inactive transition, so a later
      // `expired` after `cancelled` doesn't push the air-gap grace
      // window forward.
      canceledAt: row.status === "active" ? now : (row.canceledAt ?? now),
    });
  }

  // Drop every issued key for this subscription onto the air-gap
  // revocation list, so any offline bundle issued from now on excludes
  // them and the container's offline dispatcher deactivates the keys
  // on next boot. The unique (subscriptionId, licenseKey) index makes
  // this idempotent on webhook replay — we treat unique-violation as
  // success.
  //
  // We use the same `reason` ("subscription_cancelled") for all three
  // Dodo lifecycle events; the column is informational and ops can
  // cross-reference the originating `applied_events` row by timestamp
  // if needed.
  const revokedAt = Math.floor(Date.now() / 1000);
  for (const row of rows) {
    if (!row.licenseKey) continue;
    const existing = await remult.repo(Revocation).findFirst({
      subscriptionId,
      licenseKey: row.licenseKey,
    });
    if (existing) continue;
    try {
      await remult.repo(Revocation).insert({
        subscriptionId,
        licenseKey: row.licenseKey,
        revokedByUserId: "",
        revokedAt,
        reason: "subscription_cancelled",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Concurrent insert raced us through the findFirst gap — the
      // UNIQUE index caught it. Treat as success.
      if (!/unique|duplicate/i.test(msg)) throw err;
    }
  }

  // The anchor License of any tenant from this subscription gets the
  // tenant suspended. (Joiner licenses don't back tenants — the 1:1
  // UNIQUE on Tenant.licenseId means at most one row per subscription
  // is a tenant anchor, but iterate defensively in case that
  // invariant ever loosens.)
  if (rows.length === 0) return;
  const tenants = await remult
    .repo(Tenant)
    .find({ where: { licenseId: rows.map((r) => r.id) } });
  for (const tenant of tenants) {
    if (tenant.status === "suspended") continue;
    await remult.repo(Tenant).save({
      ...tenant,
      status: "suspended",
      suspendedAt: new Date(),
    });
  }
}

/**
 * Resolve a Dodo customer ID to their email via GET /customers/{id}.
 * Returns empty string on any failure — the License still gets created,
 * and the user can link it manually via /dashboard/activate.
 */
async function fetchCustomerEmail(customerId: string): Promise<string> {
  const apiKey = env.DODO_API_KEY;
  if (!apiKey) return "";

  const mode = env.DODO_MODE || "test";
  const baseUrl = BASE_URLS[mode] ?? BASE_URLS.test;

  try {
    const res = await fetch(`${baseUrl}/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { email?: string };
    return data.email ?? "";
  } catch {
    return "";
  }
}
