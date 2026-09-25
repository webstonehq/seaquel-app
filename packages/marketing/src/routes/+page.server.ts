import type { KVNamespace } from "@cloudflare/workers-types";
import type { PageServerLoad } from "./$types";
import type { OpenMetrics } from "$lib/metrics/types";

const LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</docs>; rel="service-doc"',
].join(", ");

// Same snapshot /metrics reads; the collector keeps it fresh so the homepage
// never has to call the GitHub API itself.
async function loadMetrics(kv: KVNamespace | undefined): Promise<OpenMetrics | null> {
  if (!kv) return null;
  try {
    const snapshot = await kv.get<{ metrics: OpenMetrics }>("metrics:github", "json");
    if (!snapshot) return null;
    return snapshot.metrics;
  } catch (e) {
    console.error("[home] Failed to read metrics from KV:", e);
    return null;
  }
}

export const load: PageServerLoad = async ({ setHeaders, platform }) => {
  setHeaders({ Link: LINK_HEADER });
  const metrics = await loadMetrics(platform?.env?.GITHUB_API_CACHE);
  return {
    downloads: metrics?.totalDownloads ?? null,
    stars: metrics?.stars ?? null,
  };
};
