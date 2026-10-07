import { env } from "cloudflare:workers";
import { redirect } from "@sveltejs/kit";
import { findLatestAsset, RELEASES_PAGE_URL } from "#lib/server/releases.js";

/**
 * Direct beta download for non-browser clients, like `/download/[platform]`.
 * Between betas this is the newest stable build, which is what the beta
 * channel updates to as well.
 */
export const GET = async ({ params }) => {
	const asset = await findLatestAsset(
		params.platform,
		env.GITHUB_TOKEN_FETCH_RELEASES_URL,
		"beta",
	);
	redirect(302, asset?.url ?? RELEASES_PAGE_URL, { external: ["https://github.com"] });
};
