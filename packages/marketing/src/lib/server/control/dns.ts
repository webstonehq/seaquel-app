/**
 * Cloudflare DNS writer. The control plane calls `writeTenantCname` on
 * successful provisioning to point `{slug}.seaquel.app` at the
 * platform's origin. If credentials are missing, falls through to a
 * no-op in `vite dev`. In production, missing credentials throw —
 * we never silently skip DNS in prod.
 *
 * API reference: https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record
 */
import { dev } from "$app/environment";

const CF_API = "https://api.cloudflare.com/client/v4";

export interface DnsEnv {
  /** `CF_API_TOKEN` — scoped to Zone:DNS:Edit on the seaquel.app zone. */
  CF_API_TOKEN?: string;
  /** `CF_ZONE_ID` — the seaquel.app zone id. */
  CF_ZONE_ID?: string;
  /** `CF_ROOT_DOMAIN` — usually `seaquel.app`. Defaults to that literal. */
  CF_ROOT_DOMAIN?: string;
}

export interface DnsClient {
  writeTenantCname(slug: string, target: string): Promise<{ recordId: string }>;
  deleteTenantCname(slug: string): Promise<void>;
}

export function getDnsClient(env: DnsEnv): DnsClient {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    if (!dev) {
      throw new Error(
        "CF_API_TOKEN and CF_ZONE_ID must be set to write tenant DNS records in production",
      );
    }
    return new MockDnsClient();
  }
  return new CloudflareDnsClient(
    env.CF_API_TOKEN,
    env.CF_ZONE_ID,
    env.CF_ROOT_DOMAIN ?? "seaquel.app",
  );
}

class CloudflareDnsClient implements DnsClient {
  constructor(
    private readonly apiToken: string,
    private readonly zoneId: string,
    private readonly rootDomain: string,
  ) {}

  async writeTenantCname(
    slug: string,
    target: string,
  ): Promise<{ recordId: string }> {
    const host = `${slug}.${this.rootDomain}`;
    const res = await this.cfFetch(`/zones/${this.zoneId}/dns_records`, "POST", {
      type: "CNAME",
      name: host,
      content: stripProtocol(target),
      ttl: 1, // auto
      proxied: true, // route through Cloudflare so TLS works without per-subdomain cert
      comment: "managed by seaquel control plane",
    });
    const data = (res as { result: { id: string } }).result;
    return { recordId: data.id };
  }

  async deleteTenantCname(slug: string): Promise<void> {
    const host = `${slug}.${this.rootDomain}`;
    // Lookup first — CF API requires the record id, not the name.
    const list = (await this.cfFetch(
      `/zones/${this.zoneId}/dns_records?name=${encodeURIComponent(host)}&type=CNAME`,
      "GET",
    )) as { result: Array<{ id: string }> };

    for (const r of list.result) {
      await this.cfFetch(`/zones/${this.zoneId}/dns_records/${r.id}`, "DELETE");
    }
  }

  private async cfFetch(
    path: string,
    method: "GET" | "POST" | "DELETE",
    body?: unknown,
  ): Promise<unknown> {
    const res = await fetch(CF_API + path, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = (await res.json()) as {
      success: boolean;
      errors?: Array<{ message: string }>;
      result?: unknown;
    };
    if (!res.ok || !payload.success) {
      const msg = payload.errors?.map((e) => e.message).join("; ") ?? `HTTP ${res.status}`;
      throw new Error(`Cloudflare DNS ${method} ${path}: ${msg}`);
    }
    return payload;
  }
}

class MockDnsClient implements DnsClient {
  async writeTenantCname(): Promise<{ recordId: string }> {
    return { recordId: `mock_${Date.now().toString(36)}` };
  }
  async deleteTenantCname(): Promise<void> {}
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
