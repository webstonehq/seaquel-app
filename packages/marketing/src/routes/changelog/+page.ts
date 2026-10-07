import type { PageLoad } from './$types';
import { getChangelogEntries } from '#lib/changelog/index.js';

export const prerender = true;

export const load: PageLoad = async () => {
	const entries = await getChangelogEntries();

	return {
		entries
	};
};
