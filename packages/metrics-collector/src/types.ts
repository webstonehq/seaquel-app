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

export interface CachedData {
	metrics: OpenMetrics;
	releaseBreakdowns: ReleaseDownloads[];
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
