import { env } from "cloudflare:workers";
import { redirect } from "@sveltejs/kit";
import { findLatestAsset, RELEASES_PAGE_URL } from "#lib/server/releases.js";

/**
 * Direct file download for non-browser clients (curl, wget, scripts).
 *
 * Browser navigations to the same URL ask for `text/html`, which
 * SvelteKit routes to the sibling `+page.svelte` instead — the
 * "download is starting" page, which triggers the same file itself.
 */
export const GET = async ({ params }) => {
	const asset = await findLatestAsset(
		params.platform,
		env.GITHUB_TOKEN_FETCH_RELEASES_URL,
	);
	redirect(302, asset?.url ?? RELEASES_PAGE_URL, { external: ["https://github.com"] });
};
