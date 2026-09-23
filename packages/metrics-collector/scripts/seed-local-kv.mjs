// Seeds the LOCAL miniflare KV (binding GITHUB_API_CACHE) that the marketing
// dev server reads from for the /metrics page.
//
// The marketing app reads KV from `packages/metrics-collector/.wrangler/state/v3`
// (see marketing svelte.config.js -> platformProxy.persist), which is exactly
// where `wrangler ... --local` persists when run from this package. So running
// this script and then `pnpm dev` in marketing shows the seeded data.
//
// Usage (from packages/metrics-collector):
//   pnpm seed:local            # ~365 daily points ending today
//   DAYS=730 pnpm seed:local   # override the window
//
// The series is deterministic (seeded PRNG) so reruns reproduce the same data,
// which makes "what breaks at N points" investigations repeatable.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DAYS = Math.max(2, Number(process.env.DAYS) || 365);

// --- deterministic PRNG (mulberry32) -------------------------------------
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const rng = mulberry32(0xc0ffee);
const rand = (min, max) => min + rng() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// --- date helpers (UTC, no TZ drift) -------------------------------------
const MS_DAY = 86400000;
const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
const isoDate = (d) => d.toISOString().slice(0, 10);
const dates = Array.from(
	{ length: DAYS },
	(_, i) => new Date(today.getTime() - (DAYS - 1 - i) * MS_DAY),
);

