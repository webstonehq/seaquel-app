import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, describe, expect, it } from 'vitest';
import { SEED_SQL } from './seed';
import { ENGINE_SLUGS, codeSlug, isEngine } from './engines';
import { getEngineCodes } from '$lib/server/sql-error-codes';

// Every error page promises that its broken query produces the quoted error
// and its fixed query runs. Holding the content to that here keeps a typo in
// the markdown from shipping a sandbox that contradicts the page.

const dir = join(import.meta.dirname, '../../content/sql-errors');
const pages = readdirSync(dir)
	.filter((file) => file.endsWith('.md'))
	.map((file) => ({ slug: file.replace(/\.md$/, ''), data: matter.read(join(dir, file)).data }));

const lessonSlugs = readdirSync(join(import.meta.dirname, '../../content/learn-sql')).map((f) =>
	f.replace(/\.md$/, '')
);

let db: PGlite;

beforeAll(async () => {
	db = new PGlite();
	await db.exec(SEED_SQL);
}, 30_000);

async function run(sql: string) {
	await db.exec('BEGIN');
	try {
		return await db.exec(sql);
	} finally {
		await db.exec('ROLLBACK');
	}
}

describe.each(pages)('$slug', ({ slug, data }) => {
	it('does not shadow an engine code reference', () => {
		expect(ENGINE_SLUGS as readonly string[]).not.toContain(slug);
	});

	it('maps to codes that exist', () => {
		for (const [engine, value] of Object.entries<string>(data.codes ?? {})) {
			expect(isEngine(engine), `${slug}: unknown engine ${engine}`).toBe(true);
			if (!isEngine(engine)) continue;
			const slugs = getEngineCodes(engine).map((c) => codeSlug(engine, c.code, c.name));
			expect(slugs, `${slug}: ${engine} ${value}`).toContain(codeSlug(engine, value, value));
		}
	});

	it('has the required frontmatter', () => {
		for (const key of ['title', 'description', 'error', 'broken', 'fixed']) {
			expect(data[key], `${slug}: ${key}`).toBeTypeOf('string');
		}
		if (data.lesson) expect(lessonSlugs).toContain(data.lesson);
		for (const message of data.messages ?? []) {
			expect(message.engine).toBeTypeOf('string');
			expect(Boolean(message.text) !== Boolean(message.note), `${message.engine}: text xor note`).toBe(
				true
			);
		}
	});

	it('broken query fails with the quoted error', async () => {
		await expect(run(data.broken)).rejects.toThrow(data.error);
		// toThrow matches substrings; the page quotes the whole message.
		await run(data.broken).catch((err) => expect(err.message).toBe(data.error));
	});

	it('reports the SQLSTATE the page maps it to', async () => {
		if (!data.codes?.postgresql) return;
		await run(data.broken).catch((err) => expect(err.code).toBe(data.codes.postgresql));
	});

	it('fixed query runs', async () => {
		await expect(run(data.fixed)).resolves.toBeDefined();
	});
});
