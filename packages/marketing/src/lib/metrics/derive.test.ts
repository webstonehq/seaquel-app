import { describe, expect, test } from 'vitest';
import { dailyDownloads, downloadsInWindow, latestReleaseAdoption } from './derive';
import type { HistoricalEntry } from './types';

function entry(
	date: string,
	totalDownloads: number,
	overrides: Partial<HistoricalEntry> = {},
): HistoricalEntry {
	const macOS = Math.round(totalDownloads / 2);
	return {
		date,
		totalDownloads,
		updaterDownloads: 0,
		updaterChecks: 0,
		stars: 0,
		forks: 0,
		openIssues: 0,
		openPullRequests: 0,
		platformDownloads: { macOS, windows: totalDownloads - macOS, linux: 0 },
		totalReleases: 1,
		avgDaysBetweenReleases: 0,
		...overrides,
	};
}

describe('downloadsInWindow', () => {
	test('diffs against the snapshot one window back', () => {
		const history = [
			entry('2026-08-01', 1000),
			entry('2026-08-24', 1200),
			entry('2026-08-25', 1250),
			entry('2026-09-24', 1800),
		];

		expect(downloadsInWindow(history, 30)).toEqual({
			downloads: 550,
			since: '2026-08-25',
			spansFullWindow: true,
		});
	});

	test('reports a partial window when history is younger than the window', () => {
		const history = [entry('2026-09-10', 100), entry('2026-09-24', 400)];

		expect(downloadsInWindow(history, 30)).toEqual({
			downloads: 300,
			since: '2026-09-10',
			spansFullWindow: false,
		});
	});

	test('skips the day the collector started counting different assets', () => {
		const history = [
			entry('2026-09-21', 3267),
			entry('2026-09-22', 3286),
			entry('2026-09-23', 3307),
			entry('2026-09-24', 3436, { releaseTotals: { v1: 3436 } }),
			entry('2026-09-25', 3450, { releaseTotals: { v1: 3450 } }),
		];

		expect(downloadsInWindow(history, 30)).toEqual({
			downloads: 19 + 21 + 14,
			since: '2026-09-21',
			spansFullWindow: false,
		});
	});

	test('returns nothing measurable from a single snapshot', () => {
		expect(downloadsInWindow([entry('2026-09-24', 400)], 30)).toEqual({
			downloads: 0,
			since: null,
			spansFullWindow: false,
		});
	});
});

describe('dailyDownloads', () => {
	test('turns cumulative totals into per-day new downloads', () => {
		const history = [
			entry('2026-09-01', 100, { platformDownloads: { macOS: 60, windows: 30, linux: 10 } }),
			entry('2026-09-02', 140, { platformDownloads: { macOS: 80, windows: 45, linux: 15 } }),
			entry('2026-09-03', 155, { platformDownloads: { macOS: 85, windows: 50, linux: 20 } }),
		];

		expect(dailyDownloads(history)).toEqual([
			{ date: new Date('2026-09-02'), macOS: 20, windows: 15, linux: 5 },
			{ date: new Date('2026-09-03'), macOS: 5, windows: 5, linux: 5 },
		]);
	});

	test('clamps the drop when a release is deleted from GitHub', () => {
		const history = [
			entry('2026-09-01', 100, { platformDownloads: { macOS: 60, windows: 30, linux: 10 } }),
			entry('2026-09-02', 50, { platformDownloads: { macOS: 20, windows: 20, linux: 10 } }),
		];

		expect(dailyDownloads(history)).toEqual([
			{ date: new Date('2026-09-02'), macOS: 0, windows: 0, linux: 0 },
		]);
	});

	test('reports zero on the day the collector started counting different assets', () => {
		const history = [
			entry('2026-09-23', 3307, { platformDownloads: { macOS: 1078, windows: 1545, linux: 684 } }),
			entry('2026-09-24', 3436, {
				platformDownloads: { macOS: 864, windows: 1556, linux: 1016 },
				releaseTotals: { v1: 3436 },
			}),
			entry('2026-09-25', 3450, {
				platformDownloads: { macOS: 870, windows: 1560, linux: 1020 },
				releaseTotals: { v1: 3450 },
			}),
		];

		expect(dailyDownloads(history)).toEqual([
			{ date: new Date('2026-09-24'), macOS: 0, windows: 0, linux: 0 },
			{ date: new Date('2026-09-25'), macOS: 6, windows: 4, linux: 4 },
		]);
	});

	test('has no deltas to report from a single snapshot', () => {
		expect(dailyDownloads([entry('2026-09-01', 100)])).toEqual([]);
	});
});

describe('latestReleaseAdoption', () => {
	test('reports the share of recent downloads taken on the newest release', () => {
		const history = [
			entry('2026-09-10', 1000, { releaseTotals: { 'v2026.9.1': 400, 'v2026.9.2': 0 } }),
			entry('2026-09-24', 1100, { releaseTotals: { 'v2026.9.1': 425, 'v2026.9.2': 75 } }),
		];

		expect(latestReleaseAdoption(history, 'v2026.9.2', 14)).toEqual({
			share: 0.75,
			onLatest: 75,
			total: 100,
			since: '2026-09-10',
		});
	});

	test('treats a release absent from the older snapshot as all-new', () => {
		const history = [
			entry('2026-09-10', 1000, { releaseTotals: { 'v2026.9.1': 400 } }),
			entry('2026-09-24', 1050, { releaseTotals: { 'v2026.9.1': 400, 'v2026.9.2': 50 } }),
		];

		expect(latestReleaseAdoption(history, 'v2026.9.2', 14)?.onLatest).toBe(50);
	});

	test('is unavailable when no downloads happened in the window', () => {
		const history = [
			entry('2026-09-10', 1000, { releaseTotals: { 'v1': 1000 } }),
			entry('2026-09-24', 1000, { releaseTotals: { 'v1': 1000 } }),
		];

		expect(latestReleaseAdoption(history, 'v1', 14)).toBeNull();
	});

	test('is unavailable before the collector recorded per-release totals', () => {
		const history = [entry('2026-09-10', 1000), entry('2026-09-24', 1100)];

		expect(latestReleaseAdoption(history, 'v1', 14)).toBeNull();
	});
});
