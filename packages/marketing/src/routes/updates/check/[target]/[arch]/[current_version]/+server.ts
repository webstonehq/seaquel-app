import { json } from "@sveltejs/kit";

const CACHE_KEY = "updates:latest-json";
const CACHE_TTL_SECONDS = 1 * 60 * 60;

export const GET = async ({ params, platform }) => {
  console.log("Checking for available updates.", { params });

  const kv = platform?.env?.GITHUB_API_CACHE;

  // Try serving from cache
  if (kv) {
    try {
      const cached = await kv.get(CACHE_KEY, "text");
      if (cached) {
        console.log("Serving update check from cache");
        return json(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to read from cache:", e);
    }
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent": "seaquel-app-updates-checker",
      "Accept": "application/vnd.github.v3+json",
    };

    if (platform?.env?.GITHUB_TOKEN) {
      console.log("GITHUB_TOKEN present, sending an authenticated request to GitHub");
      headers["Authorization"] = `Bearer ${platform.env.GITHUB_TOKEN}`;
    }

    const releaseResponse = await fetch(
      "https://api.github.com/repos/webstonehq/seaquel/releases",
      { headers },
    );

    if (!releaseResponse.ok) {
      console.error("Failed to fetch releases: ", await releaseResponse.text());
      return new Response(null, { status: 204 });
    }

    const releases = await releaseResponse.json();
    console.log(`Found ${releases.length} releases`);

    // Find the latest release that is not a draft and not a prerelease
    const validRelease = releases.find(
      (release: { draft: boolean; prerelease: boolean }) =>
        !release.draft && !release.prerelease,
    );
    console.log(`Found latest release: `, validRelease);

    if (!validRelease) {
      return new Response(null, { status: 204 });
    }

    const latestJsonAsset = validRelease.assets?.find(
      (asset: { name: string }) => asset.name === "latest.json",
    );

    if (!latestJsonAsset) {
      console.error("Failed to find latest.json asset in release");
      return new Response(null, { status: 204 });
    }

    const assetResponse = await fetch(latestJsonAsset.browser_download_url);

    if (!assetResponse.ok) {
      console.error("Failed to fetch latest.json content: ", await assetResponse.text());
      return new Response(null, { status: 204 });
    }

    const latestJson = await assetResponse.json();

    // Cache the result
    if (kv) {
      try {
        await kv.put(CACHE_KEY, JSON.stringify(latestJson), { expirationTtl: CACHE_TTL_SECONDS });
        console.log("Cached update check result");
      } catch (e) {
        console.error("Failed to write to cache:", e);
      }
    }

    return json(latestJson);
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 204 });
  }
};
