/**
 * Dodo Payments integration for the control plane. Builds on the
 * existing `src/lib/server/dodo.ts` (which is just product-price
 * fetching) by adding:
 *
 *   - createCheckoutSession: maps a (slug, plan, email) to a Dodo
 *     checkout URL with metadata the webhook will read back.
 *   - verifyWebhookSignature: HMAC-SHA256 over the raw request body
 *     using `DODO_WEBHOOK_SECRET`. Dodo's standard scheme.
 *   - DodoEvent / WebhookPayload types.
 *
 * Kept as pure functions taking config in — testable without spinning
 * up SvelteKit, and adapter-agnostic across dev/prod.
 */
export const BASE_URLS: Record<string, string> = {
  test: "https://test.dodopayments.com",
  live: "https://live.dodopayments.com",
};

export type DodoMode = "test" | "live";

export interface DodoConfig {
  apiKey: string;
  mode: DodoMode;
  /** Map of Dodo product id → internal plan key (`individual`, `business`). */
  productMap: Record<string, string>;
}

export interface CheckoutMetadata {
  /** Tenant slug the user requested at signup. */
  slug: string;
  /** Dodo product ID. */
  planId: string;
  /** Better Auth user id who initiated the checkout. */
  ownerUserId: string;
  /** Platform the tenant should be provisioned on. */
  platform: string;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export async function createCheckoutSession(
  cfg: DodoConfig,
  args: {
    productId: string;
    customerEmail: string;
    returnUrl: string;
    metadata: CheckoutMetadata;
  },
): Promise<CheckoutSession> {
  const baseUrl = BASE_URLS[cfg.mode] ?? BASE_URLS.test;
  const res = await fetch(`${baseUrl}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      product_cart: [{ product_id: args.productId, quantity: 1 }],
      return_url: args.returnUrl,
      customer: { email: args.customerEmail },
      metadata: args.metadata,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dodo checkout creation failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    session_id: string;
    checkout_url: string;
  };
  return { sessionId: data.session_id, checkoutUrl: data.checkout_url };
}

// ---------------------------------------------------------------------------
// Webhook payloads — typed against the Dodo docs:
// https://docs.dodopayments.com/developer-resources/webhooks
// ---------------------------------------------------------------------------

export interface DodoWebhookPayload {
  business_id: string;
  /** Event type, e.g. `subscription.active`, `payment.succeeded`, `license_key.created`. */
  type: string;
  /** ISO 8601 timestamp. */
  timestamp: string;
  data: DodoWebhookData;
}

export type DodoWebhookData = {
  payload_type: string;
  // -- Payment fields --
  payment_id?: string;
  product_cart?: Array<{ product_id: string; quantity: number }>;
  checkout_session_id?: string;
  // -- Subscription fields --
  subscription_id?: string;
  product_id?: string;
  status?: string;
  /** Seat count on `subscription.active`. Mirrors Dodo's `quantity`. */
  quantity?: number;
  /** ISO 8601 end of current billing cycle on `subscription.active`. */
  current_period_end?: string;
  // -- License key fields --
  key?: string; // the actual license key string (license_key.created only)
  // -- Shared --
  customer?: { customer_id: string; email: string; name: string };
  customer_id?: string; // license_key events use this instead of nested customer
  metadata?: Record<string, string>;
  [k: string]: unknown;
};

/**
 * Verify a Dodo webhook using the Standard Webhooks spec:
 * https://www.standardwebhooks.com/
 *
 * Dodo sends three headers:
 *   - `webhook-id`        — unique event identifier
 *   - `webhook-timestamp` — unix epoch seconds
 *   - `webhook-signature` — `v1,<base64>` (space-separated if multiple)
 *
 * The HMAC-SHA256 is computed over `{webhook-id}.{webhook-timestamp}.{rawBody}`.
 *
 * The secret may carry a `whsec_` prefix (Standard Webhooks convention);
 * the part after the prefix is the base64-encoded HMAC key.
 */
export async function verifyWebhookSignature(args: {
  rawBody: string;
  headers: {
    "webhook-id": string | null;
    "webhook-timestamp": string | null;
    "webhook-signature": string | null;
  };
  secret: string;
}): Promise<boolean> {
  const id = args.headers["webhook-id"];
  const timestamp = args.headers["webhook-timestamp"];
  const signature = args.headers["webhook-signature"];

  if (!id || !timestamp || !signature) return false;

  // Reject replays older than 5 minutes.
  const ts = Number(timestamp);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  // Standard Webhooks: strip `whsec_` prefix, base64-decode the key.
  const secretStr = args.secret.startsWith("whsec_")
    ? args.secret.slice(6)
    : args.secret;
  const secretBytes = base64ToBytes(secretStr);

  // Signed message: {webhook-id}.{webhook-timestamp}.{rawBody}
  const message = `${id}.${timestamp}.${args.rawBody}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const expected = bytesToBase64(new Uint8Array(sig));

  // The header may contain multiple signatures (space-separated).
  // Any `v1` match = valid.
  return signature.split(" ").some((s) => {
    const comma = s.indexOf(",");
    if (comma === -1) return false;
    const version = s.slice(0, comma);
    const value = s.slice(comma + 1);
    return version === "v1" && constantTimeEqual(expected, value);
  });
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Resolve a Dodo product id to our internal plan key via the env-supplied
 * map. Throws if the product id isn't recognized — a Dodo misconfiguration
 * we want to surface loudly.
 */
export function resolvePlan(cfg: DodoConfig, productId: string): string {
  const plan = cfg.productMap[productId];
  if (!plan) {
    throw new Error(
      `Dodo product ${productId} has no entry in PUBLIC_DODO_PRODUCT_MAP — add it to wrangler.jsonc`,
    );
  }
  return plan;
}

export function parseProductMap(json: string | undefined): Record<string, string> {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}
