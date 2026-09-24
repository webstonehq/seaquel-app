import type { PGlite } from '@electric-sql/pglite';
import * as shared from '../../embed/database';

import type { RunResult } from '../../embed/database';

export type { RunResult };

/**
 * The sample-shop Postgres, started on first use. It's the same instance the
 * <seaquel-sql> widgets use, so a lesson page with runnable examples and
 * challenges downloads and boots PGlite once, and their runs never interleave.
 */
export async function getDatabase(): Promise<PGlite> {
	await shared.prepareSchema(null);
	return shared.getDatabase();
}

/**
 * Runs `sql` inside a transaction that is always rolled back, so an UPDATE or
 * DROP in one run never changes what the next run sees.
 */
export async function runQuery(sql: string): Promise<RunResult> {
	return shared.runQuery(sql, await shared.prepareSchema(null));
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
