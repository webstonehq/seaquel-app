// Mirrors packages/metrics-collector/src/types.ts — the collector writes these
// shapes into KV and this app reads them back.

export interface PlatformDownloads {
	macOS: number;
	windows: number;
	linux: number;
}

export interface OpenMetrics {
	/** Installer downloads only — updater bundles are tracked separately. */
	totalDownloads: number;
	/** macOS auto-updater bundles: existing users updating, not new installs. */
	updaterDownloads: number;
	/** latest.json hits — every running install polls this, so it is a rough floor for active installs. */
	updaterChecks: number;
	stars: number;
	forks: number;
	/** Issues only. GitHub's own open_issues_count lumps in open PRs. */
	openIssues: number;
	openPullRequests: number;
	platformDownloads: PlatformDownloads;
	totalReleases: number;
	latestRelease: string;
	latestReleaseTag: string;
	avgDaysBetweenReleases: number;
}

export interface ReleaseDownloads {
	tag: string;
	publishedAt: string;
	total: number;
	macOS: number;
	windows: number;
	linux: number;
	updater: number;
}

export interface HistoricalEntry {
	date: string;
	totalDownloads: number;
	updaterDownloads: number;
	updaterChecks: number;
	stars: number;
	forks: number;
	openIssues: number;
	openPullRequests: number;
	platformDownloads: PlatformDownloads;
	totalReleases: number;
	avgDaysBetweenReleases: number;
	/** Cumulative installer downloads per release tag. Absent on snapshots written before this was collected. */
	releaseTotals?: Record<string, number>;
}
