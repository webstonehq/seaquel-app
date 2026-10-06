/**
 * Resolves a download platform id (e.g. `macos-arm`) to the matching
 * asset in the latest published GitHub release of a channel. Shared by
 * the `/download/[platform]` and `/download/beta/[platform]` file
 * redirects and their post-download pages.
 *
 * Also serves the desktop updater's feeds (`/updates/check/...` and
 * `/updates/check/beta/...`): `latestJsonFor` answers with the
 * `latest.json` of the release a channel updates to.
 */

import { json } from "@sveltejs/kit";

const GITHUB_RELEASES_URL = "https://api.github.com/repos/webstonehq/seaquel/releases";

export const RELEASES_PAGE_URL = "https://github.com/webstonehq/seaquel/releases";

// Asset name patterns for each platform (standard Tauri naming)
const ASSET_PATTERNS: Record<string, RegExp> = {
	// macOS
	"macos": /\.dmg$/i,            // Default macOS (will prefer aarch64)
	"macos-arm": /aarch64.*\.dmg$/i, // Apple Silicon
	"macos-intel": /x64.*\.dmg$/i,   // Intel Mac

	// Windows
	"windows": /\.(exe|msi)$/i,      // Windows installer (generic)
	"windows-msi": /x64.*\.msi$/i,   // MSI installer
	"windows-nsis": /x64.*setup\.exe$/i, // NSIS installer

	// Linux
	"linux": /\.(AppImage|deb)$/i,   // Linux (generic)
	"linux-deb": /amd64\.deb$/i,     // Debian/Ubuntu
	"linux-rpm": /x86_64\.rpm$/i,    // Fedora/RHEL
	"linux-appimage": /amd64\.AppImage$/i, // AppImage
};

export function isKnownPlatform(platform: string): boolean {
	return Object.hasOwn(ASSET_PATTERNS, platform);
}

export interface ReleaseAsset {
	name: string;
	url: string;
	/** Bytes. */
	size: number;
	/** Release tag without the leading `v`, e.g. `2026.4.8`. */
	version: string;
	/** Whether the release is a pre-release (flagged on GitHub or by tag). */
	prerelease: boolean;
}

export interface GitHubAsset {
	name: string;
	browser_download_url: string;
	size: number;
}

export interface GitHubRelease {
	tag_name: string;
	draft: boolean;
	prerelease: boolean;
	assets: GitHubAsset[];
}

export interface LatestRelease {
	/** Release tag without the leading `v`, e.g. `2026.10.0-beta.3`. */
	version: string;
	/**
	 * Whether it's a pre-release (flagged on GitHub or by tag). The beta
	 * channel falls back to the newest stable when no beta is newer.
	 */
	prerelease: boolean;
}

