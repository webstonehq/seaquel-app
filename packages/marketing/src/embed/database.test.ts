import { describe, expect, it } from 'vitest';
import { hashSetup, prepareSchema, runQuery } from './database';
import { dedent } from './dedent';

const PETS = `
	CREATE TABLE pets (id int PRIMARY KEY, name text, species text);
	INSERT INTO pets VALUES (1, 'Rex', 'dog'), (2, 'Tom', 'cat'), (3, 'Nemo', 'fish');
`;

describe('embed database', () => {
	it('runs against the sample shop when there is no setup', async () => {
		const schema = await prepareSchema(null);
		const result = await runQuery('SELECT count(*)::int AS n FROM customers', schema);
		expect(result).toMatchObject({ ok: true, columns: ['n'], rows: [[10]] });
	});

	it('loads custom setup into its own schema', async () => {
		const schema = await prepareSchema(PETS);
		expect(schema).toBe(`embed_${hashSetup(PETS)}`);
		const result = await runQuery("SELECT name FROM pets WHERE species = 'cat'", schema);
		expect(result).toMatchObject({ ok: true, rows: [['Tom']] });
	});

	it('shares a schema between widgets with the same setup', async () => {
		expect(await prepareSchema(PETS)).toBe(await prepareSchema(PETS));
	});

	it('keeps different setups apart even with the same table names', async () => {
		const other = `CREATE TABLE pets (id int, name text); INSERT INTO pets VALUES (1, 'Goldie');`;
		const [a, b] = await Promise.all([prepareSchema(PETS), prepareSchema(other)]);
		expect(await runQuery('SELECT count(*)::int FROM pets', a)).toMatchObject({ rows: [[3]] });
		expect(await runQuery('SELECT count(*)::int FROM pets', b)).toMatchObject({ rows: [[1]] });
	});

	it('rolls back writes after every run', async () => {
		const schema = await prepareSchema(PETS);
		const del = await runQuery('DELETE FROM pets', schema);
		expect(del).toMatchObject({ ok: true, columns: [], rowCount: 3 });
		expect(await runQuery('SELECT count(*)::int FROM pets', schema)).toMatchObject({ rows: [[3]] });
	});

	it('does not let concurrent runs interleave', async () => {
		// If one widget's BEGIN/search_path landed inside another's transaction,
		// runs would count the wrong table or see each other's DELETE.
		const a = await prepareSchema(PETS);
		const b = await prepareSchema(`CREATE TABLE pets (id int); INSERT INTO pets VALUES (1);`);
		const runs = await Promise.all(
			Array.from({ length: 8 }, (_, i) =>
				i % 2
					? runQuery('SELECT count(*)::int FROM pets', b)
					: runQuery('DELETE FROM pets WHERE id = 1; SELECT count(*)::int FROM pets', a)
			)
		);
		runs.forEach((run, i) => expect(run).toMatchObject({ ok: true, rows: [[i % 2 ? 1 : 2]] }));
	});

	it('reports query errors without breaking later runs', async () => {
		const schema = await prepareSchema(PETS);
		const bad = await runQuery('SELECT nope FROM pets', schema);
		expect(bad).toMatchObject({ ok: false });
		expect(bad.ok === false && bad.message).toMatch(/nope/);
		expect(await runQuery('SELECT 1', schema)).toMatchObject({ ok: true });
	});

	it('rejects broken setup and lets it be retried', async () => {
		const broken = 'CREATE TABLE t (id int); INSERT INTO t VALUES (oops);';
		await expect(prepareSchema(broken)).rejects.toThrow();
		await expect(prepareSchema(broken)).rejects.toThrow();
		// The failed attempt left nothing behind to trip up an unrelated setup.
		expect(await prepareSchema(PETS)).toMatch(/^embed_/);
	});
});

describe('dedent', () => {
	it('removes shared indentation and surrounding blank lines', () => {
		expect(dedent('\n\t\tSELECT *\n\t\t  FROM t\n\t\tWHERE x < 5\n\t')).toBe('SELECT *\n  FROM t\nWHERE x < 5');
	});

	it('ignores blank lines when measuring indentation', () => {
		expect(dedent('    a\n\n    b')).toBe('a\n\nb');
	});
});
