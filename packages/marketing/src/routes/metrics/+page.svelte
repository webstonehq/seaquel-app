<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
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
	} from "lucide-svelte";
	import type { OpenMetrics, PlatformDownloads } from "./+page.server";

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

	interface MetricCard {
		icon: typeof DownloadIcon;
		label: string;
		value: string;
		subtitle?: string;
	}

	function buildCards(m: OpenMetrics): MetricCard[] {
		return [
			{
				icon: DownloadIcon,
				label: "Total Downloads",
				value: fmt.format(m.totalDownloads),
			},
			{
				icon: TrendingUpIcon,
				label: "30-Day Downloads",
				value: fmt.format(m.thirtyDayDownloads),
				subtitle: "Based on releases published in the last 30 days",
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
			},
			{
				icon: MonitorIcon,
				label: "Windows Downloads",
				value: fmt.format(m.platformDownloads.windows),
			},
			{
				icon: MonitorIcon,
				label: "Linux Downloads",
				value: fmt.format(m.platformDownloads.linux),
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
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<FooterSection />
	</div>
</div>
