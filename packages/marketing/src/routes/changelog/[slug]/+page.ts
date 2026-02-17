import type { PageLoad, EntryGenerator } from './$types';
import { getChangelogEntry, getChangelogSlugs } from '$lib/changelog';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const entry = await getChangelogEntry(params.slug);

	if (!entry) {
		throw error(404, 'Changelog entry not found');
	}

	return {
		entry
	};
};

export const entries: EntryGenerator = () => {
	const slugs = getChangelogSlugs();
	return slugs.map((slug) => ({ slug }));
};
