/**
 * Resolves a download platform id (e.g. `macos-arm`) to the matching
 * asset in the latest published GitHub release. Shared by the
 * `/download/[platform]` file redirect and the post-download page.
 */

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
}

interface GitHubAsset {
	name: string;
	browser_download_url: string;
	size: number;
}

interface GitHubRelease {
	tag_name: string;
	draft: boolean;
	prerelease: boolean;
	assets: GitHubAsset[];
}

/**
 * The latest release's asset for `platform`, or `null` when the platform
 * is unknown, GitHub is unreachable, or the release has no matching file.
 * Never throws — callers fall back to the releases page.
 */
export async function findLatestAsset(
	platform: string,
	token: string | undefined,
): Promise<ReleaseAsset | null> {
	if (!isKnownPlatform(platform)) return null;

	try {
		const headers: Record<string, string> = {
			"User-Agent": "seaquel-website",
			"Accept": "application/vnd.github.v3+json",
		};
		// The repo is public, so the API works without auth (at a lower rate
		// limit). Only send the token when it's configured — a
		// `Bearer undefined` header makes GitHub reject the request with 401.
		if (token) headers["Authorization"] = `Bearer ${token}`;

		const response = await fetch(GITHUB_RELEASES_URL, { headers });
		if (!response.ok) {
			console.error("Failed to fetch releases:", response.status);
			return null;
		}

		const releases: GitHubRelease[] = await response.json();

		// Find the latest non-draft, non-prerelease
		const latestRelease = releases.find(
			(release) => !release.draft && !release.prerelease
		);
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
		};
	} catch (error) {
		console.error("Error fetching release:", error);
		return null;
	}
}
