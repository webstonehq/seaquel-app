import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CHALLENGES } from './challenges';
import { gradeChallenge, runQuery } from '$lib/sandbox';

// Every challenge ships a reference solution that the grader runs on each
// submission. A solution that stops working would silently mark correct
// answers wrong, so each one is executed here.

const lessonSlugs = new Set(
	readdirSync(join(import.meta.dirname, '../../content/learn-sql')).map((file) =>
		file.replace(/\.md$/, '')
	)
);

const all = Object.entries(CHALLENGES).flatMap(([slug, list]) =>
	list.map((challenge) => ({ slug, challenge }))
);

describe('challenge catalogue', () => {
	it('only references lessons that exist', () => {
		for (const slug of Object.keys(CHALLENGES)) {
			expect(lessonSlugs.has(slug), `no lesson named ${slug}`).toBe(true);
		}
	});

	it('uses unique ids, since progress is recorded against them', () => {
		const ids = all.map(({ challenge }) => challenge.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('gives every lesson with challenges at least two', () => {
		for (const [slug, list] of Object.entries(CHALLENGES)) {
			expect(list.length, `${slug} has ${list.length}`).toBeGreaterThanOrEqual(2);
		}
	});
});

describe.each(all)('$slug / $challenge.id', ({ challenge }) => {
	it('has a solution that runs and returns rows', async () => {
		const result = await runQuery(challenge.solution);
		if (!result.ok) throw new Error(`solution failed: ${result.message}`);
		expect(result.rows.length).toBeGreaterThan(0);
	});

	it('grades its own solution as correct', async () => {
		const grade = await gradeChallenge(challenge.solution, {
			solution: challenge.solution,
			ordered: challenge.ordered
		});
		expect(grade.status).toBe('correct');
	});

	it('does not grade the starter as already correct', async () => {
		if (!challenge.starter) return;
		const grade = await gradeChallenge(challenge.starter, {
			solution: challenge.solution,
			ordered: challenge.ordered
		});
		expect(grade.status).not.toBe('correct');
	});
});
