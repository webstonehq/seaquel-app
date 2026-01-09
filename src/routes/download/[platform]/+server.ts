import { redirect, isRedirect } from "@sveltejs/kit";

const GITHUB_RELEASES_URL = "https://api.github.com/repos/webstonehq/seaquel/releases";
const FALLBACK_URL = "https://github.com/webstonehq/seaquel/releases";

// Asset name patterns for each platform (standard Tauri naming)
const ASSET_PATTERNS: Record<string, RegExp> = {
	"macos": /\.dmg$/i,           // Default macOS (will prefer aarch64)
	"macos-arm": /aarch64\.dmg$/i, // Apple Silicon
	"macos-intel": /x64\.dmg$/i,   // Intel Mac
	"windows": /\.(exe|msi)$/i,    // Windows installer
	"linux": /\.(AppImage|deb)$/i, // Linux
};

interface GitHubAsset {
	name: string;
	browser_download_url: string;
}

interface GitHubRelease {
	draft: boolean;
	prerelease: boolean;
	assets: GitHubAsset[];
}

export const GET = async ({ params }) => {
	const { platform } = params;

	// Validate platform parameter
	if (!platform || !Object.keys(ASSET_PATTERNS).includes(platform)) {
		// For unknown platforms, redirect to releases page
		return redirect(302, FALLBACK_URL);
	}

	try {
		const response = await fetch(GITHUB_RELEASES_URL, {
			headers: {
				"User-Agent": "seaquel-website",
				"Accept": "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			console.error("Failed to fetch releases:", response.status);
			return redirect(302, FALLBACK_URL);
		}

		const releases: GitHubRelease[] = await response.json();

		// Find the latest non-draft, non-prerelease
		const latestRelease = releases.find(
			(release) => !release.draft && !release.prerelease
		);

		if (!latestRelease || !latestRelease.assets?.length) {
			return redirect(302, FALLBACK_URL);
		}

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

		if (asset) {
			return redirect(302, asset.browser_download_url);
		}

		// No matching asset found, redirect to releases page
		return redirect(302, FALLBACK_URL);
	} catch (error) {
		// Re-throw redirects (they're caught by the try-catch but need to propagate)
		if (isRedirect(error)) {
			throw error;
		}
		console.error("Error fetching release:", error);
		return redirect(302, FALLBACK_URL);
	}
};
