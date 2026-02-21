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

const CACHE_KEY = 'metrics:github';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function isRealDownload(name: string): boolean {
	return !name.endsWith('latest.json');
}

function getPlatform(name: string): keyof PlatformDownloads | null {
	if (name.endsWith('.dmg') || name.includes('.app.tar.gz')) return 'macOS';
	if (name.endsWith('.exe') || name.endsWith('.msi')) return 'windows';
	if (name.endsWith('.AppImage') || name.endsWith('.deb')) return 'linux';
	return null;
}

interface CachedData {
	metrics: OpenMetrics;
	releaseBreakdowns: ReleaseDownloads[];
}

function computeMetrics(
	releases: GitHubRelease[],
	repo: GitHubRepo,
): CachedData {
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

	releaseBreakdowns.sort(
		(a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
	);

	const sortedDates = releases
		.map((r) => new Date(r.published_at).getTime())
		.sort((a, b) => b - a);

	let avgDaysBetweenReleases = 0;
	if (sortedDates.length > 1) {
		let totalDelta = 0;
		for (let i = 0; i < sortedDates.length - 1; i++) {
			totalDelta += sortedDates[i] - sortedDates[i + 1];
		}
		avgDaysBetweenReleases = Math.round(
			totalDelta / (sortedDates.length - 1) / (1000 * 60 * 60 * 24),
		);
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

	return { metrics, releaseBreakdowns };
}

async function fetchFromGitHub(): Promise<CachedData> {
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
		throw new Error('GitHub API request failed');
	}

	const releases: GitHubRelease[] = await releasesRes.json();
	const repo: GitHubRepo = await repoRes.json();

	return computeMetrics(releases, repo);
}

export const load: PageServerLoad = async ({ platform }) => {
	const kv = platform?.env?.GITHUB_API_CACHE;

	try {
		// Try reading from KV cache
		if (kv) {
			const { value, metadata } = await kv.getWithMetadata<{ cachedAt: number }>(
				CACHE_KEY,
				'text',
			);

			if (value && metadata) {
				const age = Date.now() - metadata.cachedAt;
				if (age < CACHE_TTL_MS) {
					const cached: CachedData = JSON.parse(value);
					return { metrics: cached.metrics, releaseBreakdowns: cached.releaseBreakdowns, error: null };
				}
			}
		}

		// Cache miss or expired — fetch fresh data
		const data = await fetchFromGitHub();

		// Store in KV (fire-and-forget)
		if (kv) {
			kv.put(CACHE_KEY, JSON.stringify(data), {
				metadata: { cachedAt: Date.now() },
			}).catch((err: unknown) => {
				console.error('[metrics] Failed to write KV cache:', err);
			});
		}

		return { metrics: data.metrics, releaseBreakdowns: data.releaseBreakdowns, error: null };
	} catch (e) {
		// On failure, try serving stale cache
		if (kv) {
			try {
				const stale = await kv.get(CACHE_KEY, 'text');
				if (stale) {
					const cached: CachedData = JSON.parse(stale);
					console.warn('[metrics] Serving stale cache after GitHub API failure');
					return { metrics: cached.metrics, releaseBreakdowns: cached.releaseBreakdowns, error: null };
				}
			} catch {
				// KV also failed, fall through
			}
		}

		console.error('[metrics] Failed to fetch GitHub data:', e);
		return {
			metrics: null,
			releaseBreakdowns: [],
			error: 'Unable to load metrics. Please try again later.',
		};
	}
};
