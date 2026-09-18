/**
 * Single seam for where a tenant container actually runs. Adding a new
 * platform (AWS Fargate, Railway, Render) is one new file in this
 * directory — the orchestrator in `../tenants.ts` doesn't change.
 *
 * Keep this trait narrow. Everything Seaquel-specific (DNS writes,
 * database rows, billing sync) belongs in the orchestrator, not in
 * individual adapters.
 */

export type PlatformName = "fly" | "cloudflare";

export type Region =
  | "iad" // us-east
  | "lax" // us-west
  | "lhr" // europe
  | "fra" // europe-central
  | "sin" // asia-pacific
  | "syd"; // oceania

export interface ProvisionRequest {
  tenantId: string;
  slug: string;
  region: Region;
  /** Env vars baked into the container's process environment on start. */
  env: Record<string, string>;
}

export interface TenantHandle {
  /** Platform-specific opaque id stored on the tenant row as `machineId`. */
  machineId: string;
  /** Internal origin the platform assigned (pre-CNAME). */
  originUrl: string;
  /**
   * Platform-scoped app/container identifier used by subsequent API calls
   * (e.g. Fly's app name). Kept separate from `originUrl` so adapters
   * don't have to round-trip through URL parsing.
   */
  appName?: string;
}

export type TenantStatus =
  | { state: "provisioning" }
  | { state: "ready" }
  | { state: "failed"; reason: string };

export interface PlatformAdapter {
  readonly name: PlatformName;
  provision(req: ProvisionRequest): Promise<TenantHandle>;
  deprovision(handle: TenantHandle): Promise<void>;
  status(handle: TenantHandle): Promise<TenantStatus>;
}
