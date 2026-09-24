import type { PGlite } from '@electric-sql/pglite';

export type RunResult =
	| { ok: true; columns: string[]; rows: unknown[][]; rowCount: number; elapsed: number }
	| { ok: false; message: string; hint?: string; elapsed: number };

/**
 * Everything a page shares across widgets. It hangs off globalThis so two
 * copies of the embed script (say, a blogger pinned an old version in one post
 * and the latest in another) still start only one Postgres.
 */
interface Shared {
	db: Promise<PGlite> | null;
	/** Setup SQL hash -> the schema that setup was loaded into. */
	schemas: Map<string, Promise<string>>;
	/** Tail of the run queue. */
	queue: Promise<unknown>;
}

const KEY = Symbol.for('seaquel-sql.shared');
const shared: Shared = ((globalThis as Record<symbol, unknown>)[KEY] as Shared) ??= {
	db: null,
	schemas: new Map(),
	queue: Promise.resolve()
};

/** The sample shop data lives in `demo`, same as /learn-sql. */
export const DEFAULT_SCHEMA = 'demo';

export function getDatabase(): Promise<PGlite> {
	shared.db ??= (async () => {
		const { PGlite } = await import('@electric-sql/pglite');
		return new PGlite();
	})();
	// A failed start (offline, blocked WASM) shouldn't stick for the whole visit.
	shared.db.catch(() => (shared.db = null));
	return shared.db;
}

/**
 * Widgets share one connection, so a BEGIN from one widget must never land in
 * the middle of another widget's transaction. Every database touch goes
 * through this queue.
 */
function exclusive<T>(task: () => Promise<T>): Promise<T> {
	const next = shared.queue.then(task, task);
	shared.queue = next.catch(() => {});
	return next;
}

/** FNV-1a; only needs to tell setups apart, not resist anyone. */
export function hashSetup(sql: string): string {
	let hash = 0x811c9dc5;
	for (let i = 0; i < sql.length; i++) {
		hash ^= sql.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(36);
}

/**
 * Loads `setup` into its own schema the first time it's seen and returns that
 * schema's name. Widgets with identical setup SQL share the schema, so a post
 * with five examples over the same tables only seeds once. `null` means the
 * built-in sample shop.
 */
export function prepareSchema(setup: string | null): Promise<string> {
	const key = setup === null ? '' : hashSetup(setup);
	let schema = shared.schemas.get(key);
	if (!schema) {
		schema = (async () => {
			const db = await getDatabase();
			if (setup === null) {
				// Most embeds bring their own tables, so the sample shop only
				// downloads for the ones that use it.
				const { SEED_SQL } = await import('../lib/sandbox/seed');
				await exclusive(() => db.exec(SEED_SQL));
				return DEFAULT_SCHEMA;
			}
			const name = `embed_${key}`;
			await exclusive(async () => {
				try {
					// Unqualified CREATE TABLEs in the setup land in the schema
					// because it's first on the search_path.
					await db.exec(`BEGIN; CREATE SCHEMA ${name}; SET LOCAL search_path TO ${name}, public;`);
					await db.exec(setup);
					await db.exec('COMMIT');
				} catch (err) {
					await db.exec('ROLLBACK').catch(() => {});
					throw err;
				}
			});
			return name;
		})();
		shared.schemas.set(key, schema);
		// Let a broken setup be retried after the author fixes it in devtools.
		schema.catch(() => shared.schemas.delete(key));
	}
	return schema;
}

/**
 * Runs `sql` against `schema` inside a transaction that is always rolled back,
 * so an UPDATE or DROP in one run never changes what the next run sees.
 */
export function runQuery(sql: string, schema: string): Promise<RunResult> {
	return exclusive(async () => {
		const db = await getDatabase();
		const started = performance.now();
		try {
			await db.exec(`BEGIN; SET LOCAL search_path TO ${schema}, public;`);
			// Array rows keep `SELECT c.id, o.id` from collapsing into one column.
			const results = await db.exec(sql, { rowMode: 'array' });
			const last = results.at(-1);
			const rows = (last?.rows ?? []) as unknown[][];
			return {
				ok: true,
				columns: last?.fields.map((f) => f.name) ?? [],
				rows,
				rowCount: last?.affectedRows || rows.length,
				elapsed: performance.now() - started
			};
		} catch (err) {
			const e = err as { message?: string; hint?: string };
			return {
				ok: false,
				message: e.message ?? String(err),
				hint: e.hint,
				elapsed: performance.now() - started
			};
		} finally {
			await db.exec('ROLLBACK').catch(() => {});
		}
	});
}
