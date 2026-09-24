import type { Component } from 'svelte';
import { getLessons, type LessonLink } from '$lib/learn-sql';
import { ENGINE_NAMES, codeHref, codeSlug, isEngine, type EngineSlug } from './engines';

export interface EngineMessage {
	engine: string;
	/** The message verbatim. */
	text?: string;
	/** Used instead of `text` when the engine doesn't error, e.g. returns NULL. */
	note?: string;
}

export interface SqlError {
	slug: string;
	/** The error as people paste it into a search box. Doubles as the H1. */
	title: string;
	seoTitle: string;
	description: string;
	/** Slug of the /learn-sql lesson that covers the concept behind the error. */
	lesson?: string;
	/** What PostgreSQL (and so the in-page sandbox) prints for `broken`. */
	error: string;
	broken: string;
	fixed: string;
	/** The same mistake as other engines word it. */
	messages: EngineMessage[];
	/**
	 * The error code each engine reports for `broken`, linking the guide to
	 * /sql-errors/{engine}/{code}. SQLite codes are given by name.
	 */
	codes: Partial<Record<EngineSlug, string>>;
}

export interface SqlErrorWithContent extends SqlError {
	content: Component;
	lessonLink: LessonLink | null;
	related: Array<{ slug: string; title: string }>;
}

type SqlErrorFrontmatter = Omit<SqlError, 'slug' | 'seoTitle' | 'codes'> & {
	seoTitle?: string;
	codes?: SqlError['codes'];
};

function slugFromPath(path: string): string {
	return path.split('/').pop()?.replace('.md', '') ?? '';
}

function buildError(path: string, frontmatter: SqlErrorFrontmatter): SqlError {
	return {
		slug: slugFromPath(path),
		title: frontmatter.title,
		seoTitle: frontmatter.seoTitle ?? `${frontmatter.title} | Seaquel`,
		description: frontmatter.description,
		lesson: frontmatter.lesson,
		error: frontmatter.error,
		// YAML block scalars keep a trailing newline; the editor shouldn't.
		broken: frontmatter.broken.trim(),
		fixed: frontmatter.fixed.trim(),
		messages: frontmatter.messages ?? [],
		codes: frontmatter.codes ?? {}
	};
}

export async function getSqlErrors(): Promise<SqlError[]> {
	const modules = import.meta.glob<{ metadata: SqlErrorFrontmatter }>(
		'/src/content/sql-errors/*.md',
		{ eager: true }
	);

	return Object.entries(modules)
		.map(([path, module]) => buildError(path, module.metadata))
		.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getSqlError(slug: string): Promise<SqlErrorWithContent | null> {
	const modules = import.meta.glob<{
		default: Component;
		metadata: SqlErrorFrontmatter;
	}>('/src/content/sql-errors/*.md');

	const path = `/src/content/sql-errors/${slug}.md`;
	if (!(path in modules)) return null;

	const module = await modules[path]();
	const base = buildError(path, module.metadata);

	const lessons = await getLessons();
	const lesson = lessons.find((l) => l.slug === base.lesson);

	// Errors from the same lesson first, then the rest, so every page links out
	// to a handful of siblings and crawlers reach the whole set.
	const others = (await getSqlErrors()).filter((e) => e.slug !== slug);
	const related = [
		...others.filter((e) => base.lesson && e.lesson === base.lesson),
		...others.filter((e) => !base.lesson || e.lesson !== base.lesson)
	]
		.slice(0, 5)
		.map(({ slug, title }) => ({ slug, title }));

	return {
		...base,
		content: module.default,
		lessonLink: lesson ? { slug: lesson.slug, title: lesson.title } : null,
		related
	};
}

export async function getSqlErrorsForLesson(lesson: string): Promise<SqlError[]> {
	return (await getSqlErrors()).filter((e) => e.lesson === lesson);
}

export function getSqlErrorSlugs(): string[] {
	const modules = import.meta.glob('/src/content/sql-errors/*.md');
	return Object.keys(modules).map(slugFromPath);
}

/** A guide's codes as links, keyed by engine name as `messages` spells it. */
export function codeLinks(
	codes: SqlError['codes']
): Record<string, { href: string; label: string }> {
	const links: Record<string, { href: string; label: string }> = {};
	for (const [engine, value] of Object.entries(codes)) {
		if (!isEngine(engine) || !value) continue;
		links[ENGINE_NAMES[engine]] = { href: codeHref(engine, codeSlug(engine, value, value)), label: value };
	}
	return links;
}
