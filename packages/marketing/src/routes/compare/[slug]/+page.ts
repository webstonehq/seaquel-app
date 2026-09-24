import type { PageLoad, EntryGenerator } from './$types';
import { getCompetitor, getComparisons } from '$lib/competitors';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const competitor = await getCompetitor(params.slug);

	if (!competitor || competitor.basedOn) {
		// Long-tail pages are built on another competitor's data and live under
		// /alternatives, so they are not addressable here.
		throw error(404, 'Comparison not found');
	}

	return { competitor };
};

export const entries: EntryGenerator = async () => {
	return (await getComparisons()).map(({ slug }) => ({ slug }));
};
