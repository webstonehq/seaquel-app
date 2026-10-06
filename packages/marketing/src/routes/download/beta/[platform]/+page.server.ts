import { redirect } from "@sveltejs/kit";
import { describePlatform } from "$lib/downloads";
import { findLatestAsset, isKnownPlatform, RELEASES_PAGE_URL } from "$lib/server/releases";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
	const described = describePlatform(params.platform);
	if (!isKnownPlatform(params.platform) || !described) redirect(303, "/download/beta");

	const asset = await findLatestAsset(
		params.platform,
		platform?.env.GITHUB_TOKEN_FETCH_RELEASES_URL,
		"beta",
	);
	// No beta newer than stable: the build here would be a stable one, which
	// starts on the stable channel and never sees the next beta. /download/beta
	// explains that instead of quietly handing it out.
	if (asset && !asset.prerelease) redirect(303, "/download/beta");

	return {
		channel: "beta" as const,
		platform: params.platform,
		os: described.os,
		variant: described.variant,
		asset,
		releasesUrl: RELEASES_PAGE_URL,
	};
};
