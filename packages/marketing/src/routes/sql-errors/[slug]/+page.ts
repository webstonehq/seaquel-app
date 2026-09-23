import type { PageLoad, EntryGenerator } from './$types';
import { getSqlError, getSqlErrorSlugs } from '$lib/sql-errors';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const entry = await getSqlError(params.slug);

	if (!entry) {
		throw error(404, 'Error page not found');
	}

	return { entry };
};

export const entries: EntryGenerator = () => {
	return getSqlErrorSlugs().map((slug) => ({ slug }));
};
