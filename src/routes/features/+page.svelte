<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import FeatureCategory from "$lib/components/feature-category.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { fly } from "svelte/transition";
	import {
		ActivityIcon,
		NetworkIcon,
		CodeIcon,
		WandSparklesIcon,
		LayoutGridIcon,
		PlayIcon,
		DatabaseIcon,
		PencilIcon,
		RowsIcon,
		DownloadIcon,
		HistoryIcon,
		BookmarkIcon,
		StarIcon,
		SearchIcon,
		ShieldIcon,
		LockIcon,
		KeyboardIcon,
		PaletteIcon,
		ChevronsLeftRightIcon,
		TerminalIcon,
		FolderTreeIcon,
		TablePropertiesIcon,
		ListOrderedIcon,
		CopyIcon,
		GaugeIcon,
		LinkIcon,
		ShieldCheckIcon,
		CommandIcon,
		MousePointerClickIcon,
		TriangleAlertIcon,
		RefreshCwIcon,
		GlobeIcon,
		FileCodeIcon,
		PlugIcon,
		ImportIcon,
		LayoutDashboardIcon,
		GitBranchIcon,
		BarChart3Icon,
		LineChartIcon,
		PieChartIcon,
		ScatterChartIcon,
		TrendingUpIcon,
		FlameIcon,
		HardDriveIcon,
	} from "lucide-svelte";

	const visualTools = [
		{
			icon: LayoutDashboardIcon,
			title: "Canvas Workspace",
			description: "An infinite visual canvas powered by XYFlow. Drag tables to inspect data, write SQL in query nodes, view results, and create charts - all connected in a visual workflow.",
		},
		{
			icon: GitBranchIcon,
			title: "Query Visualizer",
			description: "SQL queries parsed into visual diagrams showing table relationships, JOINs, WHERE clauses, and SELECT projections. Access via the Visualize tab in the editor.",
		},
		{
			icon: ActivityIcon,
			title: "Visual Query Plans",
			description: "Interactive EXPLAIN and EXPLAIN ANALYZE diagrams powered by SvelteFlow. See planning time, execution time, and estimated rows at a glance.",
		},
		{
			icon: NetworkIcon,
			title: "ERD Viewer",
			description: "Interactive Entity Relationship Diagrams with table search, schema filtering, and one-click export to PNG, SVG, or clipboard.",
		},
		{
			icon: FolderTreeIcon,
			title: "Schema Tree Browser",
			description: "Navigate your database with collapsible schema groups. See row counts, distinguish tables from views, and quickly generate SELECT queries from any table.",
		},
		{
			icon: TablePropertiesIcon,
			title: "Table Inspector",
			description: "Detailed column information with primary key and foreign key badges. View index information and constraints at a glance.",
		},
	];

	const queryEditor = [
		{
			icon: CodeIcon,
			title: "Monaco Editor",
			description: "Professional code editor with SQL syntax highlighting, autocomplete, and intelligent error detection.",
		},
		{
			icon: WandSparklesIcon,
			title: "SQL Formatting",
			description: "One-click SQL formatting with configurable style, proper indentation, and uppercase keywords.",
		},
		{
			icon: LayoutGridIcon,
			title: "Tab Management",
			description: "Multiple query tabs with Cmd+T to create, Cmd+W to close, and Cmd+1-9 to quickly switch between tabs.",
		},
		{
			icon: PlayIcon,
			title: "Query Execution",
			description: "Execute queries with Cmd+Enter. See execution time, row counts, and affected row indicators instantly.",
		},
		{
			icon: ListOrderedIcon,
			title: "Multi-Statement Execution",
			description: "Execute multiple SQL statements at once with live statement count. Results are displayed separately for each statement.",
		},
		{
			icon: FileCodeIcon,
			title: "Sample Queries",
			description: "Get started quickly with pre-populated sample queries for each database type. Learn SQL patterns and explore your schema instantly.",
		},
		{
			icon: FlameIcon,
			title: "Hot Path Analysis",
			description: "Automatic bottleneck detection highlights expensive operations with severity indicators (green, yellow, red).",
		},
	];

	const dataOperations = [
		{
			icon: DatabaseIcon,
			title: "Full CRUD Support",
			description: "INSERT, UPDATE, and DELETE operations directly from the interface with intuitive dialogs and confirmations.",
		},
		{
			icon: PencilIcon,
			title: "Cell-Level Editing",
			description: "Click any cell to edit values inline. Seaquel automatically generates the UPDATE statement for you.",
		},
		{
			icon: RowsIcon,
			title: "Row Actions",
			description: "Add new rows with form dialogs, delete rows with confirmation, and manage your data efficiently.",
		},
		{
			icon: DownloadIcon,
			title: "Multi-Format Export",
			description: "Export query results to CSV, JSON, SQL INSERT statements, or Markdown tables with one click.",
		},
		{
			icon: CopyIcon,
			title: "Advanced Copy Options",
			description: "Copy individual rows as JSON, copy entire column values to clipboard. Multiple formats for seamless data transfer.",
		},
		{
			icon: GaugeIcon,
			title: "Virtual Scrolling",
			description: "Efficiently render thousands of rows without performance degradation. Smooth scrolling through massive result sets.",
		},
	];

	const historyOrganization = [
		{
			icon: HistoryIcon,
			title: "Query History",
			description: "Up to 500 queries stored with timestamps, execution time, and row counts for each query.",
		},
		{
			icon: BookmarkIcon,
			title: "Saved Queries",
			description: "Save frequently used queries with custom names. Access them anytime from the sidebar.",
		},
		{
			icon: StarIcon,
			title: "Favorites",
			description: "Star important queries for quick access. Filter by favorites to find what you need fast.",
		},
		{
			icon: SearchIcon,
			title: "Full-Text Search",
			description: "Search across your query history and saved queries to find exactly what you're looking for.",
		},
	];

	const connectionFeatures = [
		{
			icon: TerminalIcon,
			title: "SSH Tunnel",
			description: "Connect securely through SSH tunnels for remote databases. Supports password and key-based authentication.",
		},
		{
			icon: DatabaseIcon,
			title: "Multi-Database",
			description: "PostgreSQL, MySQL, and SQLite support with a unified interface. More databases coming soon.",
		},
		{
			icon: LockIcon,
			title: "Secure Storage",
			description: "Connection credentials stored securely on your device. Your sensitive data never leaves your machine.",
		},
		{
			icon: ShieldIcon,
			title: "Connection Persistence",
			description: "Saved connections persist across app restarts. Pick up right where you left off.",
		},
		{
			icon: LinkIcon,
			title: "Connection String Mode",
			description: "Two ways to connect: paste a connection string for quick setup, or use the detailed configuration form.",
		},
		{
			icon: ShieldCheckIcon,
			title: "SSL/TLS Configuration",
			description: "Flexible SSL modes: disable, allow, prefer, or require. Secure your database connections with proper encryption.",
		},
		{
			icon: PlugIcon,
			title: "Test Connection",
			description: "Verify your connection settings before saving. Quickly diagnose connectivity issues with detailed error feedback.",
		},
		{
			icon: ImportIcon,
			title: "DBeaver Import",
			description: "Migrate from DBeaver effortlessly. Bulk import your existing connection configurations with one click.",
		},
		{
			icon: HardDriveIcon,
			title: "DuckDB Desktop Support",
			description: "Full support for DuckDB connections in the desktop app. Fast, embedded analytics at your fingertips.",
		},
	];

	const developerExperience = [
		{
			icon: KeyboardIcon,
			title: "Keyboard Shortcuts",
			description: "Comprehensive shortcuts: Cmd+Enter to execute, Cmd+S to save, Cmd+Shift+F to format, and more.",
		},
		{
			icon: PaletteIcon,
			title: "Custom Themes",
			description: "Choose from preset themes like Nord, or create your own. Import and export themes, with full light and dark mode support.",
		},
		{
			icon: ChevronsLeftRightIcon,
			title: "Smart Pagination",
			description: "Navigate large result sets with configurable page sizes from 25 to 1000 rows per page.",
		},
		{
			icon: LayoutGridIcon,
			title: "Resizable Panels",
			description: "Customize your workspace with resizable sidebar and result panels to fit your workflow.",
		},
		{
			icon: CommandIcon,
			title: "Command Palette",
			description: "Quick access with Cmd+K to execute commands, navigate tabs, switch connections, and more. Power user efficiency.",
		},
		{
			icon: MousePointerClickIcon,
			title: "Tab Context Menu",
			description: "Right-click tabs for quick actions: close other tabs, close tabs to the right or left, close all tabs at once.",
		},
		{
			icon: TriangleAlertIcon,
			title: "Unsaved Changes Warnings",
			description: "Never lose your work. Seaquel warns you when closing tabs with unsaved modifications.",
		},
		{
			icon: RefreshCwIcon,
			title: "Auto App Updates",
			description: "Automatic update detection and one-click installation. Always stay on the latest version effortlessly.",
		},
	];

	const internationalization = [
		{
			icon: GlobeIcon,
			title: "Multi-Language Support",
			description: "Available in 6 languages: English, German, French, Spanish, Arabic, and Korean. More languages coming soon.",
		},
	];

	const dataVisualization = [
		{
			icon: BarChart3Icon,
			title: "Bar Charts",
			description: "Create bar charts from query results with configurable axes and groupings.",
		},
		{
			icon: LineChartIcon,
			title: "Line Charts",
			description: "Visualize trends over time. Auto-updates when connected to query results on the canvas.",
		},
		{
			icon: PieChartIcon,
			title: "Pie Charts",
			description: "Display proportional data with configurable segments and labels.",
		},
		{
			icon: ScatterChartIcon,
			title: "Scatter Charts",
			description: "Plot relationships between variables and identify correlations visually.",
		},
	];

	const statisticsDashboard = [
		{
			icon: GaugeIcon,
			title: "Database Metrics",
			description: "View database size, table counts, and total row counts at a glance.",
		},
		{
			icon: TrendingUpIcon,
			title: "Index Usage Monitoring",
			description: "Monitor index utilization to identify optimization opportunities.",
		},
		{
			icon: DatabaseIcon,
			title: "Multi-Database Statistics",
			description: "Statistics available for both DuckDB and PostgreSQL connections.",
		},
	];