// --- releases (calver tags, ~every 22-28 days) ---------------------------
const releases = [];
{
	let cursor = dates[0].getTime() + randInt(0, 10) * MS_DAY;
	const end = today.getTime();
	const patchByMonth = new Map();
	while (cursor <= end) {
		const d = new Date(cursor);
		const y = d.getUTCFullYear();
		const m = d.getUTCMonth() + 1;
		const k = `${y}.${m}`;
		const patch = patchByMonth.get(k) ?? 0;
		patchByMonth.set(k, patch + 1);
		releases.push({
			tag: `v${y}.${m}.${patch}`,
			publishedAt:
				new Date(cursor + randInt(8, 20) * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
		});
		cursor += randInt(22, 28) * MS_DAY;
	}
}
const releaseTimes = releases.map((r) => new Date(r.publishedAt).getTime());

// --- daily series --------------------------------------------------------
const PLATFORM_RATIO = { macOS: 0.5, linux: 0.32, windows: 0.18 };
// Share of a day's downloads that lands on the newest release; the rest trickles
// onto older tags the way stale links and pinned versions do.
const LATEST_RELEASE_SHARE = 0.85;
const history = [];

let cumDownloads = 0;
let cumUpdaterChecks = 0;
let cumStars = 1;
let cumForks = 0;
let openIssues = 3;
let openPullRequests = 1;
const releaseTotals = new Map();

for (let i = 0; i < DAYS; i++) {
	const d = dates[i];
	const t = DAYS > 1 ? i / (DAYS - 1) : 1; // 0..1 across the window
	const dayMs = d.getTime();

	// downloads: growing baseline + post-release spike + noise (monotonic)
	const baseDaily = 2 + 33 * t;
	const releasedRecently = releaseTimes.some(
		(rt) => dayMs >= rt && dayMs - rt <= 4 * MS_DAY,
	);
	const spike = releasedRecently ? randInt(20, 70) : 0;
	const newDownloads = Math.round(baseDaily + spike + rand(0, baseDaily * 0.6));
	cumDownloads += newDownloads;

	// updater checks: every install already out there polls, most days
	cumUpdaterChecks += Math.round(cumDownloads * rand(0.25, 0.4));

	// attribute the day's downloads across the releases published so far
	const publishedTags = releases.filter((_, idx) => releaseTimes[idx] <= dayMs).map((r) => r.tag);
	if (publishedTags.length > 0) {
		const newest = publishedTags[publishedTags.length - 1];
		const older = publishedTags.slice(0, -1);
		let spread = 0;
		for (const tag of older) {
			const share = Math.round(((1 - LATEST_RELEASE_SHARE) * newDownloads) / older.length);
			spread += share;
			releaseTotals.set(tag, (releaseTotals.get(tag) ?? 0) + share);
		}
		releaseTotals.set(newest, (releaseTotals.get(newest) ?? 0) + (newDownloads - spread));
	}

	// stars / forks: slow monotonic growth
	if (rng() < 0.35 + 0.4 * t) cumStars += randInt(1, 2 + Math.round(3 * t));
	if (rng() < 0.08 + 0.12 * t) cumForks += 1;

	// open issues: bounded random walk, slight upward drift
	openIssues = Math.max(
		0,
		Math.min(30, openIssues + randInt(-2, 2) + (rng() < 0.15 ? 1 : 0)),
	);
	openPullRequests = Math.max(0, Math.min(6, openPullRequests + randInt(-1, 1)));

	// platform split that sums exactly to cumDownloads
	const macOS = Math.round(cumDownloads * PLATFORM_RATIO.macOS);
	const windows = Math.round(cumDownloads * PLATFORM_RATIO.windows);
	const linux = cumDownloads - macOS - windows;

	const releasesSoFar = releaseTimes.filter((rt) => rt <= dayMs).length;
	let avgGap = 0;
	if (releasesSoFar >= 2) {
		const span =
			releaseTimes[releasesSoFar - 1] - releaseTimes[0];
		avgGap = Math.round(span / (releasesSoFar - 1) / MS_DAY);
	}

	history.push({
		date: isoDate(d),
		totalDownloads: cumDownloads,
		updaterDownloads: Math.round(cumDownloads * 0.06),
		updaterChecks: cumUpdaterChecks,
		stars: cumStars,
		forks: cumForks,
		openIssues,
		openPullRequests,
		platformDownloads: { macOS, windows, linux },
		totalReleases: releasesSoFar,
		avgDaysBetweenReleases: avgGap,
		releaseTotals: Object.fromEntries(releaseTotals),
	});
}

// --- per-release breakdown (from the per-day attribution above) -----------
const releaseBreakdowns = releases.map((r) => {
	const total = releaseTotals.get(r.tag) ?? 0;
	const macOS = Math.round(total * PLATFORM_RATIO.macOS);
	const windows = Math.round(total * PLATFORM_RATIO.windows);
	const linux = total - macOS - windows;
	return {
		tag: r.tag,
		publishedAt: r.publishedAt,
		total,
		macOS,
		windows,
		linux,
		updater: Math.round(total * 0.06),
	};
});

// --- snapshot ------------------------------------------------------------
const last = history[history.length - 1];
const snapshot = {
	metrics: {
		totalDownloads: last.totalDownloads,
		updaterDownloads: last.updaterDownloads,
		updaterChecks: last.updaterChecks,
		stars: last.stars,
		forks: last.forks,
		openIssues: last.openIssues,
		openPullRequests: last.openPullRequests,
		platformDownloads: last.platformDownloads,
		totalReleases: releases.length,
		latestRelease: releases[releases.length - 1].publishedAt,
		latestReleaseTag: releases[releases.length - 1].tag,
		avgDaysBetweenReleases: last.avgDaysBetweenReleases,
	},
	releaseBreakdowns,
};

// --- write to local KV via one bulk put ----------------------------------
const entries = [
	{
		key: 'metrics:github',
		value: JSON.stringify(snapshot),
		metadata: { cachedAt: Date.now() },
	},
	{ key: 'metrics:history:index', value: JSON.stringify(history.map((h) => h.date)) },
	...history.map((h) => ({
		key: `metrics:history:${h.date}`,
		value: JSON.stringify(h),
	})),
];

const dir = mkdtempSync(join(tmpdir(), 'seaquel-kv-'));
const file = join(dir, 'bulk.json');
writeFileSync(file, JSON.stringify(entries));

console.log(
	`Seeding ${history.length} daily points (${history[0].date} -> ${last.date}), ` +
		`${releases.length} releases, ${entries.length} KV keys...`,
);

try {
	execFileSync(
		'npx',
		['wrangler', 'kv', 'bulk', 'put', file, '--binding', 'GITHUB_API_CACHE', '--local'],
		{ stdio: 'inherit', cwd: join(import.meta.dirname, '..') },
	);
} finally {
	rmSync(dir, { recursive: true, force: true });
}

console.log(
	`\nDone. Final snapshot: ${last.totalDownloads.toLocaleString()} downloads, ` +
		`${last.stars} stars, ${last.forks} forks, ${last.openIssues} open issues, ` +
		`${releases.length} releases.\n` +
		`Run \`pnpm dev\` in packages/marketing and open /metrics.`,
);
