import type { PageLoad, EntryGenerator } from './$types';
import { getFeatureCategory, getFeatureSlugs, getAdjacentCategories } from '$lib/features';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const category = getFeatureCategory(params.slug);

	if (!category) {
		throw error(404, 'Feature category not found');
	}

	const adjacent = getAdjacentCategories(params.slug);

	return {
		category,
		adjacent
	};
};

export const entries: EntryGenerator = () => {
	return getFeatureSlugs().map((slug) => ({ slug }));
};
