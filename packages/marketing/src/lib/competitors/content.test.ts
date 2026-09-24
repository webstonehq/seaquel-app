import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

// A comparison page is only worth writing if a sceptical reader can check it.
// These guards encode that: every claim about a competitor carries the URL it
// came from, every page concedes at least three things the competitor does
// better, and the whole set goes stale on a timer so nobody discovers a
// two-year-old price on a page we told people to trust.

const MAX_AGE_DAYS = 180;
const MIN_CONCESSIONS = 3;

const dir = join(import.meta.dirname, '../../content/competitors');
const pages = readdirSync(dir)
	.filter((file) => file.endsWith('.md'))
	.map((file) => ({ slug: file.replace(/\.md$/, ''), data: matter.read(join(dir, file)).data }));

it('has competitor pages to check', () => {
	expect(pages.length).toBeGreaterThan(0);
});

describe.each(pages)('$slug', ({ slug, data }) => {
	const derived = Boolean(data.basedOn);

	it('has the required frontmatter', () => {
		for (const key of ['name', 'vendor', 'verifiedOn', 'description']) {
			expect(data[key], `${slug}: ${key}`).toBeTypeOf('string');
		}
		expect(data.verifiedOn, `${slug}: verifiedOn must be ISO`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('names the sources it was built from', () => {
		const sources = Object.values(data.sources ?? {});
		expect(sources.length, `${slug}: needs at least one source`).toBeGreaterThan(0);
		for (const url of sources) {
			expect(url, `${slug}: source`).toMatch(/^https:\/\//);
		}
	});

	it.runIf(!derived)('states pricing, platforms and licence', () => {
		expect(data.pricing?.model, `${slug}: pricing.model`).toBeTypeOf('string');
		expect(data.pricing?.summary, `${slug}: pricing.summary`).toBeTypeOf('string');
		expect(data.license, `${slug}: license`).toBeTypeOf('string');
		expect(data.engineCount, `${slug}: engineCount`).toBeTypeOf('number');
		for (const os of ['macos', 'windows', 'linux']) {
			expect(['full', 'trails', 'none'], `${slug}: platforms.${os}`).toContain(
				data.platforms?.[os]
			);
		}
	});

	it.runIf(!derived)('sources every comparison row', () => {
		expect(data.rows?.length, `${slug}: needs comparison rows`).toBeGreaterThan(0);
		for (const row of data.rows) {
			expect(row.feature, `${slug}: row.feature`).toBeTypeOf('string');
			expect(row.source, `${slug}: "${row.feature}" needs a source`).toMatch(/^https:\/\//);
			expect(['boolean', 'string'], `${slug}: "${row.feature}" seaquel`).toContain(
				typeof row.seaquel
			);
			expect(['boolean', 'string'], `${slug}: "${row.feature}" them`).toContain(typeof row.them);
		}
	});

	it.runIf(!derived)(`concedes at least ${MIN_CONCESSIONS} things`, () => {
		expect(data.theyWinAt?.length ?? 0, `${slug}: theyWinAt`).toBeGreaterThanOrEqual(
			MIN_CONCESSIONS
		);
		for (const win of data.theyWinAt) {
			expect(win.title, `${slug}: theyWinAt.title`).toBeTypeOf('string');
			// Long enough to be a real reason rather than a dismissive clause.
			expect(win.body?.length ?? 0, `${slug}: "${win.title}" is too thin`).toBeGreaterThan(40);
		}
	});

	it.runIf(!derived)('gives both sides of the verdict', () => {
		expect(data.chooseSeaquel?.length ?? 0, `${slug}: chooseSeaquel`).toBeGreaterThan(0);
		expect(data.chooseThem?.length ?? 0, `${slug}: chooseThem`).toBeGreaterThan(0);
	});

	it(`was verified within ${MAX_AGE_DAYS} days`, () => {
		const age = (Date.now() - Date.parse(data.verifiedOn)) / 86_400_000;
		expect(
			age,
			`${slug}: verified ${Math.round(age)} days ago — re-check the vendor's pricing and platform pages, then bump verifiedOn`
		).toBeLessThan(MAX_AGE_DAYS);
	});
});
