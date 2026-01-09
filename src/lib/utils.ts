import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type Platform = 'macos' | 'windows' | 'linux' | 'unknown';

export function detectPlatform(): Platform {
	if (typeof window === 'undefined') return 'unknown';
	const ua = navigator.userAgent.toLowerCase();
	if (ua.includes('mac')) return 'macos';
	if (ua.includes('win')) return 'windows';
	if (ua.includes('linux')) return 'linux';
	return 'unknown';
}

export function getPlatformLabel(platform: Platform): string {
	const labels: Record<Platform, string> = {
		macos: 'macOS',
		windows: 'Windows',
		linux: 'Linux',
		unknown: ''
	};
	return labels[platform];
}

export type Architecture = 'arm64' | 'x64' | 'unknown';

export function detectArchitecture(): Architecture {
	if (typeof window === 'undefined') return 'unknown';

	// Try modern API first (Chrome 90+, Edge 90+)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const nav = navigator as any;
	if (nav.userAgentData?.platform === 'macOS') {
		// On macOS, we can check for Apple Silicon
		// Unfortunately, userAgentData doesn't expose architecture directly
		// We'll use a heuristic: assume Apple Silicon for newer Macs
	}

	// Check for ARM indicators in user agent
	const ua = navigator.userAgent.toLowerCase();

	// Apple Silicon Macs
	if (ua.includes('mac') && (ua.includes('arm') || ua.includes('aarch64'))) {
		return 'arm64';
	}

	// Windows ARM
	if (ua.includes('win') && (ua.includes('arm') || ua.includes('aarch64'))) {
		return 'arm64';
	}

	// Most Macs sold since late 2020 are Apple Silicon
	// Safari on Apple Silicon reports as Intel for compatibility, so we default to arm64 for macOS
	if (ua.includes('mac')) {
		return 'arm64'; // Default to Apple Silicon for macOS
	}

	// Default to x64 for Windows and Linux
	return 'x64';
}

export function getDownloadUrl(platform: Platform, arch: Architecture): string {
	// Platforms that aren't available yet redirect to releases page
	if (platform === 'windows') {
		return 'https://github.com/webstonehq/seaquel/releases';
	}

	// For macOS, use architecture-specific route
	if (platform === 'macos') {
		return arch === 'x64' ? '/download/macos-intel' : '/download/macos-arm';
	}

	// For Linux
	if (platform === 'linux') {
		return '/download/linux';
	}

	// Fallback
	return 'https://github.com/webstonehq/seaquel/releases';
}
