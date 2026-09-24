import { describe, expect, it } from 'vitest';
import { ENGINE_SLUGS, codeSlug } from '$lib/sql-errors/engines';
import { getCodePage, getEngineCodes } from './sql-error-codes';
import { examples } from '../../content/sql-error-codes/examples/postgresql';
import { prepareSchema, runQuery } from '../../embed/database';
import { getSqlErrors } from '$lib/sql-errors';

const guideCodes = (await getSqlErrors()).flatMap((g) => g.codes.postgresql ?? []);

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
		const page = await getCodePage('postgresql', '42P04');
		expect(page?.indexable).toBe(false);
		expect(page?.siblings.length).toBeGreaterThan(0);
	});

	it('reuses a guide’s queries as the example for its code', async () => {
		const guide = (await getSqlErrors()).find((g) => g.slug === 'column-does-not-exist')!;
		const page = await getCodePage('postgresql', '42703');
		expect(page?.example).toEqual({ broken: guide.broken, fixed: guide.fixed });
	});

	it('gives other engines no example, since the widget runs PostgreSQL', async () => {
		expect((await getCodePage('mysql', '1054'))?.example).toBeNull();
	});

	it('finds SQLite codes by name', async () => {
		const page = await getCodePage('sqlite', 'sqlite-constraint-unique');
		expect(page?.code.code).toBe('2067');
		expect(page?.indexable).toBe(true);
	});
});

// Each example has to do on the page what it claims: the broken query fails
// with its code and the fixed one runs. They go through the widget's own
// database code, so the test sees exactly what a reader would.
describe('PostgreSQL examples', () => {
	const known = new Set(getEngineCodes('postgresql').map((c) => c.code));

	it.each(Object.entries(examples))('%s', async (code, example) => {
		expect(known, 'not a PostgreSQL code').toContain(code);
		expect(guideCodes, 'covered by a guide, whose queries the page reuses').not.toContain(code);
		// The page writes the setup into a <script type="text/sql"> unescaped.
		expect(example.setup ?? '').not.toMatch(/<\/script/i);

		const schema = await prepareSchema(example.setup?.trim() ?? null);
		const broken = await runQuery(example.broken.trim(), schema);
		expect(broken.ok ? 'no error' : `${broken.code}: ${broken.message}`).toMatch(new RegExp(`^${code}:`));

		const fixed = await runQuery(example.fixed.trim(), schema);
		expect(fixed.ok ? 'ok' : `${fixed.code}: ${fixed.message}`).toBe('ok');
	});
});
