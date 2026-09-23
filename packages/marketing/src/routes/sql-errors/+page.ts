import type { PageLoad } from './$types';
import { getSqlErrors } from '$lib/sql-errors';
import { getLessons } from '$lib/learn-sql';

export const prerender = true;

export const load: PageLoad = async () => {
	return { errors: await getSqlErrors(), lessons: await getLessons() };
};
