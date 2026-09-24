import type { PageLoad } from './$types';
import { getComparisons } from '$lib/competitors';

export const prerender = true;

export const load: PageLoad = async () => {
	return { competitors: await getComparisons() };
};
