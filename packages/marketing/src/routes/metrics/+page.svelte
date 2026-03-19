<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { ChartContainer, type ChartConfig } from "$lib/components/ui/chart";
	import { AreaChart } from "layerchart";
	import { fly } from "svelte/transition";
	import {
		DownloadIcon,
		StarIcon,
		GitForkIcon,
		TagIcon,
	} from "lucide-svelte";
	import type { HistoricalEntry } from "./+page.server";
	import Seo from "$lib/components/seo.svelte";

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

	function trendData(key: (entry: HistoricalEntry) => number) {
		return (data.history ?? []).map((entry: HistoricalEntry) => ({
			date: entry.date,
			value: key(entry),
		}));
	}

	const downloadsTrend = $derived(
		(data.history ?? []).map((entry: HistoricalEntry) => ({
			date: entry.date,
			macOS: entry.platformDownloads.macOS,
			windows: entry.platformDownloads.windows,
			linux: entry.platformDownloads.linux,
		})),
	);
	const starsTrend = $derived(trendData((e) => e.stars));
	const openIssueTrend = $derived(trendData((e) => e.openIssues));
	const releasesTrend = $derived(trendData((e) => e.totalReleases));

	const trendChartConfig: ChartConfig = {
		value: { label: "Value", color: "var(--chart-1)" },
	};

	const releaseData = $derived(
		(data.releaseBreakdowns ?? []).map((r) => ({
			label: r.tag,
			macOS: r.macOS,
			windows: r.windows,
			linux: r.linux,
		})),
	);

	const areaChartConfig: ChartConfig = {
		macOS: { label: "macOS", color: "var(--chart-1)" },
		windows: { label: "Windows", color: "var(--chart-2)" },
		linux: { label: "Linux", color: "var(--chart-3)" },
	};
</script>

<Seo
	title="Metrics - Seaquel"
	description="Seaquel's public metrics dashboard. See download stats, GitHub activity, release cadence, and platform breakdown — all in the open."
