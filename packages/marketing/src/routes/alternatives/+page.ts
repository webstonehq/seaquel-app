import type { PageLoad } from './$types';
import { getAlternatives } from '#lib/competitors/index.js';

export const prerender = true;

export const load: PageLoad = async () => {
	return { competitors: await getAlternatives() };
};
