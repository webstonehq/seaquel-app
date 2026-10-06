import { findLatestRelease, RELEASES_PAGE_URL } from "$lib/server/releases";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => ({
	// `null` when GitHub is unreachable; a release that isn't a pre-release
	// means no beta is newer than stable right now.
	release: await findLatestRelease("beta", platform?.env.GITHUB_TOKEN_FETCH_RELEASES_URL),
	releasesUrl: RELEASES_PAGE_URL,
});
