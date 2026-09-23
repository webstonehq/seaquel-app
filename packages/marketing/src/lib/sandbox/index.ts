import type { PGlite } from '@electric-sql/pglite';
import { SEED_SQL } from './seed';

export type RunResult =
	| { ok: true; columns: string[]; rows: unknown[][]; rowCount: number; elapsed: number }
	| { ok: false; message: string; hint?: string; elapsed: number };

let instance: Promise<PGlite> | null = null;

/**
 * One Postgres per page, started on first use. PGlite is a few MB of WASM, so
 * it's only fetched once someone actually reaches for the sandbox.
 */
export function getDatabase(): Promise<PGlite> {
	instance ??= (async () => {
		const { PGlite } = await import('@electric-sql/pglite');
		const db = new PGlite();
		await db.exec(SEED_SQL);
		return db;
	})();
	// A failed start (offline, blocked WASM) shouldn't stick for the whole visit.
	instance.catch(() => (instance = null));
	return instance;
}

/**
 * Runs `sql` inside a transaction that is always rolled back, so an UPDATE or
 * DROP in one run never changes what the next run sees.
 */
export async function runQuery(sql: string): Promise<RunResult> {
	const db = await getDatabase();
	const started = performance.now();
	try {
		await db.exec('BEGIN');
		// Array rows keep `SELECT c.id, o.id` from collapsing into one column.
		const results = await db.exec(sql, { rowMode: 'array' });
		const last = results.at(-1);
		const columns = last?.fields.map((f) => f.name) ?? [];
		const rows = (last?.rows ?? []) as unknown[][];
		return {
			ok: true,
			columns,
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
}

/* ------------------------------------------------------------------ */
/* Challenge grading                                                    */
/* ------------------------------------------------------------------ */

export type Grade =
	| { status: 'correct'; result: Extract<RunResult, { ok: true }> }
	| { status: 'wrong'; reason: string; result: Extract<RunResult, { ok: true }> }
	| { status: 'error'; message: string; hint?: string };

/**
 * PGlite hands back NUMERIC/DECIMAL columns as strings ("149.99") and BIGINT
 * counts as strings too, so a naive === between a learner's row and the
 * expected row fails on type alone. Compare on a normalised form instead:
 * numbers by value, dates by ISO instant, everything else by string.
 */
function normalise(value: unknown): string {
	if (value === null || value === undefined) return '\u0000null';
	if (value instanceof Date) return value.toISOString();
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') {
		const asNumber = Number(value);
		// Only treat it as numeric when the string round-trips, so an id like
		// "007" or a name is never silently compared as a number.
		if (value.trim() !== '' && Number.isFinite(asNumber) && String(asNumber) === value.trim()) {
			return String(asNumber);
		}
		return value;
	}
	return JSON.stringify(value);
}

function rowKey(row: unknown[]): string {
	return row.map(normalise).join('\u001f');
}

export interface ChallengeCheck {
	/** Reference SQL whose result the learner's query must match. */
	solution: string;
	/** When false (the default) row order is ignored. */
	ordered?: boolean;
}

/**
 * Runs the learner's SQL and the reference solution against the same seeded
 * database and compares the result sets. Grading on rows rather than on the
 * query text means any correct formulation passes, which is the whole point.
 */
export async function gradeChallenge(sql: string, check: ChallengeCheck): Promise<Grade> {
	const trimmed = sql.trim();
	if (!trimmed) return { status: 'error', message: 'Write a query first.' };

	const attempt = await runQuery(trimmed);
	if (!attempt.ok) return { status: 'error', message: attempt.message, hint: attempt.hint };

	const expected = await runQuery(check.solution);
	if (!expected.ok) {
		// A broken reference query is an authoring bug, not the learner's fault.
		return { status: 'error', message: `This challenge is misconfigured: ${expected.message}` };
	}

	if (attempt.columns.length !== expected.columns.length) {
		return {
			status: 'wrong',
			reason: `Expected ${expected.columns.length} column${expected.columns.length === 1 ? '' : 's'}, got ${attempt.columns.length}.`,
			result: attempt
		};
	}

	if (attempt.rows.length !== expected.rows.length) {
		return {
			status: 'wrong',
			reason: `Expected ${expected.rows.length} row${expected.rows.length === 1 ? '' : 's'}, got ${attempt.rows.length}.`,
			result: attempt
		};
	}

	const attemptKeys = attempt.rows.map(rowKey);
	const expectedKeys = expected.rows.map(rowKey);

	if (check.ordered) {
		const at = attemptKeys.findIndex((key, i) => key !== expectedKeys[i]);
		if (at !== -1) {
			return {
				status: 'wrong',
				reason: `Right rows, wrong order — row ${at + 1} doesn't match. Check your ORDER BY.`,
				result: attempt
			};
		}
	} else {
		const remaining = new Map<string, number>();
		for (const key of expectedKeys) remaining.set(key, (remaining.get(key) ?? 0) + 1);
		for (const key of attemptKeys) {
			const count = remaining.get(key);
			if (!count) {
				return {
					status: 'wrong',
					reason: 'Row count matches but the values differ.',
					result: attempt
				};
			}
			remaining.set(key, count - 1);
		}
	}

	return { status: 'correct', result: attempt };
}
