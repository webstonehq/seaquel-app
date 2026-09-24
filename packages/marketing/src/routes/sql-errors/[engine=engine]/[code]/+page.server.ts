import type { EntryGenerator, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getAllCodePages, getCodePage, type EngineSlug } from '$lib/server/sql-error-codes';

export const prerender = true;
// Thousands of these are prerendered; without client-side rendering each is a
// single HTML file, with no __data.json beside it.
export const csr = false;

export const load: PageServerLoad = async ({ params }) => {
	const page = await getCodePage(params.engine as EngineSlug, params.code);
	if (!page) throw error(404, 'Error code not found');
	return { page };
};

export const entries: EntryGenerator = async () =>
	(await getAllCodePages()).map(({ engine, slug }) => ({ engine, code: slug }));
