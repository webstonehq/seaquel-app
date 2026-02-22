import type { PageServerLoad } from './$types';

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

export interface ReleaseDownloads {
	tag: string;
	publishedAt: string;
	total: number;
	macOS: number;
	windows: number;
	linux: number;
}

export interface HistoricalEntry {
	date: string;
	totalDownloads: number;
	thirtyDayDownloads: number;
	stars: number;
	forks: number;
	openIssues: number;
	platformDownloads: PlatformDownloads;
	totalReleases: number;
	avgDaysBetweenReleases: number;
}

interface CachedData {
	metrics: OpenMetrics;
	releaseBreakdowns: ReleaseDownloads[];
}

const CACHE_KEY = 'metrics:github';

export const load: PageServerLoad = async ({ platform }) => {
	const kv = platform?.env?.GITHUB_API_CACHE;

	if (!kv) {
		return {
			metrics: null,
			releaseBreakdowns: [],
			history: [] as HistoricalEntry[],
			error: 'Metrics are unavailable (KV not configured).',
		};
	}

	try {
		// Read current snapshot
		const snapshotRaw = await kv.get(CACHE_KEY, 'text');
		if (!snapshotRaw) {
			return {
				metrics: null,
				releaseBreakdowns: [],
				history: [] as HistoricalEntry[],
				error: 'No metrics data available yet. The collector has not run.',
			};
		}

		const snapshot: CachedData = JSON.parse(snapshotRaw);

		// Read history index
		const indexRaw = await kv.get('metrics:history:index', 'text');
		const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];

		// Fetch all historical entries
		const historyEntries = await Promise.all(
			index.map(async (date) => {
				const raw = await kv.get(`metrics:history:${date}`, 'text');
				if (!raw) return null;
				return JSON.parse(raw) as HistoricalEntry;
			}),
		);

		const history = historyEntries.filter((entry): entry is HistoricalEntry => entry !== null);

		return {
			metrics: snapshot.metrics,
			releaseBreakdowns: snapshot.releaseBreakdowns,
			history,
			error: null,
		};
	} catch (e) {
		console.error('[metrics] Failed to read from KV:', e);
		return {
			metrics: null,
			releaseBreakdowns: [],
			history: [] as HistoricalEntry[],
			error: 'Unable to load metrics. Please try again later.',
		};
	}
};
