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
		SunMoonIcon,
		ChevronsLeftRightIcon,
		TerminalIcon,
	} from "lucide-svelte";

	const visualTools = [
		{
			icon: ActivityIcon,
			title: "Visual Query Plans",
			description: "Interactive EXPLAIN and EXPLAIN ANALYZE diagrams powered by SvelteFlow. See planning time, execution time, and estimated rows at a glance.",
		},
		{
			icon: NetworkIcon,
			title: "ERD Viewer",
			description: "Interactive Entity Relationship Diagrams with table search, schema filtering, and one-click export to PNG or SVG.",
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
	];

	const developerExperience = [
		{
			icon: KeyboardIcon,
			title: "Keyboard Shortcuts",
			description: "Comprehensive shortcuts: Cmd+Enter to execute, Cmd+S to save, Cmd+Shift+F to format, and more.",
		},
		{
			icon: SunMoonIcon,
			title: "Dark/Light Mode",
			description: "System-aware theming with manual override. Comfortable viewing in any lighting condition.",
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
					{#each visualTools as feature, index}
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

		<CtaSection />
		<FooterSection />
	</div>
</div>
