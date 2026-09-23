import type { PageServerLoad } from './$types';
import type { HistoricalEntry, OpenMetrics, ReleaseDownloads } from '$lib/metrics/types';

interface CachedData {
	metrics: OpenMetrics;
	releaseBreakdowns: ReleaseDownloads[];
}

const CACHE_KEY = 'metrics:github';

export const load: PageServerLoad = async ({ platform }) => {
	const kv = platform?.env?.GITHUB_API_CACHE;

	const empty = {
		metrics: null,
		releaseBreakdowns: [] as ReleaseDownloads[],
		history: [] as HistoricalEntry[],
		collectedAt: null as string | null,
	};

	if (!kv) {
		return { ...empty, error: 'Metrics are unavailable (KV not configured).' };
	}

	try {
		// Read current snapshot
		const { value: snapshotRaw, metadata } = await kv.getWithMetadata<{ cachedAt: number }>(
			CACHE_KEY,
			'text',
		);
		if (!snapshotRaw) {
			return { ...empty, error: 'No metrics data available yet. The collector has not run.' };
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
			collectedAt: metadata?.cachedAt ? new Date(metadata.cachedAt).toISOString() : null,
			error: null,
		};
	} catch (e) {
		console.error('[metrics] Failed to read from KV:', e);
		return { ...empty, error: 'Unable to load metrics. Please try again later.' };
	}
};
