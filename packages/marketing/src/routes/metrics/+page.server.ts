import type { PageServerLoad } from './$types';

interface GitHubAsset {
	name: string;
	download_count: number;
}

interface GitHubRelease {
	tag_name: string;
	published_at: string;
	assets: GitHubAsset[];
}

interface GitHubRepo {
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
}

export interface ReleaseDownloads {
	tag: string;
	publishedAt: string;
	total: number;
	macOS: number;
	windows: number;
	linux: number;
}

export interface PlatformDownloads {
	macOS: number;
	windows: number;
	linux: number;
}

export interface OpenMetrics {
	totalDownloads: number;
	thirtyDayDownloads: number;
	stars: number;
	forks: number;
	openIssues: number;
	platformDownloads: PlatformDownloads;
	totalReleases: number;
	latestRelease: string;
	avgDaysBetweenReleases: number;
}

function isRealDownload(name: string): boolean {
	return !name.endsWith('latest.json');
}

function getPlatform(name: string): keyof PlatformDownloads | null {
	if (name.endsWith('.dmg') || name.includes('.app.tar.gz')) return 'macOS';
	if (name.endsWith('.exe') || name.endsWith('.msi')) return 'windows';
	if (name.endsWith('.AppImage') || name.endsWith('.deb')) return 'linux';
	return null;
}

export const load: PageServerLoad = async () => {
	try {
		const [releasesRes, repoRes] = await Promise.all([
			fetch('https://api.github.com/repos/WebstoneHQ/seaquel/releases', {
				headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'seaquel-app' },
			}),
			fetch('https://api.github.com/repos/WebstoneHQ/seaquel', {
				headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'seaquel-app' },
			}),
		]);

		if (!releasesRes.ok || !repoRes.ok) {
			const failedRes = !releasesRes.ok ? releasesRes : repoRes;
			const body = await failedRes.text().catch(() => '(unreadable)');
			const remaining = failedRes.headers.get('X-RateLimit-Remaining');
			const resetEpoch = failedRes.headers.get('X-RateLimit-Reset');
			const resetIn = resetEpoch
				? `${Math.ceil((Number(resetEpoch) * 1000 - Date.now()) / 60000)}min`
				: 'unknown';

			console.error(
				'[metrics] GitHub API returned non-OK status:',
				`releases=${releasesRes.status} ${releasesRes.statusText},`,
				`repo=${repoRes.status} ${repoRes.statusText},`,
				`rateLimit remaining=${remaining}, resets in ${resetIn},`,
				`body=${body}`,
			);
			return { metrics: null, releaseBreakdowns: [], error: 'Unable to fetch data from GitHub.' };
		}

		const releases: GitHubRelease[] = await releasesRes.json();
		const repo: GitHubRepo = await repoRes.json();

		const now = Date.now();
		const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

		let totalDownloads = 0;
		let thirtyDayDownloads = 0;
		const platformDownloads: PlatformDownloads = { macOS: 0, windows: 0, linux: 0 };
		const releaseBreakdowns: ReleaseDownloads[] = [];

		for (const release of releases) {
			const publishedAt = new Date(release.published_at).getTime();
			const isRecent = publishedAt >= thirtyDaysAgo;

			const perRelease: ReleaseDownloads = {
				tag: release.tag_name,
				publishedAt: release.published_at,
				total: 0,
				macOS: 0,
				windows: 0,
				linux: 0,
			};

			for (const asset of release.assets) {
				if (!isRealDownload(asset.name)) continue;

				totalDownloads += asset.download_count;
				perRelease.total += asset.download_count;

				if (isRecent) {
					thirtyDayDownloads += asset.download_count;
				}

				const platform = getPlatform(asset.name);
				if (platform) {
					platformDownloads[platform] += asset.download_count;
					perRelease[platform] += asset.download_count;
				}
			}

			releaseBreakdowns.push(perRelease);
		}

		// Sort chronologically (oldest first) for left-to-right chart reading
		releaseBreakdowns.sort(
			(a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
		);

		// Compute release cadence
		const sortedDates = releases
			.map((r) => new Date(r.published_at).getTime())
			.sort((a, b) => b - a);

		let avgDaysBetweenReleases = 0;
		if (sortedDates.length > 1) {
			let totalDelta = 0;
			for (let i = 0; i < sortedDates.length - 1; i++) {
				totalDelta += sortedDates[i] - sortedDates[i + 1];
			}
			avgDaysBetweenReleases = Math.round(totalDelta / (sortedDates.length - 1) / (1000 * 60 * 60 * 24));
		}

		const metrics: OpenMetrics = {
			totalDownloads,
			thirtyDayDownloads,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			openIssues: repo.open_issues_count,
			platformDownloads,
			totalReleases: releases.length,
			latestRelease: releases.length > 0 ? releases[0].published_at : '',
			avgDaysBetweenReleases,
		};

		return { metrics, releaseBreakdowns, error: null };
	} catch (e) {
		console.error('[open] Failed to fetch GitHub data:', e);
		return { metrics: null, releaseBreakdowns: [], error: 'Unable to load metrics. Please try again later.' };
	}
};
