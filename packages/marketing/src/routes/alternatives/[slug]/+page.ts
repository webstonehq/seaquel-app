import type { PageLoad, EntryGenerator } from './$types';
import { getAlternatives, getCompetitor } from '$lib/competitors';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const competitor = await getCompetitor(params.slug);

	// Only competitors that supply replacement-intent copy get a page here;
	// the rest exist solely as head-to-head comparisons.
	if (!competitor?.altTitle) {
		throw error(404, 'Alternative guide not found');
	}

	return { competitor };
};

export const entries: EntryGenerator = async () => {
	return (await getAlternatives()).map(({ slug }) => ({ slug }));
};
