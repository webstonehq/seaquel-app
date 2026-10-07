import type { PageLoad } from './$types';
import { getLessons } from '#lib/learn-sql/index.js';

export const prerender = true;

export const load: PageLoad = async () => {
	return { lessons: await getLessons() };
};
