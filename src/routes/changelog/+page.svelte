<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { CalendarIcon, ArrowRightIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Changelog - Seaquel</title>
	<meta name="description" content="See what's new in Seaquel. Latest updates, features, and improvements." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fly={{ y: 30, duration: 600 }}>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Changelog
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Stay up to date with the latest improvements, features, and fixes in Seaquel.
					</p>
				</div>
			</div>
		</section>

		<!-- Changelog List -->
		<section class="py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-3xl">
				<div class="space-y-6">
					{#each data.entries as entry, index (entry.slug)}
						<a href="/changelog/{entry.slug}" class="block group">
							<div in:fly={{ y: 30, delay: 100 + index * 50, duration: 600 }}>
								<Card class="hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
									<CardHeader>
										<div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
											<CalendarIcon class="size-4" />
											<time datetime={entry.date}>{entry.dateFormatted}</time>
										</div>
										<CardTitle class="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
											{entry.title}
											<ArrowRightIcon class="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
										</CardTitle>
									</CardHeader>
								</Card>
							</div>
						</a>
					{/each}
				</div>

				{#if data.entries.length === 0}
					<div class="text-center py-12 text-muted-foreground">
						<p>No changelog entries yet. Check back soon!</p>
					</div>
				{/if}
			</div>
		</section>

		<FooterSection />
	</div>
</div>
