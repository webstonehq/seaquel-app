import { dev } from "$app/environment";
import { FlyMachineAdapter } from "./fly";
import { CloudflareContainerAdapter } from "./cloudflare";
import { MockPlatformAdapter } from "./mock";
import type { PlatformAdapter, PlatformName } from "./types";

export type { PlatformAdapter, PlatformName, Region, TenantHandle, TenantStatus } from "./types";
export { FlyMachineAdapter, CloudflareContainerAdapter, MockPlatformAdapter };

export interface AdapterEnv {
  FLY_API_TOKEN?: string;
  FLY_ORG?: string;
  FLY_IMAGE?: string;
  CF_API_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  CF_CONTAINER_IMAGE?: string;
}

/**
 * Pick an adapter for a given platform choice. In `vite dev` the mock
 * adapter is used whenever credentials are missing so local flows work
 * without a real Fly/Cloudflare account. In production, missing
 * credentials throw — a silent mock in prod would flip tenants to
 * `active` with no real machine behind them.
 */
export function getAdapter(
  platform: PlatformName,
  env: AdapterEnv,
): PlatformAdapter {
  if (platform === "fly") {
    if (!env.FLY_API_TOKEN || !env.FLY_ORG || !env.FLY_IMAGE) {
      if (!dev) {
        throw new Error(
          "FLY_API_TOKEN, FLY_ORG, and FLY_IMAGE must be set to provision Fly tenants in production",
        );
      }
      return new MockPlatformAdapter();
    }
    return new FlyMachineAdapter({
      apiToken: env.FLY_API_TOKEN,
      org: env.FLY_ORG,
      image: env.FLY_IMAGE,
    });
  }
  if (platform === "cloudflare") {
    if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID || !env.CF_CONTAINER_IMAGE) {
      if (!dev) {
        throw new Error(
          "CF_API_TOKEN, CF_ACCOUNT_ID, and CF_CONTAINER_IMAGE must be set to provision Cloudflare tenants in production",
        );
      }
      return new MockPlatformAdapter();
    }
    return new CloudflareContainerAdapter({
      apiToken: env.CF_API_TOKEN,
      accountId: env.CF_ACCOUNT_ID,
      image: env.CF_CONTAINER_IMAGE,
    });
  }
  throw new Error(`unknown platform: ${platform}`);
}
