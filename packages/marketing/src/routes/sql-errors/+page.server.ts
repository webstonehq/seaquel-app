import type { PageServerLoad } from './$types';
import { getSqlErrors } from '$lib/sql-errors';
import { getLessons } from '$lib/learn-sql';
import { ENGINE_SLUGS, ENGINES, getEngineCodes } from '$lib/server/sql-error-codes';

export const prerender = true;

export const load: PageServerLoad = async () => {
	return {
		errors: await getSqlErrors(),
		lessons: await getLessons(),
		engines: ENGINE_SLUGS.map((slug) => ({
			slug,
			name: ENGINES[slug].name,
			count: getEngineCodes(slug).length
		}))
	};
};
