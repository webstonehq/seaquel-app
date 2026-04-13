<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import DemoPlayer from "$lib/components/demo-player.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CalendarIcon, ArrowLeftIcon, MousePointerClickIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="{data.entry.title} - Changelog - Seaquel"
	description={data.entry.description}
/>

<style>
	.changelog-content :global(h2[id]),
	.changelog-content :global(h3[id]) {
		position: relative;
		scroll-margin-top: 6rem;
	}
	.changelog-content :global(h2[id] > a),
	.changelog-content :global(h3[id] > a) {
		color: inherit;
		text-decoration: none;
	}
	.changelog-content :global(h2[id] > a:hover),
	.changelog-content :global(h3[id] > a:hover) {
		text-decoration: none;
	}
	.changelog-content :global(h2[id])::before,
	.changelog-content :global(h3[id])::before {
		content: '#';
		position: absolute;
		right: 100%;
		margin-right: 0.25rem;
		opacity: 0;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}
	.changelog-content :global(h2[id]:hover)::before,
	.changelog-content :global(h3[id]:hover)::before {
		opacity: 0.5;
	}
</style>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6 max-w-3xl">
				<!-- Back link -->
				<div in:fly={{ y: 20, duration: 400 }}>
					<Button href="/changelog" variant="ghost" size="sm" class="mb-8 -ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All Updates
					</Button>
				</div>

				<!-- Header -->
				<header in:fly={{ y: 30, delay: 100, duration: 600 }} class="mb-12">
					<div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
						<CalendarIcon class="size-4" />
						<time datetime={data.entry.date}>{data.entry.dateFormatted}</time>
					</div>
					<h1 class="text-4xl md:text-5xl font-bold tracking-tight">
						{data.entry.title}
					</h1>
				</header>
			</div>

			<!-- Demo Section -->
			<div
				class="container mx-auto px-4 md:px-6 max-w-5xl mb-16"
				in:fly={{ y: 30, delay: 150, duration: 600 }}
			>
				<div class="flex flex-col items-center">
					<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 mb-4">
						<MousePointerClickIcon class="size-4" />
						<span>Try it yourself</span>
					</div>
					<p class="text-muted-foreground text-center mb-6 max-w-lg">
						Explore the features below in this interactive demo — no download required.
					</p>
					<DemoPlayer hintText="Click to explore" />
				</div>
			</div>

			<div class="container mx-auto px-4 md:px-6 max-w-3xl">
				<!-- Content -->
				<div
					in:fly={{ y: 30, delay: 200, duration: 600 }}
					class="changelog-content prose prose-lg dark:prose-invert max-w-none
						prose-headings:font-bold prose-headings:tracking-tight
						prose-a:text-primary prose-a:no-underline hover:prose-a:underline
						prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
						prose-pre:bg-muted prose-pre:border"
				>
					<data.entry.content />
				</div>
			</div>
		</article>

		<FooterSection />
	</div>
</div>
