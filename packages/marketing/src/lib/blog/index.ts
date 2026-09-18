import type { Component } from 'svelte';
import { slug as slugify } from 'github-slugger';

export interface BlogSection {
	title: string;
	id: string;
}

export interface BlogAuthor {
	name: string;
	role: string;
	initials: string;
}

export interface BlogEntry {
	slug: string;
	title: string;
	date: string;
	dateFormatted: string;
	description: string;
	author: BlogAuthor;
	readTime: string;
	wordCount: number;
}

export interface BlogEntryWithContent extends BlogEntry {
	content: Component;
	sections: BlogSection[];
}

interface BlogFrontmatter {
	title: string;
	date: string;
	description?: string;
	author: string;
	authorRole?: string;
}

const WORDS_PER_MINUTE = 220;

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

function initialsFrom(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

function stripMarkdown(raw: string): string {
	return raw
		.replace(/^---[\s\S]*?---/, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
		.replace(/[#>*_~-]/g, ' ');
}

function countWords(raw: string): number {
	const text = stripMarkdown(raw).trim();
	if (!text) return 0;
	return text.split(/\s+/).length;
}

function formatReadTime(wordCount: number): string {
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return `${minutes} min read`;
}

function extractSections(raw: string): BlogSection[] {
	const body = raw.replace(/^---[\s\S]*?---/, '');
	const lines = body.split('\n');
	const sections: BlogSection[] = [];
	let inFence = false;
	for (const line of lines) {
		if (line.startsWith('```')) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const match = line.match(/^##\s+(.+)/);
		if (match) {
			const title = match[1].trim();
			sections.push({ title, id: slugify(title) });
		}
	}
	return sections;
}

function buildEntry(
	path: string,
	frontmatter: BlogFrontmatter,
	raw: string
): BlogEntry {
	const filename = path.split('/').pop()?.replace('.md', '') ?? '';
	const wordCount = countWords(raw);
	return {
		slug: filename,
		title: frontmatter.title,
		date: frontmatter.date,
		dateFormatted: formatDate(frontmatter.date),
		description: frontmatter.description ?? `Seaquel blog: ${frontmatter.title}`,
		author: {
			name: frontmatter.author,
			role: frontmatter.authorRole ?? 'Seaquel Team',
			initials: initialsFrom(frontmatter.author)
		},
		readTime: formatReadTime(wordCount),
		wordCount
	};
}

export async function getBlogEntries(): Promise<BlogEntry[]> {
	const modules = import.meta.glob<{ metadata: BlogFrontmatter }>(
		'/src/content/blog/*.md',
		{ eager: true }
	);
	const rawModules = import.meta.glob<string>('/src/content/blog/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const entries: BlogEntry[] = [];
	for (const [path, module] of Object.entries(modules)) {
		const raw = rawModules[path] ?? '';
		entries.push(buildEntry(path, module.metadata, raw));
	}

	return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogEntry(slug: string): Promise<BlogEntryWithContent | null> {
	const modules = import.meta.glob<{
		default: Component;
		metadata: BlogFrontmatter;
	}>('/src/content/blog/*.md');
	const rawModules = import.meta.glob<string>('/src/content/blog/*.md', {
		query: '?raw',
		import: 'default'
	});

	const path = `/src/content/blog/${slug}.md`;
	if (!(path in modules)) return null;

	const module = await modules[path]();
	const raw = rawModules[path] ? await rawModules[path]() : '';
	const base = buildEntry(path, module.metadata, raw);

	return {
		...base,
		content: module.default,
		sections: extractSections(raw)
	};
}

export function getBlogSlugs(): string[] {
	const modules = import.meta.glob('/src/content/blog/*.md');
	return Object.keys(modules).map(
		(path) => path.split('/').pop()?.replace('.md', '') ?? ''
	);
}
