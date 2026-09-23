import type { CachedData, PlatformDownloads, ReleaseDownloads, OpenMetrics } from './types';

interface GitHubAsset {
	name: string;
	download_count: number;
}

export interface GitHubRelease {
	tag_name: string;
	published_at: string;
	assets: GitHubAsset[];
}

export interface GitHubRepo {
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
}

type AssetKind = keyof PlatformDownloads | 'updater' | 'updaterCheck' | 'ignored';

/**
 * Tauri publishes three kinds of asset per release: installers, the auto-updater
 * bundle, and the updater manifest every running install polls. Only the first
 * is a download in any meaningful sense.
 */
export function classifyAsset(name: string): AssetKind {
	if (name.endsWith('.sig')) return 'ignored';
	if (name.endsWith('latest.json')) return 'updaterCheck';
	if (name.includes('.app.tar.gz')) return 'updater';
	if (name.endsWith('.dmg')) return 'macOS';
	if (name.endsWith('.exe') || name.endsWith('.msi')) return 'windows';
	if (name.endsWith('.AppImage') || name.endsWith('.deb') || name.endsWith('.rpm')) return 'linux';
	return 'ignored';
}

export function computeMetrics(
	releases: GitHubRelease[],
	repo: GitHubRepo,
	openPullRequests: number,
): CachedData {
	let totalDownloads = 0;
	let updaterDownloads = 0;
	let updaterChecks = 0;
	const platformDownloads: PlatformDownloads = { macOS: 0, windows: 0, linux: 0 };
	const releaseBreakdowns: ReleaseDownloads[] = [];

	for (const release of releases) {
		const perRelease: ReleaseDownloads = {
			tag: release.tag_name,
			publishedAt: release.published_at,
			total: 0,
			macOS: 0,
			windows: 0,
			linux: 0,
			updater: 0,
		};

		for (const asset of release.assets) {
			const kind = classifyAsset(asset.name);

			if (kind === 'ignored') continue;

			if (kind === 'updaterCheck') {
				updaterChecks += asset.download_count;
				continue;
			}

			if (kind === 'updater') {
				updaterDownloads += asset.download_count;
				perRelease.updater += asset.download_count;
				continue;
			}

			totalDownloads += asset.download_count;
			platformDownloads[kind] += asset.download_count;
			perRelease.total += asset.download_count;
			perRelease[kind] += asset.download_count;
		}

		releaseBreakdowns.push(perRelease);
	}

	releaseBreakdowns.sort(
		(a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
	);

	const newestFirst = releases
		.map((r) => new Date(r.published_at).getTime())
		.sort((a, b) => b - a);

	let avgDaysBetweenReleases = 0;
	if (newestFirst.length > 1) {
		const span = newestFirst[0] - newestFirst[newestFirst.length - 1];
		avgDaysBetweenReleases = Math.round(
			span / (newestFirst.length - 1) / (1000 * 60 * 60 * 24),
		);
	}

	const latest = releaseBreakdowns.at(-1);

	const metrics: OpenMetrics = {
		totalDownloads,
		updaterDownloads,
		updaterChecks,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
		openIssues: Math.max(0, repo.open_issues_count - openPullRequests),
		openPullRequests,
		platformDownloads,
		totalReleases: releases.length,
		latestRelease: latest?.publishedAt ?? '',
		latestReleaseTag: latest?.tag ?? '',
		avgDaysBetweenReleases,
	};

	return { metrics, releaseBreakdowns };
}

type Fetcher = (url: string) => Promise<Response>;

const PER_PAGE = 100;

/** GitHub caps a page at 100 releases; without following pages the totals silently shrink as releases accumulate. */
export async function fetchAllReleases(fetcher: Fetcher): Promise<GitHubRelease[]> {
	const all: GitHubRelease[] = [];

	for (let page = 1; ; page++) {
		const res = await fetcher(
			`https://api.github.com/repos/WebstoneHQ/seaquel/releases?per_page=${PER_PAGE}&page=${page}`,
		);
		if (!res.ok) {
			throw new Error(`GitHub releases request failed: ${res.status} ${res.statusText}`);
		}

		const batch: GitHubRelease[] = await res.json();
		all.push(...batch);

		if (batch.length < PER_PAGE) return all;
	}
}

export async function fetchFromGitHub(env: Env): Promise<CachedData> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'seaquel-metrics-collector',
	};
	if (env.GITHUB_TOKEN) {
		console.log('GITHUB_TOKEN present, sending an authenticated request to GitHub');
		headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
	}

	const fetcher: Fetcher = (url) => fetch(url, { headers });

	const [releases, repoRes, pullsRes] = await Promise.all([
		fetchAllReleases(fetcher),
		fetcher('https://api.github.com/repos/WebstoneHQ/seaquel'),
		fetcher(
			'https://api.github.com/search/issues?q=' +
				encodeURIComponent('repo:WebstoneHQ/seaquel is:pr is:open') +
				'&per_page=1',
		),
	]);

	if (!repoRes.ok || !pullsRes.ok) {
		const failedRes = !repoRes.ok ? repoRes : pullsRes;
		const body = await failedRes.text().catch(() => '(unreadable)');
		const remaining = failedRes.headers.get('X-RateLimit-Remaining');
		const resetEpoch = failedRes.headers.get('X-RateLimit-Reset');
		const resetIn = resetEpoch
			? `${Math.ceil((Number(resetEpoch) * 1000 - Date.now()) / 60000)}min`
			: 'unknown';

		console.error(
			'[metrics] GitHub API returned non-OK status:',
			`repo=${repoRes.status} ${repoRes.statusText},`,
			`pulls=${pullsRes.status} ${pullsRes.statusText},`,
			`rateLimit remaining=${remaining}, resets in ${resetIn},`,
			`body=${body}`,
		);
		throw new Error('GitHub API request failed');
	}

	const repo: GitHubRepo = await repoRes.json();
	const pulls: { total_count: number } = await pullsRes.json();

	return computeMetrics(releases, repo, pulls.total_count);
}
