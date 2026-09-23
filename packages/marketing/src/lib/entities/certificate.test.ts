import { describe, expect, it } from 'vitest';
import { verifyComplete } from './certificate';
import { CHALLENGES, TOTAL_CHALLENGES } from '$lib/learn-sql/challenges';

// The client reports which challenges it solved, and a client can always lie.
// The certificate is only worth anything because this check runs server-side
// against the catalogue rather than trusting a count.

function fullProgress(): Record<string, string[]> {
	return Object.fromEntries(
		Object.entries(CHALLENGES).map(([slug, list]) => [slug, list.map((c) => c.id)])
	);
}

describe('verifyComplete', () => {
	it('accepts a genuinely complete run', () => {
		const result = verifyComplete(fullProgress());
		expect(result.complete).toBe(true);
		expect(result.solved).toBe(TOTAL_CHALLENGES);
		expect(result.missing).toEqual([]);
	});

	it('rejects an empty claim', () => {
		const result = verifyComplete({});
		expect(result.complete).toBe(false);
		expect(result.solved).toBe(0);
		expect(result.missing).toHaveLength(TOTAL_CHALLENGES);
	});

	it('rejects a claim that is one challenge short', () => {
		const progress = fullProgress();
		const slug = Object.keys(CHALLENGES)[0];
		progress[slug] = progress[slug].slice(1);

		const result = verifyComplete(progress);
		expect(result.complete).toBe(false);
		expect(result.solved).toBe(TOTAL_CHALLENGES - 1);
	});

	it('ignores invented challenge ids', () => {
		const result = verifyComplete({
			joins: Array.from({ length: 500 }, (_, i) => `made-up-${i}`)
		});
		expect(result.complete).toBe(false);
		expect(result.solved).toBe(0);
	});

	it('does not let ids from one lesson satisfy another', () => {
		const [firstSlug, firstList] = Object.entries(CHALLENGES)[0];
		const [secondSlug] = Object.entries(CHALLENGES)[1];
		const ids = firstList.map((c) => c.id);

		// Same ids submitted under both lessons.
		const result = verifyComplete({ [firstSlug]: ids, [secondSlug]: ids });
		expect(result.complete).toBe(false);
		expect(result.solved).toBe(ids.length);
	});

	it('tolerates a malformed payload without throwing', () => {
		expect(() => verifyComplete({ joins: [] })).not.toThrow();
		expect(verifyComplete({ joins: [] }).complete).toBe(false);
	});
});
