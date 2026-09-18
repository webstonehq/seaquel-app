import type { PageLoad, EntryGenerator } from './$types';
import { getBlogEntries, getBlogEntry, getBlogSlugs } from '$lib/blog';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const entry = await getBlogEntry(params.slug);

	if (!entry) {
		throw error(404, 'Blog post not found');
	}

	const all = await getBlogEntries();
	const related = all.filter((e) => e.slug !== params.slug).slice(0, 3);

	return { entry, related };
};

export const entries: EntryGenerator = () => {
	return getBlogSlugs().map((slug) => ({ slug }));
};
