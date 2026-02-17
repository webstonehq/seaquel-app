<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import DemoPlayer from "$lib/components/demo-player.svelte";
	import DownloadDropdown from "$lib/components/download-dropdown.svelte";
	import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "$lib/components/ui/card";
	import {
		GraduationCapIcon,
		PlayCircleIcon,
		LayersIcon,
		MousePointerClickIcon,
		CheckIcon,
		BookOpenIcon,
		TerminalIcon,
	} from "lucide-svelte";
	import { fly, fade } from "svelte/transition";
</script>

<svelte:head>
	<title>Learn SQL Interactively - Free SQL Tutorial | Seaquel</title>
	<meta
		name="description"
		content="Learn SQL for free with Seaquel's interactive tutorial. Practice writing queries on a real database with visual exercises, progressive challenges, and a drag-and-drop sandbox. No signup required."
	/>
	<meta property="og:title" content="Learn SQL Interactively - Free SQL Tutorial | Seaquel" />
	<meta property="og:description" content="Master SQL through hands-on practice. Write real queries, solve progressive challenges, and build visual queries in a drag-and-drop sandbox. Free, no account required." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Learn SQL Interactively - Free SQL Tutorial | Seaquel" />
	<meta name="twitter:description" content="Master SQL through hands-on practice. Write real queries, solve progressive challenges, and build visual queries in a drag-and-drop sandbox." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<!-- Hero Section -->
		<section class="relative overflow-hidden bg-linear-to-br from-amber-500/10 via-orange-500/5 to-background py-20 md:py-32">
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent"></div>

			<div class="container relative mx-auto px-4 md:px-6">
				<div class="flex flex-col items-center text-center space-y-8">
					<!-- Badge -->
					<div in:fade={{ delay: 100, duration: 600 }}>
						<div class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
							<GraduationCapIcon class="size-4" />
							<span>Interactive SQL Tutorial</span>
						</div>
					</div>

					<!-- Headline -->
					<div class="flex flex-col gap-4 max-w-4xl" in:fly={{ y: 20, delay: 200, duration: 600 }}>
						<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
							Learn SQL by
							<span class="bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Actually Writing It</span>
						</h1>
						<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
							Forget passive video courses. Seaquel's built-in tutorial puts you in front of a real database from the first minute. Write queries, see results, and build confidence through hands-on practice.
						</p>
					</div>

					<!-- CTA -->
					<div class="flex flex-col sm:flex-row gap-4 pt-4" in:fly={{ y: 20, delay: 400, duration: 600 }}>
						<a
							href="#try-it"
							class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:bg-primary/90"
						>
							<PlayCircleIcon class="size-5" />
							Try It Now — No Signup
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Works -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6">
				<div class="text-center flex flex-col gap-4 mb-16">
					<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
						How the Tutorial <span class="text-primary">Works</span>
					</h2>
					<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
						No theory overload. Each lesson gives you a goal, a real database, and a place to write SQL. You learn by doing.
					</p>
				</div>

				<div class="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
					{#each [
						{
							icon: BookOpenIcon,
							title: "Progressive Lessons",
							description: "Start with SELECT and work your way up to JOINs, aggregations, subqueries, and window functions. Each lesson builds on the last.",
							gradient: "from-amber-500/10 to-orange-500/10",
						},
						{
							icon: MousePointerClickIcon,
							title: "Visual Query Builder",
							description: "Drag and drop tables onto a canvas and connect them visually. See how SQL clauses map to what you build — it makes JOINs click.",
							gradient: "from-indigo-500/10 to-violet-500/10",
						},
						{
							icon: TerminalIcon,
							title: "SQL Sandbox",
							description: "A free-form playground with a sample e-commerce database pre-loaded. Experiment with any query — no risk, no setup, instant results.",
							gradient: "from-green-500/10 to-emerald-500/10",
						},
					] as feature, index}
						<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
							<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br {feature.gradient}">
								<CardHeader>
									<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20">
										<feature.icon class="size-6 text-primary" />
									</div>
									<CardTitle class="text-xl">{feature.title}</CardTitle>
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

		<!-- What You'll Learn -->
		<section class="py-20 md:py-28">
			<div class="container mx-auto px-4 md:px-6">
				<div class="text-center flex flex-col gap-4 mb-16">
					<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
						What You'll <span class="text-primary">Learn</span>
					</h2>
					<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
						A structured curriculum that takes you from your first query to writing advanced SQL with confidence.
					</p>
				</div>

				<div class="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl mx-auto">
					{#each [
						"SELECT, WHERE, and filtering data",
						"Sorting with ORDER BY",
						"Aggregations: COUNT, SUM, AVG, MIN, MAX",
						"GROUP BY and HAVING clauses",
						"INNER, LEFT, RIGHT, and FULL JOINs",
						"Subqueries and nested SELECTs",
						"Common Table Expressions (CTEs)",
						"Window functions: ROW_NUMBER, RANK, LAG",
					] as topic, index}
						<div class="flex items-start gap-3" in:fly={{ y: 20, delay: 100 + index * 50, duration: 500 }}>
							<div class="mt-1 size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
								<CheckIcon class="size-3 text-primary" />
							</div>
							<span class="text-base text-foreground">{topic}</span>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Interactive Demo Section -->
		<section id="try-it" class="py-20 md:py-28 bg-linear-to-b from-muted/20 to-background">
			<div class="container mx-auto px-4 md:px-6">
				<div class="text-center flex flex-col gap-4 mb-12">
					<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
						Try It <span class="text-primary">Right Now</span>
					</h2>
					<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
						This is the real app running in your browser. Click below to open the interactive SQL tutorial.
					</p>
				</div>

				<div class="max-w-6xl mx-auto flex flex-col items-center">
					<div class="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground border border-accent/20 mb-4">
						<LayersIcon class="size-4" />
						<span>Live Interactive Tutorial</span>
					</div>
					<DemoPlayer mode="learn" autoOpen hintText="Click to open the SQL tutorial" />
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="py-20 md:py-32">
			<div class="container mx-auto px-4 md:px-6">
				<Card class="relative overflow-hidden border-2 border-primary/20 bg-linear-to-br from-primary/5 via-accent/5 to-background p-8 md:p-16">
					<div class="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
					<div class="absolute bottom-0 left-0 size-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

					<div class="relative flex flex-col items-center text-center space-y-6">
						<h2 class="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
							Learn SQL Inside Your Database Client
						</h2>
						<p class="text-lg text-muted-foreground max-w-2xl">
							The tutorial runs right inside Seaquel — practice on sample data, then switch to your own database and apply what you've learned. Download for the full experience.
						</p>

						<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
							<div class="flex items-center gap-2">
								<CheckIcon class="size-4 text-green-500" />
								<span>Free forever</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckIcon class="size-4 text-green-500" />
								<span>No account required</span>
							</div>
							<div class="flex items-center gap-2">
								<CheckIcon class="size-4 text-green-500" />
								<span>Works offline</span>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row gap-4 pt-4">
							<DownloadDropdown size="lg" label="Download Seaquel" class="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" />
						</div>
					</div>
				</Card>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
