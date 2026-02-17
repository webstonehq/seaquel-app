import type { Component } from 'svelte';

export interface ChangelogEntry {
	slug: string;
	title: string;
	date: string;
	dateFormatted: string;
}

export interface ChangelogEntryWithContent extends ChangelogEntry {
	content: Component;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Load all changelog entries metadata (for listing)
 */
export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
	const modules = import.meta.glob<{
		metadata: { title: string; date: string };
	}>('/src/content/changelog/*.md', { eager: true });

	const entries: ChangelogEntry[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const filename = path.split('/').pop()?.replace('.md', '') ?? '';
		const slug = filename;

		const { title, date } = module.metadata;

		entries.push({
			slug,
			title,
			date,
			dateFormatted: formatDate(date)
		});
	}

	// Sort by date descending (newest first)
	return entries.sort((a, b) => b.slug.localeCompare(a.slug));
}

/**
 * Load a single changelog entry by slug (with content)
 */
export async function getChangelogEntry(slug: string): Promise<ChangelogEntryWithContent | null> {
	const modules = import.meta.glob<{
		default: Component;
		metadata: { title: string; date: string };
	}>('/src/content/changelog/*.md');

	const path = `/src/content/changelog/${slug}.md`;

	if (!(path in modules)) {
		return null;
	}

	const module = await modules[path]();
	const { title, date } = module.metadata;

	return {
		slug,
		title,
		date,
		dateFormatted: formatDate(date),
		content: module.default
	};
}

/**
 * Get all slugs for prerendering
 */
export function getChangelogSlugs(): string[] {
	const modules = import.meta.glob('/src/content/changelog/*.md');

	return Object.keys(modules).map((path) => path.split('/').pop()?.replace('.md', '') ?? '');
}
