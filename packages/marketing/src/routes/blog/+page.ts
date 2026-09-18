import type { PageLoad } from './$types';
import { getBlogEntries } from '$lib/blog';

export const prerender = true;

export const load: PageLoad = async () => {
	const entries = await getBlogEntries();
	return { entries };
};
