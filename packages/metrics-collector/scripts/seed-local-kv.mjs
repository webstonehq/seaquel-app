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
const history = [];

let cumDownloads = 0;
let cumStars = 1;
let cumForks = 0;
let openIssues = 3;

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
	cumDownloads += Math.round(baseDaily + spike + rand(0, baseDaily * 0.6));

	// stars / forks: slow monotonic growth
	if (rng() < 0.35 + 0.4 * t) cumStars += randInt(1, 2 + Math.round(3 * t));
	if (rng() < 0.08 + 0.12 * t) cumForks += 1;

	// open issues: bounded random walk, slight upward drift
	openIssues = Math.max(
		0,
		Math.min(30, openIssues + randInt(-2, 2) + (rng() < 0.15 ? 1 : 0)),
	);

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
		thirtyDayDownloads: 0, // filled in below
		stars: cumStars,
		forks: cumForks,
		openIssues,
		platformDownloads: { macOS, windows, linux },
		totalReleases: releasesSoFar,
		avgDaysBetweenReleases: avgGap,
	});
}

// thirtyDayDownloads = total(today) - total(~30 days earlier)
for (let i = 0; i < history.length; i++) {
	const base = history[Math.max(0, i - 30)];
	history[i].thirtyDayDownloads = history[i].totalDownloads - base.totalDownloads;
}

// --- per-release breakdown (older releases have accumulated more) ---------
const finalTotal = history[history.length - 1].totalDownloads;
const weights = releases.map((_, idx) => {
	const ageDays = (today.getTime() - releaseTimes[idx]) / MS_DAY;
	return Math.max(1, ageDays) * rand(0.7, 1.3);
});
const weightSum = weights.reduce((a, b) => a + b, 0);
let allocated = 0;
const releaseBreakdowns = releases.map((r, idx) => {
	const isLast = idx === releases.length - 1;
	const total = isLast
		? finalTotal - allocated
		: Math.round((weights[idx] / weightSum) * finalTotal);
	allocated += total;
	const macOS = Math.round(total * PLATFORM_RATIO.macOS);
	const windows = Math.round(total * PLATFORM_RATIO.windows);
	const linux = total - macOS - windows;
	return { tag: r.tag, publishedAt: r.publishedAt, total, macOS, windows, linux };
});

// --- snapshot ------------------------------------------------------------
const last = history[history.length - 1];
const snapshot = {
	metrics: {
		totalDownloads: last.totalDownloads,
		thirtyDayDownloads: last.thirtyDayDownloads,
		stars: last.stars,
		forks: last.forks,
		openIssues: last.openIssues,
		platformDownloads: last.platformDownloads,
		totalReleases: releases.length,
		latestRelease: releases[releases.length - 1].publishedAt,
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
