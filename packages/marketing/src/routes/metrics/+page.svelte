<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import MetricsChartDialog from "$lib/components/metrics-chart-dialog.svelte";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { fly } from "svelte/transition";
	import {
		DownloadIcon,
		StarIcon,
		GitForkIcon,
		CircleDotIcon,
		MonitorIcon,
		TagIcon,
		CalendarIcon,
		ClockIcon,
		TrendingUpIcon,
		BarChart3Icon,
	} from "lucide-svelte";
	import type { OpenMetrics, ReleaseDownloads } from "./+page.server";

	let { data } = $props();

	const fmt = new Intl.NumberFormat("en-US");
	const dateFmt = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	function formatDate(iso: string): string {
		return dateFmt.format(new Date(iso));
	}

	type ChartKey = "total" | "thirtyDay" | "macOS" | "windows" | "linux";

	interface MetricCard {
		icon: typeof DownloadIcon;
		label: string;
		value: string;
		subtitle?: string;
		chartKey?: ChartKey;
	}

	function buildCards(m: OpenMetrics): MetricCard[] {
		return [
			{
				icon: DownloadIcon,
				label: "Total Downloads",
				value: fmt.format(m.totalDownloads),
				chartKey: "total",
			},
			{
				icon: TrendingUpIcon,
				label: "30-Day Downloads",
				value: fmt.format(m.thirtyDayDownloads),
				subtitle: "Based on releases published in the last 30 days",
				chartKey: "thirtyDay",
			},
			{
				icon: StarIcon,
				label: "GitHub Stars",
				value: fmt.format(m.stars),
			},
			{
				icon: GitForkIcon,
				label: "GitHub Forks",
				value: fmt.format(m.forks),
			},
			{
				icon: CircleDotIcon,
				label: "Open Issues",
				value: fmt.format(m.openIssues),
			},
			{
				icon: MonitorIcon,
				label: "macOS Downloads",
				value: fmt.format(m.platformDownloads.macOS),
				chartKey: "macOS",
			},
			{
				icon: MonitorIcon,
				label: "Windows Downloads",
				value: fmt.format(m.platformDownloads.windows),
				chartKey: "windows",
			},
			{
				icon: MonitorIcon,
				label: "Linux Downloads",
				value: fmt.format(m.platformDownloads.linux),
				chartKey: "linux",
			},
			{
				icon: TagIcon,
				label: "Total Releases",
				value: fmt.format(m.totalReleases),
			},
			{
				icon: CalendarIcon,
				label: "Latest Release",
				value: m.latestRelease ? formatDate(m.latestRelease) : "N/A",
			},
			{
				icon: ClockIcon,
				label: "Avg. Days Between Releases",
				value: m.avgDaysBetweenReleases > 0 ? `${m.avgDaysBetweenReleases} days` : "N/A",
			},
		];
	}

	// Chart dialog state
	let dialogOpen = $state(false);
	let dialogTitle = $state("");
	let dialogData: { label: string; value: number }[] = $state([]);
	let dialogColor = $state("var(--chart-1)");

	const chartColors: Record<ChartKey, string> = {
		total: "var(--chart-1)",
		thirtyDay: "var(--chart-2)",
		macOS: "var(--chart-3)",
		windows: "var(--chart-4)",
		linux: "var(--chart-5)",
	};

	function openChart(key: ChartKey, label: string) {
		const breakdowns = data.releaseBreakdowns;
		const now = Date.now();
		const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

		let filtered: ReleaseDownloads[];
		if (key === "thirtyDay") {
			filtered = breakdowns.filter(
				(r) => new Date(r.publishedAt).getTime() >= thirtyDaysAgo,
			);
		} else {
			filtered = breakdowns;
		}

		const field: keyof ReleaseDownloads =
			key === "total" || key === "thirtyDay" ? "total" : key;

		dialogData = filtered.map((r) => ({ label: r.tag, value: r[field] as number }));
		dialogTitle = `${label} per Release`;
		dialogColor = chartColors[key];
		dialogOpen = true;
	}

	function handleCardKeydown(e: KeyboardEvent, key: ChartKey, label: string) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openChart(key, label);
		}
	}
</script>

<svelte:head>
	<title>Metrics - Seaquel</title>
	<meta
		name="description"
		content="Seaquel's public metrics dashboard. See download stats, GitHub activity, release cadence, and platform breakdown — all in the open."
	/>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fly={{ y: 30, duration: 600 }}>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Metrics
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Transparency is a core value. Here are Seaquel's real-time download statistics,
						GitHub activity, and release cadence — pulled straight from the source.
					</p>
				</div>
			</div>
		</section>

		<!-- Metrics Grid -->
		<section class="py-16">
			<div class="container mx-auto px-4 md:px-6">
				{#if data.error}
					<div class="text-center py-12">
						<p class="text-muted-foreground">{data.error}</p>
					</div>
				{:else if data.metrics}
					{@const cards = buildCards(data.metrics)}
					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
						{#each cards as card, index (card.label)}
							<div in:fly={{ y: 30, delay: 100 + index * 50, duration: 600 }}>
								{#if card.chartKey}
									<Card
										class="h-full hover:shadow-md transition-shadow duration-300 cursor-pointer group"
										role="button"
										tabindex={0}
										onclick={() => openChart(card.chartKey!, card.label)}
										onkeydown={(e) => handleCardKeydown(e, card.chartKey!, card.label)}
									>
										<CardHeader class="pb-2">
											<div class="flex items-center gap-3">
												<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
													<card.icon class="size-5 text-primary" />
												</div>
												<CardTitle class="text-sm font-medium text-muted-foreground flex-1">
													{card.label}
												</CardTitle>
												<BarChart3Icon class="size-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
											</div>
										</CardHeader>
										<CardContent>
											<p class="text-3xl font-bold tracking-tight">{card.value}</p>
											{#if card.subtitle}
												<p class="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
											{/if}
										</CardContent>
									</Card>
								{:else}
									<Card class="h-full hover:shadow-md transition-shadow duration-300">
										<CardHeader class="pb-2">
											<div class="flex items-center gap-3">
												<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
													<card.icon class="size-5 text-primary" />
												</div>
												<CardTitle class="text-sm font-medium text-muted-foreground">
													{card.label}
												</CardTitle>
											</div>
										</CardHeader>
										<CardContent>
											<p class="text-3xl font-bold tracking-tight">{card.value}</p>
											{#if card.subtitle}
												<p class="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
											{/if}
										</CardContent>
									</Card>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<FooterSection />
	</div>
</div>

<MetricsChartDialog bind:open={dialogOpen} title={dialogTitle} data={dialogData} barColor={dialogColor} />
