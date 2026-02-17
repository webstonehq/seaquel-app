import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
  console.log("Checking for available updates.", { params });

  try {
    const releaseResponse = await fetch(
      "https://api.github.com/repos/webstonehq/seaquel/releases", {
        headers: {
          "User-Agent": "seaquel-app-updates-checker"
        }
      },
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
    return json(latestJson);
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 204 });
  }
};
