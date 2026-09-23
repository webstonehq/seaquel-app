import type { PageLoad, EntryGenerator } from './$types';
import { getLesson, getLessons, getLessonSlugs } from '$lib/learn-sql';
import { getSqlErrorsForLesson } from '$lib/sql-errors';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const lesson = await getLesson(params.lesson);

	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	const all = await getLessons();
	const errors = await getSqlErrorsForLesson(lesson.slug);

	return { lesson, all, errors };
};

export const entries: EntryGenerator = () => {
	return getLessonSlugs().map((lesson) => ({ lesson }));
};
