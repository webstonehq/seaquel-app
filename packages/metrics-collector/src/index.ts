import { fetchFromGitHub } from './github';
import type { HistoricalEntry } from './types';

export default {
	async fetch(): Promise<Response> {
		return new Response(
			'seaquel-metrics-collector is running. Data is collected daily via cron trigger.',
			{ headers: { 'Content-Type': 'text/plain' } },
		);
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		const data = await fetchFromGitHub(env);

		const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

		const releaseTotals: Record<string, number> = {};
		for (const release of data.releaseBreakdowns) {
			releaseTotals[release.tag] = release.total;
		}

		const historicalEntry: HistoricalEntry = {
			date: today,
			totalDownloads: data.metrics.totalDownloads,
			updaterDownloads: data.metrics.updaterDownloads,
			updaterChecks: data.metrics.updaterChecks,
			stars: data.metrics.stars,
			forks: data.metrics.forks,
			openIssues: data.metrics.openIssues,
			openPullRequests: data.metrics.openPullRequests,
			platformDownloads: data.metrics.platformDownloads,
			totalReleases: data.metrics.totalReleases,
			avgDaysBetweenReleases: data.metrics.avgDaysBetweenReleases,
			releaseTotals,
		};

		// Write all KV entries concurrently where possible
		const writeCurrentSnapshot = env.GITHUB_API_CACHE.put(
			'metrics:github',
			JSON.stringify(data),
			{ metadata: { cachedAt: Date.now() } },
		);

		const writeDailySnapshot = env.GITHUB_API_CACHE.put(
			`metrics:history:${today}`,
			JSON.stringify(historicalEntry),
		);

		await Promise.all([writeCurrentSnapshot, writeDailySnapshot]);

		// Read-modify-write the index
		const existingIndex = await env.GITHUB_API_CACHE.get('metrics:history:index', 'text');
		const index: string[] = existingIndex ? JSON.parse(existingIndex) : [];

		if (!index.includes(today)) {
			index.push(today);
			index.sort();
			await env.GITHUB_API_CACHE.put('metrics:history:index', JSON.stringify(index));
		}

		console.log(`[metrics] Snapshot written for ${today} (cron: ${controller.cron})`);
	},
} satisfies ExportedHandler<Env>;
