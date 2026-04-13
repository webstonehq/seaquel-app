import type { Component } from 'svelte';
import { slug } from 'github-slugger';

export interface ChangelogHighlight {
	label: string;
	id: string;
}

export interface ChangelogEntry {
	slug: string;
	title: string;
	date: string;
	dateFormatted: string;
	description: string;
	highlights: ChangelogHighlight[];
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

function extractHighlights(raw: string): ChangelogHighlight[] {
	const lines = raw.split('\n');
	const highlights: ChangelogHighlight[] = [];
	for (const line of lines) {
		const match = line.match(/^## (.+)/);
		if (match) {
			const heading = match[1].trim();
			if (heading !== 'Bug Fixes' && heading !== 'Improvements') {
				highlights.push({ label: heading, id: slug(heading) });
			}
		}
	}
	return highlights;
}

/**
 * Load all changelog entries metadata (for listing)
 */
export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
	const modules = import.meta.glob<{
		metadata: { title: string; date: string; description?: string };
	}>('/src/content/changelog/*.md', { eager: true });

	const rawModules = import.meta.glob<string>('/src/content/changelog/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const entries: ChangelogEntry[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const filename = path.split('/').pop()?.replace('.md', '') ?? '';
		const slug = filename;

		const { title, date, description } = module.metadata;
		const raw = rawModules[path] ?? '';
		const highlights = extractHighlights(raw);

		entries.push({
			slug,
			title,
			date,
			dateFormatted: formatDate(date),
			description: description ?? `Seaquel changelog: ${title}`,
			highlights
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
		metadata: { title: string; date: string; description?: string };
	}>('/src/content/changelog/*.md');

	const path = `/src/content/changelog/${slug}.md`;

	if (!(path in modules)) {
		return null;
	}

	const module = await modules[path]();
	const { title, date, description } = module.metadata;

	return {
		slug,
		title,
		date,
		dateFormatted: formatDate(date),
		description: description ?? `Seaquel changelog: ${title}`,
		highlights: [],
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
