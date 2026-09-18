// Fly.io provisioning — one Fly app per tenant.
//
// Each tenant gets its own app (seaquel-{slug}), its own secrets, its
// own volume, and its own machine. This gives us:
//   - Per-tenant hostname (seaquel-{slug}.fly.dev — the CNAME target)
//   - Per-tenant secrets (unique SEAQUEL_AUTH_SECRET, no cross-tenant session reuse)
//   - Per-tenant volume (isolated auth.db + users meta.db files)
//   - Independent lifecycle (restart/destroy one tenant, others unaffected)
//
// Fly apps are lightweight (just a namespace + config), so one per
// tenant is the intended pattern for multi-tenant SaaS on Fly.
//
// API reference: https://fly.io/docs/machines/api/
import type {
  PlatformAdapter,
  ProvisionRequest,
  Region,
  TenantHandle,
  TenantStatus,
} from "./types";

const FLY_API = "https://api.machines.dev/v1";

export interface FlyConfig {
  // FLY_API_TOKEN — org-scoped, write access to apps + machines.
  apiToken: string;
  // FLY_ORG — Fly org slug to create apps in.
  org: string;
  // Container image to deploy, e.g. ghcr.io/webstonehq/seaquel:2026.4.8.
  image: string;
  // Volume size per tenant in GB. Default 1 — plenty for metadata DBs.
  volumeSizeGb?: number;
}

export class FlyMachineAdapter implements PlatformAdapter {
  readonly name = "fly" as const;

  constructor(private readonly cfg: FlyConfig) {}

  async provision(req: ProvisionRequest): Promise<TenantHandle> {
    const appName = flyAppName(req.slug);

    // 1. Create a dedicated Fly app for this tenant.
    await this.flyFetch("/apps", "POST", {
      app_name: appName,
      org_slug: this.cfg.org,
    });

    // 2. Set per-tenant secrets. Fly encrypts these at rest and injects
    //    them as env vars into every machine in the app.
    await this.flyFetch(`/apps/${appName}/secrets`, "POST", {
      secrets: Object.entries(req.env).map(([key, value]) => ({
        label: key,
        type: "secret",
        value: btoa(value),
      })),
    });

    // 3. Allocate a shared IPv4 + IPv6 for the app so it's reachable.
    await this.flyFetch(`/apps/${appName}/ips`, "POST", {
      type: "shared_v4",
    });
    await this.flyFetch(`/apps/${appName}/ips`, "POST", {
      type: "v6",
    });

    // 4. Create a volume for persistent storage (/data).
    const volume = (await this.flyFetch(
      `/apps/${appName}/volumes`,
      "POST",
      {
        name: "data",
        region: req.region,
        size_gb: this.cfg.volumeSizeGb ?? 1,
      },
    )) as { id: string };

    // 5. Launch the machine.
    const machine = (await this.flyFetch(
      `/apps/${appName}/machines`,
      "POST",
      {
        region: req.region,
        config: {
          image: this.cfg.image,
          // Secrets are injected by Fly from step 2 — don't duplicate
          // them in config.env. Only non-secret env vars go here.
          env: {
            PORT: "8787",
            NODE_ENV: "production",
            DATA_DIR: "/data",
          },
          services: [
            {
              protocol: "tcp",
              internal_port: 8787,
              ports: [
                { port: 443, handlers: ["tls", "http"] },
                { port: 80, handlers: ["http"] },
              ],
            },
          ],
          mounts: [{ volume: volume.id, path: "/data" }],
          checks: {
            health: {
              type: "http",
              port: 8787,
              method: "GET",
              path: "/health",
              interval: "15s",
              timeout: "5s",
            },
          },
          restart: { policy: "always" },
        },
      },
    )) as { id: string };

    return {
      machineId: machine.id,
      originUrl: `https://${appName}.fly.dev`,
      appName,
    };
  }

  async deprovision(handle: TenantHandle): Promise<void> {
    const appName = handle.appName ?? appNameFromOriginUrl(handle.originUrl);

    // Stop and destroy all machines in the app.
    const machines = (await this.flyFetch(
      `/apps/${appName}/machines`,
      "GET",
    )) as Array<{ id: string }>;

    for (const m of machines) {
      await this.flyFetch(
        `/apps/${appName}/machines/${m.id}?force=true`,
        "DELETE",
      );
    }

    // Don't delete the app itself — the 30-day soft-delete grace period
    // means we might need to revive it. Volumes and the app namespace
    // are cleaned up by an operator cron after the grace period.
  }

  async status(handle: TenantHandle): Promise<TenantStatus> {
    const appName = handle.appName ?? appNameFromOriginUrl(handle.originUrl);

    const machines = (await this.flyFetch(
      `/apps/${appName}/machines`,
      "GET",
    )) as Array<{ state: string; checks?: Array<{ status: string }> }>;

    if (machines.length === 0) return { state: "provisioning" };
    const m = machines[0];
    if (m.state !== "started") return { state: "provisioning" };
    const healthPassing = (m.checks ?? []).every(
      (c) => c.status === "passing",
    );
    return healthPassing ? { state: "ready" } : { state: "provisioning" };
  }

  private async flyFetch(
    path: string,
    method: "GET" | "POST" | "DELETE",
    body?: unknown,
  ): Promise<unknown> {
    const res = await fetch(FLY_API + path, {
      method,
      headers: {
        Authorization: `Bearer ${this.cfg.apiToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fly API ${method} ${path}: ${res.status} ${text}`);
    }
    if (res.status === 204) return {};
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) return {};
    return res.json();
  }
}

/** Fly app name for a given tenant slug. */
export function flyAppName(slug: string): string {
  return `seaquel-${slug}`;
}

/**
 * Fallback parser for legacy tenant handles written before `appName` was
 * stored alongside `originUrl`. New handles carry `appName` directly.
 */
function appNameFromOriginUrl(originUrl: string): string {
  return originUrl.replace("https://", "").replace(".fly.dev", "");
}

/**
 * Default region. MVP biases to `iad` (North Virginia). A region
 * picker in the tenant form is a follow-up.
 */
export function defaultRegion(): Region {
  return "iad";
}
