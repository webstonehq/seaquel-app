/**
 * Single helper that gathers control-plane env vars. They're declared in
 * src/env.ts; in production on Cloudflare they come from the worker's env
 * (wrangler.jsonc + secrets), in `vite dev` from `.env*` files and
 * `process.env`.
 *
 * Returns a single object the orchestrator and webhook handler consume.
 */
import * as privateEnv from "$app/env/private";
import { PUBLIC_DODO_PRODUCT_MAP } from "$app/env/public";
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

export function readEnv(): ControlPlaneEnv {
  return {
    DODO_API_KEY: privateEnv.DODO_API_KEY || undefined,
    DODO_WEBHOOK_SECRET: privateEnv.DODO_WEBHOOK_SECRET,
    DODO_MODE: (privateEnv.DODO_MODE || undefined) as ControlPlaneEnv["DODO_MODE"],
    PUBLIC_DODO_PRODUCT_MAP: PUBLIC_DODO_PRODUCT_MAP || undefined,
    SEAQUEL_CONTROL_URL: privateEnv.SEAQUEL_CONTROL_URL,
    FLY_API_TOKEN: privateEnv.FLY_API_TOKEN,
    FLY_ORG: privateEnv.FLY_ORG,
    FLY_IMAGE: privateEnv.FLY_IMAGE,
    CF_API_TOKEN: privateEnv.CF_API_TOKEN,
    CF_ACCOUNT_ID: privateEnv.CF_ACCOUNT_ID,
    CF_CONTAINER_IMAGE: privateEnv.CF_CONTAINER_IMAGE,
    CF_ZONE_ID: privateEnv.CF_ZONE_ID,
    CF_ROOT_DOMAIN: privateEnv.CF_ROOT_DOMAIN,
    SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY: privateEnv.SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY,
    SEAQUEL_AIRGAP_GRACE_SECONDS: privateEnv.SEAQUEL_AIRGAP_GRACE_SECONDS,
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
