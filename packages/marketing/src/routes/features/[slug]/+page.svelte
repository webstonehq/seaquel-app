<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, ArrowRightIcon, ImageIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="{data.category.title} - Features - Seaquel"
	description={data.category.description}
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 max-w-5xl">
				<div in:fly={{ y: 20, duration: 400 }} class="flex items-center justify-between mb-8">
					<Button href="/features" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All Features
					</Button>

					<div class="flex items-center gap-2">
						{#if data.adjacent.prev}
							<Button href="/features/{data.adjacent.prev.slug}" variant="ghost" size="sm" class="gap-1">
								<ArrowLeftIcon class="size-3.5" />
								<span class="hidden sm:inline">{data.adjacent.prev.title}</span>
								<span class="sm:hidden">Prev</span>
							</Button>
						{/if}
						{#if data.adjacent.next}
							<Button href="/features/{data.adjacent.next.slug}" variant="ghost" size="sm" class="gap-1">
								<span class="hidden sm:inline">{data.adjacent.next.title}</span>
								<span class="sm:hidden">Next</span>
								<ArrowRightIcon class="size-3.5" />
							</Button>
						{/if}
					</div>
				</div>

				<div in:fly={{ y: 30, delay: 100, duration: 600 }} class="text-center">
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						{data.category.title}
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						{data.category.description}
					</p>
				</div>
			</div>
		</section>

		<!-- Feature Sections -->
		<div class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6 max-w-5xl">
				<div class="space-y-24 md:space-y-32">
					{#each data.category.features as feature, index (feature.title)}
						<section
							class="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
							in:fly={{ y: 30, delay: 150 + index * 100, duration: 600 }}
						>
							<!-- Text content -->
							<div class={index % 2 === 1 ? 'md:order-2' : ''}>
								<div class="flex items-center gap-3 mb-4">
									<div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
										<feature.icon class="size-6 text-primary" />
									</div>
									<h2 class="text-2xl md:text-3xl font-bold tracking-tight">
										{feature.title}
									</h2>
								</div>
								<p class="text-lg text-muted-foreground leading-relaxed">
									{feature.extendedDescription || feature.description}
								</p>
							</div>

							<!-- Screenshot placeholder -->
							<div class={index % 2 === 1 ? 'md:order-1' : ''}>
								{#if feature.screenshot}
									<img
										src={feature.screenshot}
										alt="{feature.title} screenshot"
										class="rounded-xl border shadow-lg"
									/>
								{:else}
									<div class="aspect-video rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center gap-3">
										<ImageIcon class="size-8 text-muted-foreground/50" />
										<span class="text-sm text-muted-foreground/50">Screenshot coming soon</span>
									</div>
								{/if}
							</div>
						</section>
					{/each}
				</div>
			</div>
		</div>

		<CtaSection />
		<FooterSection />
	</div>
</div>
