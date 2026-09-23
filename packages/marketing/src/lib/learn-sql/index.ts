import type { Component } from 'svelte';
import { slug as slugify } from 'github-slugger';

export interface LessonSection {
	title: string;
	id: string;
}

export interface LessonLink {
	slug: string;
	title: string;
}

export interface Lesson {
	slug: string;
	title: string;
	seoTitle: string;
	description: string;
	/** Position in the course. Drives ordering and prev/next. */
	order: number;
	/** Path segment under /demo/learn/ for the interactive exercise, if any. */
	demo?: string;
	readTime: string;
	wordCount: number;
}

export interface LessonWithContent extends Lesson {
	content: Component;
	sections: LessonSection[];
	previous: LessonLink | null;
	next: LessonLink | null;
}

interface LessonFrontmatter {
	title: string;
	seoTitle?: string;
	description: string;
	order: number;
	demo?: string;
}

const WORDS_PER_MINUTE = 220;

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
	return `${minutes} min`;
}

function extractSections(raw: string): LessonSection[] {
	const body = raw.replace(/^---[\s\S]*?---/, '');
	const sections: LessonSection[] = [];
	let inFence = false;
	for (const line of body.split('\n')) {
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

function buildLesson(path: string, frontmatter: LessonFrontmatter, raw: string): Lesson {
	const slug = path.split('/').pop()?.replace('.md', '') ?? '';
	const wordCount = countWords(raw);
	return {
		slug,
		title: frontmatter.title,
		seoTitle: frontmatter.seoTitle ?? `${frontmatter.title} | Seaquel`,
		description: frontmatter.description,
		order: frontmatter.order,
		demo: frontmatter.demo,
		readTime: formatReadTime(wordCount),
		wordCount
	};
}

export async function getLessons(): Promise<Lesson[]> {
	const modules = import.meta.glob<{ metadata: LessonFrontmatter }>(
		'/src/content/learn-sql/*.md',
		{ eager: true }
	);
	const rawModules = import.meta.glob<string>('/src/content/learn-sql/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});

	const lessons: Lesson[] = [];
	for (const [path, module] of Object.entries(modules)) {
		lessons.push(buildLesson(path, module.metadata, rawModules[path] ?? ''));
	}

	return lessons.sort((a, b) => a.order - b.order);
}

export async function getLesson(slug: string): Promise<LessonWithContent | null> {
	const modules = import.meta.glob<{
		default: Component;
		metadata: LessonFrontmatter;
	}>('/src/content/learn-sql/*.md');
	const rawModules = import.meta.glob<string>('/src/content/learn-sql/*.md', {
		query: '?raw',
		import: 'default'
	});

	const path = `/src/content/learn-sql/${slug}.md`;
	if (!(path in modules)) return null;

	const module = await modules[path]();
	const raw = rawModules[path] ? await rawModules[path]() : '';
	const base = buildLesson(path, module.metadata, raw);

	// Neighbours come from the full ordered list so the course chains together
	// even when lessons are added out of sequence.
	const all = await getLessons();
	const index = all.findIndex((lesson) => lesson.slug === slug);
	const toLink = (lesson: Lesson | undefined): LessonLink | null =>
		lesson ? { slug: lesson.slug, title: lesson.title } : null;

	return {
		...base,
		content: module.default,
		sections: extractSections(raw),
		previous: toLink(all[index - 1]),
		next: toLink(all[index + 1])
	};
}

export function getLessonSlugs(): string[] {
	const modules = import.meta.glob('/src/content/learn-sql/*.md');
	return Object.keys(modules).map((path) => path.split('/').pop()?.replace('.md', '') ?? '');
}
