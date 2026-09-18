/**
 * Single helper that gathers control-plane env vars from whichever
 * source SvelteKit makes them available on. In production on Cloudflare
 * Pages they come from `event.platform.env` (wrangler.jsonc + secrets).
 * In `vite dev` they come from `$env/dynamic/private` which is sourced
 * from `.env*` files and `process.env`.
 *
 * Returns a single object the orchestrator and webhook handler consume.
 */
import { env as privateEnv } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import type { OrchestratorEnv } from "./tenants";
import type { DnsEnv } from "./dns";
import type { DodoConfig } from "./dodo";
import { parseProductMap } from "./dodo";

export interface ControlPlaneEnv extends OrchestratorEnv, DnsEnv {
  DODO_API_KEY?: string;
  DODO_WEBHOOK_SECRET?: string;
  DODO_MODE?: "test" | "live";
  PUBLIC_DODO_PRODUCT_MAP?: string;
  /**
   * 32-byte Ed25519 seed (hex-encoded, with or without 0x prefix) used to
   * sign air-gapped bundles. Set as a Cloudflare Worker secret in prod
   * (`wrangler secret put SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY`) and in
   * `.dev.vars` / `.env.local` for local dev. Required by the
   * `/api/control/airgap/bundle` endpoint; the endpoint 500s if missing.
   */
  SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY?: string;
  /**
   * Grace period appended to `License.currentPeriodEnd` when computing a
   * bundle's `not_after`. Defaults to 30 days (2_592_000 seconds) when
   * unset. Stored as a string in the env layer; callers parse with
   * `parseGraceSeconds`.
   */
  SEAQUEL_AIRGAP_GRACE_SECONDS?: string;
}

/** Default airgap grace period: 30 days (in unix seconds). */
export const DEFAULT_AIRGAP_GRACE_SECONDS = 2_592_000;

/**
 * Parse the SEAQUEL_AIRGAP_GRACE_SECONDS env var (a string when read from
 * KV/`.env`). Falls back to the 30-day default for any unset / non-finite
 * / non-positive value, so a typo in `.env` can't accidentally produce a
 * bundle that expires in the past.
 */
export function parseGraceSeconds(raw: string | undefined): number {
  if (!raw) return DEFAULT_AIRGAP_GRACE_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_AIRGAP_GRACE_SECONDS;
  return parsed;
}

export function readEnv(event: RequestEvent): ControlPlaneEnv {
  const platformEnv = (event.platform?.env ?? {}) as Partial<ControlPlaneEnv>;
  const pick = <K extends keyof ControlPlaneEnv>(key: K): ControlPlaneEnv[K] =>
    (platformEnv[key] ?? (privateEnv as Record<string, string>)[key as string]) as ControlPlaneEnv[K];

  return {
    DODO_API_KEY: pick("DODO_API_KEY"),
    DODO_WEBHOOK_SECRET: pick("DODO_WEBHOOK_SECRET"),
    DODO_MODE: pick("DODO_MODE"),
    PUBLIC_DODO_PRODUCT_MAP: pick("PUBLIC_DODO_PRODUCT_MAP"),
    SEAQUEL_CONTROL_URL: pick("SEAQUEL_CONTROL_URL"),
    FLY_API_TOKEN: pick("FLY_API_TOKEN"),
    FLY_ORG: pick("FLY_ORG"),
    FLY_IMAGE: pick("FLY_IMAGE"),
    CF_API_TOKEN: pick("CF_API_TOKEN"),
    CF_ACCOUNT_ID: pick("CF_ACCOUNT_ID"),
    CF_CONTAINER_IMAGE: pick("CF_CONTAINER_IMAGE"),
    CF_ZONE_ID: pick("CF_ZONE_ID"),
    CF_ROOT_DOMAIN: pick("CF_ROOT_DOMAIN"),
    SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY: pick("SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY"),
    SEAQUEL_AIRGAP_GRACE_SECONDS: pick("SEAQUEL_AIRGAP_GRACE_SECONDS"),
  };
}

export function dodoConfig(env: ControlPlaneEnv): DodoConfig {
  if (!env.DODO_API_KEY) {
    throw new Error("DODO_API_KEY is not set");
  }
  return {
    apiKey: env.DODO_API_KEY,
    mode: env.DODO_MODE ?? "test",
    productMap: parseProductMap(env.PUBLIC_DODO_PRODUCT_MAP),
  };
}
