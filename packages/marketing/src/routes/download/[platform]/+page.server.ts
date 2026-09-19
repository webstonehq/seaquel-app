import { redirect } from "@sveltejs/kit";
import { describePlatform } from "$lib/downloads";
import { findLatestAsset, isKnownPlatform, RELEASES_PAGE_URL } from "$lib/server/releases";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
	const described = describePlatform(params.platform);
	if (!isKnownPlatform(params.platform) || !described) redirect(303, "/download");

	return {
		platform: params.platform,
		os: described.os,
		variant: described.variant,
		// `null` when GitHub is unreachable or the release lacks this
		// build — the page then links to the releases page instead of
		// starting a download.
		asset: await findLatestAsset(
			params.platform,
			platform?.env.GITHUB_TOKEN_FETCH_RELEASES_URL,
		),
		releasesUrl: RELEASES_PAGE_URL,
	};
};
