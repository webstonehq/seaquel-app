<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { ChartContainer, type ChartConfig } from "$lib/components/ui/chart";
	import { AreaChart, BarChart } from "layerchart";
	import { fly } from "svelte/transition";
	import {
		DownloadIcon,
		StarIcon,
		GitForkIcon,
		TagIcon,
		RefreshCwIcon,
	} from "lucide-svelte";
	import type { HistoricalEntry } from "$lib/metrics/types";
	import {
		dailyDownloads,
		downloadsInWindow,
		latestReleaseAdoption,
	} from "$lib/metrics/derive";
	import Seo from "$lib/components/seo.svelte";

	let { data } = $props();

	const fmt = new Intl.NumberFormat("en-US");
	const pct = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
	const dateFmt = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const shortDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

	function formatDate(iso: string): string {
		return dateFmt.format(new Date(iso));
	}

	function trendData(key: (entry: HistoricalEntry) => number) {
		return (data.history ?? []).map((entry: HistoricalEntry) => ({
			date: new Date(entry.date),
			value: key(entry),
		}));
	}

	const history = $derived(data.history ?? []);

	// GitHub only reports lifetime counters, so the rates below are diffs
	// between daily snapshots rather than anything the API hands us directly.
	const perDayDownloads = $derived(dailyDownloads(history));
	const recentDownloads = $derived(downloadsInWindow(history, 30));
	const adoption = $derived(
		latestReleaseAdoption(history, data.metrics?.latestReleaseTag ?? "", 14),
	);

	const starsTrend = $derived(trendData((e) => e.stars));
	const openIssueTrend = $derived(trendData((e) => e.openIssues));

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

	// The series key is what the legend prints, so it carries the display casing.
	const platformSeries = [
		{ key: "macOS", value: (d: { macOS: number }) => d.macOS, color: "var(--chart-1)" },
		{ key: "Windows", value: (d: { windows: number }) => d.windows, color: "var(--chart-2)" },
		{ key: "Linux", value: (d: { linux: number }) => d.linux, color: "var(--chart-3)" },
	];

	const areaChartConfig: ChartConfig = {
		macOS: { label: "macOS", color: "var(--chart-1)" },
		Windows: { label: "Windows", color: "var(--chart-2)" },
		Linux: { label: "Linux", color: "var(--chart-3)" },
	};

	// The trend `date` values are Date objects, so layerchart uses a time
	// scale and spaces/formats a handful of ticks (e.g. "Jun", "Sep", "Mar '26")
	// instead of rendering one rotated label per daily data point.
	const xTrendAxis = { ticks: 6 };
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
						Transparency is a core value. Here are Seaquel's download statistics,
						GitHub activity, and release cadence — pulled straight from the source
						and refreshed once a day.
					</p>
					{#if data.collectedAt}
						<p class="text-sm text-muted-foreground mt-4">
							Last collected {formatDate(data.collectedAt)}
						</p>
					{/if}
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
												<p class="text-sm text-muted-foreground mt-1">Installer downloads</p>
											</div>
											<div>
												<p class="text-xl font-semibold">{fmt.format(recentDownloads.downloads)}</p>
												<p class="text-sm text-muted-foreground">
													{#if recentDownloads.spansFullWindow}
														Last 30 days
													{:else if recentDownloads.since}
														Since {formatDate(recentDownloads.since)}
													{:else}
														Awaiting a second daily snapshot
													{/if}
												</p>
											</div>
										</div>

										<div class="flex-1 min-w-0">
											{#if perDayDownloads.length === 0}
												<div class="flex h-[300px] items-center justify-center text-muted-foreground text-sm text-center px-4">
													Trend data will appear after two daily snapshots.
												</div>
											{:else}
												<ChartContainer config={areaChartConfig} class="h-[300px] w-full">
													<AreaChart
														data={perDayDownloads}
														x="date"
														series={platformSeries}
														seriesLayout="stack"
														legend
														props={{
															area: { opacity: 0.3 },
															legend: { placement: "top-right" },
															xAxis: xTrendAxis,
														}}
													/>
												</ChartContainer>
											{/if}
										</div>
									</div>
									<p class="text-xs text-muted-foreground mt-4">
										New downloads per day, by platform. Counts installers only — the macOS
										auto-updater bundle is excluded so updates aren't mistaken for installs.
									</p>
								</CardContent>
							</Card>
						</div>

						<!-- Adoption -->
						<div in:fly={{ y: 30, delay: 150, duration: 600 }}>
							<Card>
								<CardHeader class="pb-2">
									<div class="flex items-center gap-3">
										<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<RefreshCwIcon class="size-5 text-primary" />
										</div>
										<CardTitle>Adoption</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
										<div>
											<p class="text-4xl font-bold tracking-tight">{fmt.format(m.updaterChecks)}</p>
											<p class="text-sm text-muted-foreground mt-1">Update checks</p>
											<p class="text-xs text-muted-foreground mt-2">
												Every running install polls for updates, so this is a rough floor
												for how many copies are out there.
											</p>
										</div>
										<div>
											<p class="text-4xl font-bold tracking-tight">
												{adoption ? pct.format(adoption.share) : "—"}
											</p>
											<p class="text-sm text-muted-foreground mt-1">
												On {m.latestReleaseTag || "the latest release"}
											</p>
											<p class="text-xs text-muted-foreground mt-2">
												{#if adoption}
													{fmt.format(adoption.onLatest)} of {fmt.format(adoption.total)}
													downloads since {formatDate(adoption.since)}.
												{:else}
													Needs two weeks of daily snapshots.
												{/if}
											</p>
										</div>
										<div>
											<p class="text-4xl font-bold tracking-tight">{fmt.format(m.updaterDownloads)}</p>
											<p class="text-sm text-muted-foreground mt-1">macOS auto-updates</p>
											<p class="text-xs text-muted-foreground mt-2">
												Existing macOS users updating in place. Windows and Linux updates
												are indistinguishable from fresh installs.
											</p>
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
															xAxis: xTrendAxis,
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
												<p class="text-sm text-muted-foreground mt-1">Open issues</p>
											</div>
											<div>
												<p class="text-xl font-semibold">{fmt.format(m.openPullRequests)}</p>
												<p class="text-sm text-muted-foreground">Open pull requests</p>
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
															xAxis: xTrendAxis,
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
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
										<div>
											<p class="text-4xl font-bold tracking-tight">{fmt.format(m.totalReleases)}</p>
											<p class="text-sm text-muted-foreground mt-1">Total releases</p>
										</div>
										<div>
											<p class="text-4xl font-bold tracking-tight">
												{m.avgDaysBetweenReleases > 0 ? `${m.avgDaysBetweenReleases} days` : "N/A"}
											</p>
											<p class="text-sm text-muted-foreground mt-1">Avg. between releases</p>
										</div>
										<div>
											<p class="text-4xl font-bold tracking-tight">
												{m.latestRelease ? shortDateFmt.format(new Date(m.latestRelease)) : "N/A"}
											</p>
											<p class="text-sm text-muted-foreground mt-1">
												Latest release{m.latestReleaseTag ? ` (${m.latestReleaseTag})` : ""}
											</p>
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
											<BarChart
												data={releaseData}
												x="label"
												series={platformSeries}
												seriesLayout="stack"
												legend
												props={{
													// Bars default to a black stroke, which outlines every
													// segment in dark mode.
													bars: { stroke: "none" },
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
									<p class="text-xs text-muted-foreground mt-4">
										Lifetime downloads per release. Older releases spent longer as the
										current version, so this tracks release age as much as popularity.
									</p>
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
