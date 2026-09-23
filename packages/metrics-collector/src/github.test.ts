import { describe, expect, test } from 'vitest';
import { computeMetrics, fetchAllReleases, type GitHubRelease, type GitHubRepo } from './github';

const repo: GitHubRepo = {
	stargazers_count: 100,
	forks_count: 10,
	open_issues_count: 5,
};

function release(tag: string, publishedAt: string, assets: Record<string, number>): GitHubRelease {
	return {
		tag_name: tag,
		published_at: publishedAt,
		assets: Object.entries(assets).map(([name, download_count]) => ({ name, download_count })),
	};
}

describe('computeMetrics', () => {
	test('counts .rpm assets as Linux downloads', () => {
		const { metrics } = computeMetrics(
			[
				release('v1', '2026-01-01T00:00:00Z', {
					'Seaquel-1-1.x86_64.rpm': 192,
					'Seaquel_1_amd64.deb': 8,
				}),
			],
			repo,
			0,
		);

		expect(metrics.platformDownloads.linux).toBe(200);
		expect(metrics.totalDownloads).toBe(200);
	});

	test('excludes macOS updater bundles from downloads and reports them separately', () => {
		const { metrics } = computeMetrics(
			[
				release('v1', '2026-01-01T00:00:00Z', {
					'Seaquel_1_aarch64.dmg': 30,
					'Seaquel_aarch64.app.tar.gz': 50,
				}),
			],
			repo,
			0,
		);

		expect(metrics.platformDownloads.macOS).toBe(30);
		expect(metrics.totalDownloads).toBe(30);
		expect(metrics.updaterDownloads).toBe(50);
	});

	test('counts latest.json hits as updater checks rather than downloads', () => {
		const { metrics } = computeMetrics(
			[
				release('v1', '2026-01-01T00:00:00Z', {
					'latest.json': 535,
					'Seaquel_1_x64.dmg': 10,
				}),
			],
			repo,
			0,
		);

		expect(metrics.updaterChecks).toBe(535);
		expect(metrics.totalDownloads).toBe(10);
	});

	test('ignores signature files', () => {
		const { metrics } = computeMetrics(
			[
				release('v1', '2026-01-01T00:00:00Z', {
					'Seaquel_1_amd64.deb': 10,
					'Seaquel_1_amd64.deb.sig': 3,
				}),
			],
			repo,
			0,
		);

		expect(metrics.totalDownloads).toBe(10);
	});

	test('excludes open pull requests from the open issue count', () => {
		const { metrics } = computeMetrics([], { ...repo, open_issues_count: 5 }, 3);

		expect(metrics.openIssues).toBe(2);
		expect(metrics.openPullRequests).toBe(3);
	});

	test('reports the newest release tag and date', () => {
		const { metrics } = computeMetrics(
			[
				release('v2', '2026-02-01T00:00:00Z', {}),
				release('v1', '2026-01-01T00:00:00Z', {}),
			],
			repo,
			0,
		);

		expect(metrics.latestReleaseTag).toBe('v2');
		expect(metrics.latestRelease).toBe('2026-02-01T00:00:00Z');
	});

	test('breaks downloads down per release, oldest first', () => {
		const { releaseBreakdowns } = computeMetrics(
			[
				release('v2', '2026-02-01T00:00:00Z', { 'Seaquel_2_x64.dmg': 5 }),
				release('v1', '2026-01-01T00:00:00Z', {
					'Seaquel_1_x64.msi': 7,
					'Seaquel-1-1.x86_64.rpm': 2,
					'Seaquel_x64.app.tar.gz': 4,
				}),
			],
			repo,
			0,
		);

		expect(releaseBreakdowns).toEqual([
			{
				tag: 'v1',
				publishedAt: '2026-01-01T00:00:00Z',
				total: 9,
				macOS: 0,
				windows: 7,
				linux: 2,
				updater: 4,
			},
			{
				tag: 'v2',
				publishedAt: '2026-02-01T00:00:00Z',
				total: 5,
				macOS: 5,
				windows: 0,
				linux: 0,
				updater: 0,
			},
		]);
	});

	test('averages the gap between releases in days', () => {
		const { metrics } = computeMetrics(
			[
				release('v3', '2026-01-21T00:00:00Z', {}),
				release('v2', '2026-01-11T00:00:00Z', {}),
				release('v1', '2026-01-01T00:00:00Z', {}),
			],
			repo,
			0,
		);

		expect(metrics.totalReleases).toBe(3);
		expect(metrics.avgDaysBetweenReleases).toBe(10);
	});
});

describe('fetchAllReleases', () => {
	test('follows pagination until a short page comes back', async () => {
		const pages = new Map([
			[1, Array.from({ length: 100 }, (_, i) => release(`v${i}`, '2026-01-01T00:00:00Z', {}))],
			[2, Array.from({ length: 100 }, (_, i) => release(`w${i}`, '2026-01-01T00:00:00Z', {}))],
			[3, [release('x', '2026-01-01T00:00:00Z', {})]],
		]);
		const requested: number[] = [];

		const releases = await fetchAllReleases(async (url) => {
			const page = Number(new URL(url).searchParams.get('page'));
			requested.push(page);
			return new Response(JSON.stringify(pages.get(page) ?? []), { status: 200 });
		});

		expect(requested).toEqual([1, 2, 3]);
		expect(releases).toHaveLength(201);
	});

	test('throws when GitHub returns a non-OK status', async () => {
		await expect(
			fetchAllReleases(async () => new Response('rate limited', { status: 403 })),
		).rejects.toThrow(/GitHub/);
	});
});
