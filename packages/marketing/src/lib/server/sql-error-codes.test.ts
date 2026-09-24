import { describe, expect, it } from 'vitest';
import { ENGINE_SLUGS, codeSlug } from '$lib/sql-errors/engines';
import { getCodePage, getEngineCodes } from './sql-error-codes';

// The lists are parsed out of each engine's HTML or markdown docs by
// scripts/fetch-sql-error-codes.ts. A layout change upstream tends to break
// the parser quietly, leaving half a list or empty fields; these catch that
// before it ships.

const ANCHORS = {
	postgresql: { code: '42703', name: 'undefined_column', min: 250 },
	mysql: { code: '1054', name: 'ER_BAD_FIELD_ERROR', min: 1500 },
	sqlite: { code: '2067', name: 'SQLITE_CONSTRAINT_UNIQUE', min: 100 },
	'sql-server': { code: '207', name: 'SQ_BADCOL', min: 4000 }
} as const;

describe.each(ENGINE_SLUGS)('%s', (engine) => {
	const codes = getEngineCodes(engine);

	it('has the whole list', () => {
		expect(codes.length).toBeGreaterThanOrEqual(ANCHORS[engine].min);
	});

	it('has well-formed entries', () => {
		for (const code of codes) {
			expect(code.code, JSON.stringify(code)).toMatch(/^[0-9A-Z]+$/);
			expect(code.category, code.code).toBeTruthy();
			expect(code.docsUrl, code.code).toMatch(/^https:\/\//);
			if (engine !== 'postgresql' && engine !== 'sqlite') expect(code.message, code.code).toBeTruthy();
			if (engine === 'sqlite') expect(code.description, code.code).toBeTruthy();
		}
	});

	it('has unique URLs', () => {
		const slugs = codes.map((c) => codeSlug(engine, c.code, c.name));
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('includes a known code', () => {
		const { code, name } = ANCHORS[engine];
		expect(codes.find((c) => c.code === code)?.name).toBe(name);
	});
});

describe('getCodePage', () => {
	it('links a code to its guide and to other engines', async () => {
		const page = await getCodePage('mysql', '1054');
		expect(page?.indexable).toBe(true);
		expect(page?.guides.map((g) => g.slug)).toContain('column-does-not-exist');
		expect(page?.equivalents.map((e) => `${e.engine}:${e.code}`)).toEqual(
			expect.arrayContaining(['postgresql:42703', 'sql-server:207'])
		);
	});

	it('keeps a bare code out of the index', async () => {
		const page = await getCodePage('postgresql', '42P07');
		expect(page?.indexable).toBe(false);
		expect(page?.siblings.length).toBeGreaterThan(0);
	});

	it('finds SQLite codes by name', async () => {
		const page = await getCodePage('sqlite', 'sqlite-constraint-unique');
		expect(page?.code.code).toBe('2067');
		expect(page?.indexable).toBe(true);
	});
});
