import type { EntryGenerator, PageServerLoad } from './$types';
import { ENGINE_SLUGS, getEngineIndex, type EngineSlug } from '$lib/server/sql-error-codes';

export const prerender = true;
// A long static list: nothing on it needs JavaScript, and hydrating it would
// ship the whole list a second time as page data.
export const csr = false;

export const load: PageServerLoad = async ({ params }) => {
	return { index: await getEngineIndex(params.engine as EngineSlug) };
};

export const entries: EntryGenerator = () => ENGINE_SLUGS.map((engine) => ({ engine }));
