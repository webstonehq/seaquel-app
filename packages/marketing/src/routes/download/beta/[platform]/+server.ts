import { redirect } from "@sveltejs/kit";
import { findLatestAsset, RELEASES_PAGE_URL } from "$lib/server/releases";

/**
 * Direct beta download for non-browser clients, like `/download/[platform]`.
 * Between betas this is the newest stable build, which is what the beta
 * channel updates to as well.
 */
export const GET = async ({ params, platform }) => {
	const asset = await findLatestAsset(
		params.platform,
		platform?.env.GITHUB_TOKEN_FETCH_RELEASES_URL,
		"beta",
	);
	redirect(302, asset?.url ?? RELEASES_PAGE_URL);
};
