// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	site: 'https://seaquel.app',
	integrations: [
		starlight({
			title: 'Seaquel Docs',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/webstonehq/seaquel' },
				{ icon: 'discord', label: 'Discord', href: 'https://seaquel.app/discord' },
			],
			lastUpdated: true,
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Interface Overview', slug: 'getting-started/interface-overview' },
					],
				},
				{
					label: 'Connections',
					items: [
						{ label: 'Creating Connections', slug: 'connections/creating-connections' },
						{ label: 'PostgreSQL', slug: 'connections/postgresql' },
						{ label: 'MySQL', slug: 'connections/mysql' },
						{ label: 'SQLite', slug: 'connections/sqlite' },
						{ label: 'DuckDB', slug: 'connections/duckdb' },
						{ label: 'Microsoft SQL Server', slug: 'connections/mssql' },
						{ label: 'SSH Tunnels', slug: 'connections/ssh-tunnels' },
						{ label: 'SSL / TLS', slug: 'connections/ssl-tls' },
						{ label: 'Importing Connections', slug: 'connections/importing' },
						{ label: 'Projects', slug: 'connections/projects' },
					],
				},
				{
					label: 'Query Editor',
					items: [
						{ label: 'Writing Queries', slug: 'editor/writing-queries' },
						{ label: 'Executing Queries', slug: 'editor/executing-queries' },
						{ label: 'Query Parameters', slug: 'editor/query-parameters' },
						{ label: 'Formatting', slug: 'editor/formatting' },
						{ label: 'Tabs', slug: 'editor/tabs' },
						{ label: 'Sample Queries', slug: 'editor/sample-queries' },
					],
				},
				{
					label: 'Results & Data',
					items: [
						{ label: 'Viewing Results', slug: 'results/viewing-results' },
						{ label: 'Editing Data', slug: 'results/editing-data' },
						{ label: 'Row Operations', slug: 'results/row-operations' },
						{ label: 'Exporting Data', slug: 'results/exporting' },
					],
				},
				{
					label: 'Visual Tools',
					items: [
						{ label: 'Canvas', slug: 'visual-tools/canvas' },
						{ label: 'Query Visualizer', slug: 'visual-tools/query-visualizer' },
						{ label: 'Query Plans', slug: 'visual-tools/query-plans' },
						{ label: 'ERD Viewer', slug: 'visual-tools/erd-viewer' },
						{ label: 'Charts', slug: 'visual-tools/charts' },
					],
				},
				{
					label: 'Schema & Database',
					items: [
						{ label: 'Schema Browser', slug: 'schema/schema-browser' },
						{ label: 'Table Inspector', slug: 'schema/table-inspector' },
						{ label: 'Statistics', slug: 'schema/statistics' },
					],
				},
				{
					label: 'Organization',
					items: [
						{ label: 'Query History', slug: 'organization/query-history' },
						{ label: 'Saved Queries', slug: 'organization/saved-queries' },
						{ label: 'Shared Library', slug: 'organization/shared-library' },
					],
				},
				{
					label: 'Learn SQL',
					items: [
						{ label: 'Tutorials', slug: 'learn-sql/tutorials' },
						{ label: 'Query Builder', slug: 'learn-sql/query-builder' },
						{ label: 'Practice Database', slug: 'learn-sql/practice-database' },
					],
				},
				{
					label: 'Customization',
					items: [
						{ label: 'Themes', slug: 'customization/themes' },
						{ label: 'Keyboard Shortcuts', slug: 'customization/keyboard-shortcuts' },
						{ label: 'Command Palette', slug: 'customization/command-palette' },
						{ label: 'Language', slug: 'customization/language' },
						{ label: 'AI Assistant', slug: 'customization/ai-assistant' },
						{ label: 'Updates', slug: 'customization/updates' },
					],
				},
			],
		}),
		svelte(),
	],
});
