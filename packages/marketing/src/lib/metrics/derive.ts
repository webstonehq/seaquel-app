import type { HistoricalEntry, PlatformDownloads } from './types';

const MS_DAY = 86400000;

/**
 * GitHub only exposes lifetime counters, so every rate here is a diff between
 * two daily snapshots rather than something the API reports directly.
 */

function baselineFor(history: HistoricalEntry[], days: number): HistoricalEntry | null {
	if (history.length < 2) return null;

	const latest = history[history.length - 1];
	const cutoff = new Date(new Date(latest.date).getTime() - days * MS_DAY)
		.toISOString()
		.slice(0, 10);

	let baseline = history[0];
	for (const entry of history) {
		if (entry === latest) break;
		if (entry.date <= cutoff) baseline = entry;
		else break;
	}

	return baseline;
}

export interface WindowedDownloads {
	downloads: number;
	/** The snapshot the diff runs from — null when there is nothing to diff against. */
	since: string | null;
	/** False when collection started less than `days` ago, so the label can say so. */
	spansFullWindow: boolean;
}

export function downloadsInWindow(history: HistoricalEntry[], days: number): WindowedDownloads {
	const baseline = baselineFor(history, days);
	if (!baseline) return { downloads: 0, since: null, spansFullWindow: false };

	const latest = history[history.length - 1];
	const elapsed = (new Date(latest.date).getTime() - new Date(baseline.date).getTime()) / MS_DAY;

	return {
		downloads: Math.max(0, latest.totalDownloads - baseline.totalDownloads),
		since: baseline.date,
		spansFullWindow: elapsed >= days,
	};
}

export interface DailyDownloads extends PlatformDownloads {
	date: Date;
}

/**
 * New downloads per day. A cumulative chart only ever goes up and to the right;
 * the deltas are what show a launch spike or a decline.
 */
export function dailyDownloads(history: HistoricalEntry[]): DailyDownloads[] {
	const days: DailyDownloads[] = [];

	for (let i = 1; i < history.length; i++) {
		const previous = history[i - 1].platformDownloads;
		const current = history[i].platformDownloads;

		days.push({
			date: new Date(history[i].date),
			// A release deleted from GitHub takes its counts with it; a negative
			// day is bookkeeping, not a real loss of downloads.
			macOS: Math.max(0, current.macOS - previous.macOS),
			windows: Math.max(0, current.windows - previous.windows),
			linux: Math.max(0, current.linux - previous.linux),
		});
	}

	return days;
}

export interface LatestReleaseAdoption {
	share: number;
	onLatest: number;
	total: number;
	since: string;
}

/**
 * What share of recent downloads went to the current release — the closest
 * thing to an adoption signal available without product telemetry.
 */
export function latestReleaseAdoption(
	history: HistoricalEntry[],
	latestTag: string,
	days: number,
): LatestReleaseAdoption | null {
	const baseline = baselineFor(history, days);
	if (!baseline || !latestTag) return null;

	const latest = history[history.length - 1];
	if (!latest.releaseTotals || !baseline.releaseTotals) return null;

	let total = 0;
	for (const [tag, count] of Object.entries(latest.releaseTotals)) {
		total += Math.max(0, count - (baseline.releaseTotals[tag] ?? 0));
	}
	if (total === 0) return null;

	const onLatest = Math.max(
		0,
		(latest.releaseTotals[latestTag] ?? 0) - (baseline.releaseTotals[latestTag] ?? 0),
	);

	return { share: onLatest / total, onLatest, total, since: baseline.date };
}
