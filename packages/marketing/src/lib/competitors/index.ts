import type { Component } from 'svelte';

/**
 * Comparison pages live or die on being believed. Every factual claim about a
 * competitor therefore sits in frontmatter next to the URL it came from, and
 * `content.test.ts` refuses to let a page ship without its sources, without
 * conceding at least three things, or with a stale verification date.
 */

export type CellValue = boolean | string;

/** How well a vendor's build for an OS keeps up with its flagship build. */
export type PlatformSupport = 'full' | 'trails' | 'none';

export interface ComparisonRow {
	feature: string;
	seaquel: CellValue;
	them: CellValue;
	/** Caveat shown under the row, for anything a tick or a cross would distort. */
	note?: string;
	/** Where `them` was verified. Required — see the test. */
	source: string;
}

export interface Concession {
	title: string;
	body: string;
}

export interface FaqEntry {
	q: string;
	a: string;
}

export interface Pricing {
	/** perpetual | subscription | open-core */
	model: string;
	summary: string;
	/** What you get without paying, including the limits. */
	free: string;
}

export interface Competitor {
	slug: string;
	name: string;
	vendor: string;
	/** ISO date the frontmatter was last checked against vendor sources. */
	verifiedOn: string;
	seoTitle: string;
	description: string;
	/** Set when this competitor also gets an /alternatives page. */
	altTitle?: string;
	altDescription?: string;
	/** Long-tail pages borrow another competitor's table and facts. */
	basedOn?: string;
	/** Headline for the long-tail framing section, when present. */
	angle?: string;
	sources: Record<string, string>;
	pricing: Pricing;
	engineCount: number;
	engines: string[];
	platforms: Record<'macos' | 'windows' | 'linux', PlatformSupport>;
	license: string;
	chooseSeaquel: string[];
	chooseThem: string[];
	rows: ComparisonRow[];
	theyWinAt: Concession[];
	faq: FaqEntry[];
	/** Name of the in-app importer that reads this tool's saved connections. */
	importer?: string;
}

export interface CompetitorWithContent extends Competitor {
	content: Component;
	/** The other competitors, for cross-linking every page to its siblings. */
	related: Array<{ slug: string; name: string }>;
}

type CompetitorFrontmatter = Omit<Competitor, 'slug' | 'seoTitle'> & { seoTitle?: string };

function slugFromPath(path: string): string {
	return path.split('/').pop()?.replace('.md', '') ?? '';
}

function build(path: string, frontmatter: CompetitorFrontmatter): Competitor {
	const slug = slugFromPath(path);
	return {
		...frontmatter,
		slug,
		seoTitle: frontmatter.seoTitle ?? `Seaquel vs ${frontmatter.name} | Seaquel`,
		sources: frontmatter.sources ?? {},
		engines: frontmatter.engines ?? [],
		rows: frontmatter.rows ?? [],
		theyWinAt: frontmatter.theyWinAt ?? [],
		faq: frontmatter.faq ?? [],
		chooseSeaquel: frontmatter.chooseSeaquel ?? [],
		chooseThem: frontmatter.chooseThem ?? []
	};
}

export async function getCompetitors(): Promise<Competitor[]> {
	const modules = import.meta.glob<{ metadata: CompetitorFrontmatter }>(
		'/src/content/competitors/*.md',
		{ eager: true }
	);

	return Object.entries(modules)
		.map(([path, module]) => build(path, module.metadata))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/** The four head-to-head pages, excluding long-tail pages built on top of them. */
export async function getComparisons(): Promise<Competitor[]> {
	return (await getCompetitors()).filter((c) => !c.basedOn);
}

/** Everything that earns an /alternatives page. */
export async function getAlternatives(): Promise<Competitor[]> {
	return (await getCompetitors()).filter((c) => c.altTitle);
}

export async function getCompetitor(slug: string): Promise<CompetitorWithContent | null> {
	const modules = import.meta.glob<{
		default: Component;
		metadata: CompetitorFrontmatter;
	}>('/src/content/competitors/*.md');

	const path = `/src/content/competitors/${slug}.md`;
	if (!(path in modules)) return null;

	const module = await modules[path]();
	const base = build(path, module.metadata);

	// A long-tail page inherits the table and the facts of the tool it is
	// about, so the numbers can never drift between the two pages.
	const parent = base.basedOn
		? ((await getCompetitors()).find((c) => c.slug === base.basedOn) ?? null)
		: null;

	const merged: Competitor = parent
		? {
				...parent,
				...base,
				rows: base.rows.length ? base.rows : parent.rows,
				theyWinAt: base.theyWinAt.length ? base.theyWinAt : parent.theyWinAt,
				sources: { ...parent.sources, ...base.sources }
			}
		: base;

	const related = (await getCompetitors())
		.filter((c) => c.slug !== slug && !c.basedOn)
		.map(({ slug, name }) => ({ slug, name }));

	return { ...merged, content: module.default, related };
}

export function getCompetitorSlugs(): string[] {
	return Object.keys(import.meta.glob('/src/content/competitors/*.md')).map(slugFromPath);
}