</script>

<svelte:head>
	<title>Features - Seaquel</title>
	<meta name="description" content="Explore all Seaquel features: Visual Query Plans, ERD Viewer, Monaco Editor, data operations, query history, and more." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fly={{ y: 30, duration: 600 }}>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Every Feature You Need
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Seaquel packs professional-grade database tools into a fast, lightweight package.
						Discover everything that makes database management a joy.
					</p>
				</div>
			</div>
		</section>

		<!-- Visual Tools - Priority Section -->
		<section class="py-16 bg-muted/30">
			<div class="container mx-auto px-4 md:px-6">
				<div class="mb-10 text-center">
					<span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Highlighted</span>
					<h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-2">Visual Tools</h2>
					<p class="text-muted-foreground max-w-xl mx-auto">Understand your database like never before with interactive visual tools.</p>
				</div>

				<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{#each visualTools as feature, index (feature.title)}
						<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
							<Card class="h-full border-2 border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-primary/5 to-primary/10">
								<CardHeader class="pb-2">
									<div class="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20">
										<feature.icon class="size-7 text-primary" />
									</div>
									<CardTitle class="text-2xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription class="text-base leading-relaxed">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Feature Categories -->
		<FeatureCategory
			title="Data Visualization"
			description="Transform your query results into meaningful charts."
			features={dataVisualization}
		/>

		<FeatureCategory
			title="Statistics Dashboard"
			description="Monitor your database health and performance at a glance."
			features={statisticsDashboard}
			variant="highlight"
		/>

		<FeatureCategory
			title="Query Editor"
			description="A powerful, professional-grade SQL editor with all the features you'd expect."
			features={queryEditor}
		/>

		<FeatureCategory
			title="Data Operations"
			description="Full control over your data with intuitive editing and export capabilities."
			features={dataOperations}
			variant="highlight"
		/>

		<FeatureCategory
			title="History & Organization"
			description="Keep track of your queries and stay organized with powerful search."
			features={historyOrganization}
		/>

		<FeatureCategory
			title="Connection Features"
			description="Connect securely to your databases with flexible authentication options."
			features={connectionFeatures}
			variant="highlight"
		/>

		<FeatureCategory
			title="Developer Experience"
			description="Built for developers who value efficiency and customization."
			features={developerExperience}
		/>

		<FeatureCategory
			title="Internationalization"
			description="Seaquel speaks your language with full localization support."
			features={internationalization}
		/>

		<CtaSection />
		<FooterSection />
	</div>
</div>
