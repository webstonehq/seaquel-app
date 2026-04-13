<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { CalendarIcon, ArrowRightIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Changelog - Seaquel"
	description="See what's new in Seaquel. Latest updates, features, and improvements."
/>

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
				<div class="space-y-8">
					{#each data.entries as entry, index (entry.slug)}
						<div in:fly={{ y: 30, delay: 100 + index * 50, duration: 600 }} class="group">
							<Card class="hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
								<CardHeader>
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<CalendarIcon class="size-4" />
											<time datetime={entry.date}>{entry.dateFormatted}</time>
										</div>
										<span class="text-xs font-mono text-muted-foreground">{entry.slug}</span>
									</div>
									<a href="/changelog/{entry.slug}" class="block">
										<CardTitle class="text-2xl group-hover:text-primary transition-colors flex items-center gap-2">
											{entry.title}
											<ArrowRightIcon class="size-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
										</CardTitle>
									</a>
								</CardHeader>
								<CardContent>
									<p class="text-muted-foreground mb-4">{entry.description}</p>
									{#if entry.highlights.length > 0}
										<div class="flex flex-wrap gap-2">
											{#each entry.highlights as highlight}
												<a
													href="/changelog/{entry.slug}#{highlight.id}"
													class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
												>
													{highlight.label}
												</a>
											{/each}
										</div>
									{/if}
								</CardContent>
							</Card>
						</div>
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
