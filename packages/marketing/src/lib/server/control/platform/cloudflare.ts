/**
 * Cloudflare Containers adapter. Currently a stub — the Cloudflare
 * Containers API is still shifting as the product moves out of beta.
 * Wire up the real API surface once we're ready to run tenants here.
 *
 * The interface is identical to `FlyMachineAdapter` so the orchestrator
 * doesn't care which platform backs a tenant.
 */
import type {
  PlatformAdapter,
  ProvisionRequest,
  TenantHandle,
  TenantStatus,
} from "./types";

export interface CloudflareContainerConfig {
  /** CF API token with Containers:Edit. */
  apiToken: string;
  /** Account id the containers app lives under. */
  accountId: string;
  /** Container image ref. */
  image: string;
}

export class CloudflareContainerAdapter implements PlatformAdapter {
  readonly name = "cloudflare" as const;

  constructor(private readonly _cfg: CloudflareContainerConfig) {}

  async provision(_req: ProvisionRequest): Promise<TenantHandle> {
    throw new Error(
      "CloudflareContainerAdapter.provision: not implemented yet — use the Fly adapter until Cloudflare Containers is wired up",
    );
  }

  async deprovision(_handle: TenantHandle): Promise<void> {
    throw new Error("CloudflareContainerAdapter.deprovision: not implemented");
  }

  async status(_handle: TenantHandle): Promise<TenantStatus> {
    throw new Error("CloudflareContainerAdapter.status: not implemented");
  }
}