/** `GET /releases`, or `null` when GitHub is unreachable. Never throws. */
async function fetchReleases(token: string | undefined): Promise<GitHubRelease[] | null> {
	try {
		const headers: Record<string, string> = {
			"User-Agent": "seaquel-website",
			"Accept": "application/vnd.github.v3+json",
		};
		// The repo is public, so the API works without auth (at a lower rate
		// limit). Only send the token when it's configured — a
		// `Bearer undefined` header makes GitHub reject the request with 401.
		if (token) headers["Authorization"] = `Bearer ${token}`;

		// 100 per page (GitHub's default is 30) so a long run of betas can't
		// push the newest stable off the first page.
		const response = await fetch(`${GITHUB_RELEASES_URL}?per_page=100`, { headers });
		if (!response.ok) {
			console.error("Failed to fetch releases:", response.status);
			return null;
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching releases:", error);
		return null;
	}
}

/** The newest release on `channel` by version (see `onChannel`). */
function newestOnChannel(releases: GitHubRelease[], channel: Channel): GitHubRelease | null {
	return newestByVersion(releases.filter((release) => onChannel(release, channel)));
}

function isPrerelease(release: GitHubRelease): boolean {
	return release.prerelease || VERSION.exec(release.tag_name)?.[4] !== undefined;
}

/**
 * The release `channel` downloads, or `null` when GitHub is unreachable or
 * nothing is on the channel. Never throws.
 */
export async function findLatestRelease(
	channel: Channel,
	token: string | undefined,
): Promise<LatestRelease | null> {
	const releases = await fetchReleases(token);
	const release = releases && newestOnChannel(releases, channel);
	if (!release) return null;
	return { version: release.tag_name.replace(/^v/, ""), prerelease: isPrerelease(release) };
}

/**
 * The asset for `platform` in the release `channel` downloads (stable by
 * default), or `null` when the platform is unknown, GitHub is unreachable,
 * or the release has no matching file. Never throws — callers fall back to
 * the releases page.
 */
export async function findLatestAsset(
	platform: string,
	token: string | undefined,
	channel: Channel = "stable",
): Promise<ReleaseAsset | null> {
	if (!isKnownPlatform(platform)) return null;

	const releases = await fetchReleases(token);
	const latestRelease = releases && newestOnChannel(releases, channel);
	if (!latestRelease?.assets?.length) return null;

	// Find matching asset for the requested platform
	const pattern = ASSET_PATTERNS[platform];
	let asset = latestRelease.assets.find((a) => pattern.test(a.name));

	// For generic "macos", prefer Apple Silicon (aarch64) if available
	if (platform === "macos" && !asset) {
		asset = latestRelease.assets.find((a) => /aarch64\.dmg$/i.test(a.name));
	}
	if (platform === "macos" && !asset) {
		asset = latestRelease.assets.find((a) => /\.dmg$/i.test(a.name));
	}
	if (!asset) return null;

	return {
		name: asset.name,
		url: asset.browser_download_url,
		size: asset.size,
		version: latestRelease.tag_name.replace(/^v/, ""),
		prerelease: isPrerelease(latestRelease),
	};
}

export type Channel = "stable" | "beta";

const VERSION = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

function compareIdentifiers(a: string, b: string): number {
	const an = /^\d+$/.test(a);
	const bn = /^\d+$/.test(b);
	if (an && bn) return Number(a) - Number(b);
	// Numeric identifiers have lower precedence than alphanumeric ones.
	if (an) return -1;
	if (bn) return 1;
	return a < b ? -1 : a > b ? 1 : 0;
}

/** Semver order for `YYYY.M.P[-pre]` tags; NaN when either can't be read. */
export function compareVersions(a: string, b: string): number {
	const ma = VERSION.exec(a);
	const mb = VERSION.exec(b);
	if (!ma || !mb) return NaN;

	for (let i = 1; i <= 3; i++) {
		const d = Number(ma[i]) - Number(mb[i]);
		if (d !== 0) return d;
	}

	const pa = ma[4];
	const pb = mb[4];
	// A version without a pre-release ranks above the same one with one.
	if (pa === undefined || pb === undefined) {
		if (pa === pb) return 0;
		return pa === undefined ? 1 : -1;
	}

	const ia = pa.split(".");
	const ib = pb.split(".");
	for (let i = 0; i < Math.min(ia.length, ib.length); i++) {
		const d = compareIdentifiers(ia[i], ib[i]);
		if (d !== 0) return d;
	}
	return ia.length - ib.length;
}

/**
 * Whether `release` belongs on `channel`: published (not a draft) with a tag
 * we can read. Stable also skips anything GitHub flags as a pre-release and
 * any tag with a pre-release part (`-beta.N`), even when the "pre-release"
 * box wasn't ticked, so a beta can't reach stable users or the download page.
 */
function onChannel(release: GitHubRelease, channel: Channel): boolean {
	if (release.draft) return false;
	const version = VERSION.exec(release.tag_name);
	if (!version) return false;
	if (channel === "stable" && (release.prerelease || version[4] !== undefined)) return false;
	return true;
}

/** The newest of `releases` by tag version; tags must already be readable. */
function newestByVersion<R extends GitHubRelease>(releases: R[]): R | null {
	let best: R | null = null;
	for (const release of releases) {
		if (!best || compareVersions(release.tag_name, best.tag_name) > 0) best = release;
	}
	return best;
}

/**
 * The release `channel` updates to: on the channel (see `onChannel`), with
 * `latest.json`, newest by version.
 */
export function pickRelease<R extends GitHubRelease>(releases: R[], channel: Channel): R | null {
	return newestByVersion(
		releases.filter(
			(release) =>
				onChannel(release, channel) &&
				release.assets?.some((asset) => asset.name === "latest.json"),
		),
	);
}

const FEED_CACHE: Record<Channel, { key: string; ttlSeconds: number }> = {
	stable: { key: "updates:latest-json", ttlSeconds: 60 * 60 },
	beta: { key: "updates:latest-json:beta", ttlSeconds: 10 * 60 },
};

/**
 * The updater's answer for `channel`: the chosen release's `latest.json`,
 * or 204 (no update) when anything goes wrong. Never throws.
 */
export async function latestJsonFor(
	channel: Channel,
	platform: App.Platform | undefined,
): Promise<Response> {
	const { key, ttlSeconds } = FEED_CACHE[channel];
	const kv = platform?.env?.GITHUB_API_CACHE;

	// Try serving from cache
	if (kv) {
		try {
			const cached = await kv.get(key, "text");
			if (cached) {
				console.log(`Serving ${channel} update check from cache`);
				return json(JSON.parse(cached));
			}
		} catch (e) {
			console.error(`Failed to read ${channel} update check from cache:`, e);
		}
	}

	try {
		const headers: Record<string, string> = {
			"User-Agent": "seaquel-app-updates-checker",
			"Accept": "application/vnd.github.v3+json",
		};

		if (platform?.env?.GITHUB_TOKEN) {
			console.log("GITHUB_TOKEN present, sending an authenticated request to GitHub");
			headers["Authorization"] = `Bearer ${platform.env.GITHUB_TOKEN}`;
		}

		// GitHub returns 30 releases per page by default; ask for the most it
		// allows so a long run of betas can't push the newest stable off it.
		const releaseResponse = await fetch(`${GITHUB_RELEASES_URL}?per_page=100`, { headers });

		if (!releaseResponse.ok) {
			console.error("Failed to fetch releases: ", await releaseResponse.text());
			return new Response(null, { status: 204 });
		}

		const releases: GitHubRelease[] = await releaseResponse.json();
		console.log(`Found ${releases.length} releases`);

		const validRelease = pickRelease(releases, channel);
		console.log(`Found latest ${channel} release: `, validRelease?.tag_name);

		if (!validRelease) {
			return new Response(null, { status: 204 });
		}

		const latestJsonAsset = validRelease.assets.find((asset) => asset.name === "latest.json");

		if (!latestJsonAsset) {
			console.error("Failed to find latest.json asset in release");
			return new Response(null, { status: 204 });
		}

		const assetResponse = await fetch(latestJsonAsset.browser_download_url);

		if (!assetResponse.ok) {
			console.error("Failed to fetch latest.json content: ", await assetResponse.text());
			return new Response(null, { status: 204 });
		}

		const latestJson = await assetResponse.json();

		// Cache the result
		if (kv) {
			try {
				await kv.put(key, JSON.stringify(latestJson), { expirationTtl: ttlSeconds });
				console.log(`Cached ${channel} update check result`);
			} catch (e) {
				console.error(`Failed to write ${channel} update check to cache:`, e);
			}
		}

		return json(latestJson);
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 204 });
	}
}
