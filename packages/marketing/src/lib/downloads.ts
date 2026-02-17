export interface DownloadOption {
	id: string;
	label: string;
	format: string;
	url: string;
}

export interface DownloadGroup {
	os: 'macos' | 'windows' | 'linux';
	label: string;
	options: DownloadOption[];
}

export const downloadGroups: DownloadGroup[] = [
	{
		os: 'macos',
		label: 'macOS',
		options: [
			{ id: 'macos-arm', label: 'Apple Silicon (M1/M2/M3)', format: '.dmg', url: '/download/macos-arm' },
			{ id: 'macos-intel', label: 'Intel', format: '.dmg', url: '/download/macos-intel' },
		]
	},
	{
		os: 'windows',
		label: 'Windows',
		options: [
			{ id: 'windows-msi', label: 'Installer', format: '.msi', url: '/download/windows-msi' },
			{ id: 'windows-nsis', label: 'Portable', format: '.exe', url: '/download/windows-nsis' },
		]
	},
	{
		os: 'linux',
		label: 'Linux',
		options: [
			{ id: 'linux-deb', label: 'Debian/Ubuntu', format: '.deb', url: '/download/linux-deb' },
			{ id: 'linux-rpm', label: 'Fedora/RHEL', format: '.rpm', url: '/download/linux-rpm' },
			{ id: 'linux-appimage', label: 'AppImage', format: '.AppImage', url: '/download/linux-appimage' },
		]
	}
];
