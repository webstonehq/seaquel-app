<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import DemoPlayer from "$lib/components/demo-player.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CalendarIcon, ArrowLeftIcon, MousePointerClickIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.entry.title} - Changelog - Seaquel</title>
	<meta name="description" content="Seaquel changelog: {data.entry.title}" />
</svelte:head>

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
					class="prose prose-lg dark:prose-invert max-w-none
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