/>

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

		<!-- Metrics Sections -->
		<section class="py-16">
			<div class="container mx-auto px-4 md:px-6">
				{#if data.error}
					<div class="text-center py-12">
						<p class="text-muted-foreground">{data.error}</p>
					</div>
				{:else if data.metrics}
					{@const m = data.metrics}
					<div class="max-w-5xl mx-auto flex flex-col gap-6">

						<!-- Downloads -->
						<div in:fly={{ y: 30, delay: 100, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<DownloadIcon class="size-5 text-primary" />
										</div>
										<CardTitle>Downloads</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div class="flex flex-col md:flex-row gap-6">
										<div class="flex flex-col gap-4 md:w-1/3 shrink-0">
											<div>
												<p class="text-4xl font-bold tracking-tight">{fmt.format(m.totalDownloads)}</p>
												<p class="text-sm text-muted-foreground mt-1">Total Downloads</p>
											</div>
											<div>
												<p class="text-xl font-semibold">{fmt.format(m.thirtyDayDownloads)}</p>
												<p class="text-sm text-muted-foreground">30-Day Downloads</p>
											</div>
										</div>

										<div class="flex-1 min-w-0">
											{#if downloadsTrend.length <= 1}
												<div class="flex h-[300px] items-center justify-center text-muted-foreground text-sm text-center px-4">
													Trend data will appear after two daily snapshots.
												</div>
											{:else}
												<ChartContainer config={areaChartConfig} class="h-[300px] w-full">
													<AreaChart
														data={downloadsTrend}
														x="date"
														series={[
															{ key: "macOS", value: (d) => d.macOS, color: "var(--chart-1)" },
															{ key: "windows", value: (d) => d.windows, color: "var(--chart-2)" },
															{ key: "linux", value: (d) => d.linux, color: "var(--chart-3)" },
														]}
														seriesLayout="stack"
														legend
														props={{
															area: { opacity: 0.3 },
															legend: { placement: "top-right" },
															xAxis: { tickLabelProps: { rotate: -45, textAnchor: "end" } },
														}}
													/>
												</ChartContainer>
											{/if}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<!-- GitHub Stars -->
						<div in:fly={{ y: 30, delay: 200, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<StarIcon class="size-5 text-primary" />
										</div>
										<CardTitle>GitHub Stars</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div class="flex flex-col md:flex-row gap-6">
										<div class="flex flex-col gap-4 md:w-1/3 shrink-0">
											<div>
												<p class="text-4xl font-bold tracking-tight">{fmt.format(m.stars)}</p>
												<p class="text-sm text-muted-foreground mt-1">Stars</p>
											</div>
										</div>
										<div class="flex-1 min-w-0">
											{#if starsTrend.length <= 1}
												<div class="flex h-[200px] items-center justify-center text-muted-foreground text-sm text-center px-4">
													Trend data will appear after two daily snapshots.
												</div>
											{:else}
												<ChartContainer config={trendChartConfig} class="h-[200px] w-full">
													<AreaChart
														data={starsTrend}
														x="date"
														y="value"
														props={{
															area: { fill: "var(--chart-2)", opacity: 0.2 },
															line: { stroke: "var(--chart-2)", class: "stroke-2" },
														}}
													/>
												</ChartContainer>
											{/if}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<!-- GitHub Activity -->
						<div in:fly={{ y: 30, delay: 300, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<GitForkIcon class="size-5 text-primary" />
										</div>
										<CardTitle>GitHub Activity</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div class="flex flex-col md:flex-row gap-6">
										<div class="flex flex-col gap-4 md:w-1/3 shrink-0">
											<div>
												<p class="text-4xl font-bold tracking-tight">{fmt.format(m.openIssues)}</p>
												<p class="text-sm text-muted-foreground mt-1">Open Issues</p>
											</div>
											<div>
												<p class="text-xl font-semibold">{fmt.format(m.forks)}</p>
												<p class="text-sm text-muted-foreground">Forks</p>
											</div>
										</div>
										<div class="flex-1 min-w-0">
											{#if openIssueTrend.length <= 1}
												<div class="flex h-[200px] items-center justify-center text-muted-foreground text-sm text-center px-4">
													Trend data will appear after two daily snapshots.
												</div>
											{:else}
												<ChartContainer config={trendChartConfig} class="h-[200px] w-full">
													<AreaChart
														data={openIssueTrend}
														x="date"
														y="value"
														props={{
															area: { fill: "var(--chart-3)", opacity: 0.2 },
															line: { stroke: "var(--chart-3)", class: "stroke-2" },
														}}
													/>
												</ChartContainer>
											{/if}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<!-- Releases -->
						<div in:fly={{ y: 30, delay: 400, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<TagIcon class="size-5 text-primary" />
										</div>
										<CardTitle>Releases</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div class="flex flex-col md:flex-row gap-6">
										<div class="flex flex-col gap-4 md:w-1/3 shrink-0">
											<div>
												<p class="text-4xl font-bold tracking-tight">{fmt.format(m.totalReleases)}</p>
												<p class="text-sm text-muted-foreground mt-1">Total Releases</p>
											</div>
											<div>
												<p class="text-xl font-semibold">
													{m.avgDaysBetweenReleases > 0 ? `${m.avgDaysBetweenReleases} days` : "N/A"}
												</p>
												<p class="text-sm text-muted-foreground">Avg. Days Between Releases</p>
											</div>
											<div>
												<p class="text-xl font-semibold">
													{m.latestRelease ? formatDate(m.latestRelease) : "N/A"}
												</p>
												<p class="text-sm text-muted-foreground">Latest Release</p>
											</div>
										</div>
										<div class="flex-1 min-w-0">
											{#if releasesTrend.length <= 1}
												<div class="flex h-[200px] items-center justify-center text-muted-foreground text-sm text-center px-4">
													Trend data will appear after two daily snapshots.
												</div>
											{:else}
												<ChartContainer config={trendChartConfig} class="h-[200px] w-full">
													<AreaChart
														data={releasesTrend}
														x="date"
														y="value"
														props={{
															area: { fill: "var(--chart-4)", opacity: 0.2 },
															line: { stroke: "var(--chart-4)", class: "stroke-2" },
														}}
													/>
												</ChartContainer>
											{/if}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<!-- Per-Release Downloads -->
						<div in:fly={{ y: 30, delay: 500, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<DownloadIcon class="size-5 text-primary" />
										</div>
										<CardTitle>Per-Release Downloads</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									{#if releaseData.length > 0}
										<ChartContainer config={areaChartConfig} class="h-[300px] w-full">
											<AreaChart
												data={releaseData}
												x="label"
												series={[
													{ key: "macOS", value: (d) => d.macOS, color: "var(--chart-1)" },
													{ key: "windows", value: (d) => d.windows, color: "var(--chart-2)" },
													{ key: "linux", value: (d) => d.linux, color: "var(--chart-3)" },
												]}
												seriesLayout="stack"
												legend
												props={{
													area: { opacity: 0.3 },
													legend: { placement: "top-right" },
													xAxis: { tickLabelProps: { rotate: -45, textAnchor: "end" } },
												}}
											/>
										</ChartContainer>
									{:else}
										<div class="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
											No per-release download data available.
										</div>
									{/if}
								</CardContent>
							</Card>
						</div>

					</div>
				{/if}
			</div>
		</section>

		<FooterSection />
	</div>
</div>
