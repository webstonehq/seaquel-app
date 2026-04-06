<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import FullscreenOverlay from "$lib/components/fullscreen-overlay.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, ArrowRightIcon, ImageIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";

	let { data }: { data: PageData } = $props();

	const images: Record<string, { default: string }> = import.meta.glob(
		'$lib/assets/features/*/*.webp',
		{ eager: true, query: { enhanced: true } }
	);
	const animatedImages: Record<string, { default: string }> = import.meta.glob(
		'$lib/assets/features/*/*.gif',
		{ eager: true }
	);

	let fullscreenOpen = $state(false);
	let fullscreenScreenshot: { src: string; alt: string, isAnimated?: boolean } | null = $state(null);

	function toKebabCase(s: string) {
		return s
		    .toLowerCase()
			.split(/[^a-z0-9]+/)
			.filter(Boolean)
			.join('-');
	}
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
					    {@const screenshot = images[`/src/lib/assets/features/${data.category.slug}/${toKebabCase(feature.title)}.webp`]?.default}
					    {@const animatedScreenshot = animatedImages[`/src/lib/assets/features/${data.category.slug}/${toKebabCase(feature.title)}.gif`]?.default}
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
								{#if screenshot}
									<button
										class="cursor-pointer border-0 bg-transparent p-0"
										onclick={() => { fullscreenScreenshot = { src: screenshot, alt: feature.title }; fullscreenOpen = true; }}
										aria-label="View {feature.title} screenshot fullscreen"
									>
										<enhanced:img
											src={screenshot}
											alt={feature.title}
										/>
									</button>
								{:else if animatedScreenshot}
    								<button
    									class="cursor-pointer border-0 bg-transparent p-0"
    									onclick={() => { fullscreenScreenshot = { src: animatedScreenshot, alt: feature.title, isAnimated: true }; fullscreenOpen = true; }}
    									aria-label="View {feature.title} screenshot fullscreen"
    								>
    				                    <img src={animatedScreenshot} alt={feature.title}>
    								</button>
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

<FullscreenOverlay bind:open={fullscreenOpen}>
	{#if fullscreenScreenshot}
	    {#if fullscreenScreenshot.isAnimated}
    		<img
    			src={fullscreenScreenshot.src}
    			alt={fullscreenScreenshot.alt}
    			class="w-full h-full object-contain"
    		/>		
		{:else}
    		<enhanced:img
    			src={fullscreenScreenshot.src}
    			alt={fullscreenScreenshot.alt}
    			class="w-full h-full object-contain"
    		/>		
		{/if}
	{/if}
</FullscreenOverlay>
