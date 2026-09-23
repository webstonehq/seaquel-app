<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowLeftIcon,
		ArrowRightIcon,
		ChevronRightIcon,
		ClockIcon,
		ListIcon,
		Maximize2Icon,
		PlayIcon
	} from "lucide-svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";
	import FullscreenOverlay from "$lib/components/fullscreen-overlay.svelte";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";

	// Position is derived from the published lessons, not from the raw `order`
	// field, so gaps in the sequence never surface as "Lesson 8 of 2".
	const position = $derived(data.all.findIndex((l) => l.slug === data.lesson.slug) + 1);

	// The exercise expands in place rather than navigating to /demo, so readers
	// keep their scroll position and the lesson text. Same #fullscreen hash
	// convention the demo player uses on /learn-sql and the landing page.
	let theaterMode = $state(false);

	onMount(() => {
		if (window.location.hash === "#fullscreen") theaterMode = true;
	});

	function openTheater() {
		theaterMode = true;
		history.replaceState(null, "", "#fullscreen");
	}

	function onTheaterClose() {
		history.replaceState(null, "", window.location.pathname);
	}

	// LearningResource markup: each lesson is a standalone unit of the course,
	// which is what earns the "Course" treatment in search results.
	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "LearningResource",
			name: data.lesson.title,
			description: data.lesson.description,
			url: `${origin}/learn-sql/${data.lesson.slug}`,
			learningResourceType: "Tutorial",
			educationalLevel: "Beginner",
			teaches: data.lesson.title,
			inLanguage: "en",
			isAccessibleForFree: true,
			isPartOf: {
				"@type": "Course",
				name: "Learn SQL Interactively",
				url: `${origin}/learn-sql`,
				provider: { "@type": "Organization", name: "Seaquel", url: origin }
			}
		})
	);
</script>

<Seo title={data.lesson.seoTitle} description={data.lesson.description} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<style>
	.lesson-content :global(h2[id]),
	.lesson-content :global(h3[id]) {
		scroll-margin-top: 6rem;
	}
</style>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				<!-- Breadcrumb -->
				<div class="flex items-center justify-between mb-8">
					<Button href="/learn-sql" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All lessons
					</Button>
					<nav class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
						<a href="/learn-sql" class="hover:text-primary transition-colors">Learn SQL</a>
						<ChevronRightIcon class="size-3.5 opacity-50" />
						<span class="text-foreground line-clamp-1 max-w-xs">{data.lesson.title}</span>
					</nav>
				</div>

				<div class="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
					<!-- Course navigation -->
					<aside class="hidden lg:block sticky top-24">
						<div
							class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3 inline-flex items-center gap-2"
						>
							<ListIcon class="size-3.5" />
							The course
						</div>
						<ul class="border-l space-y-0.5">
							{#each data.all as item (item.slug)}
								<li>
									<a
										href="/learn-sql/{item.slug}"
										class="block px-3 py-1.5 -ml-px border-l text-sm transition-colors {item.slug ===
										data.lesson.slug
											? 'border-primary text-primary font-medium'
											: 'border-transparent text-muted-foreground hover:text-foreground'}"
									>
										{item.title}
									</a>
								</li>
							{/each}
						</ul>
					</aside>

					<div class="min-w-0">
						<header class="mb-10">
							<div
								class="text-sm font-medium text-primary mb-3 tracking-wide uppercase text-[11px]"
							>
								Lesson {position} of {data.all.length}
							</div>
							<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
								{data.lesson.title}
							</h1>
							<p class="text-lg md:text-xl text-muted-foreground text-pretty">
								{data.lesson.description}
							</p>
							<div class="flex items-center gap-3 mt-5 text-sm text-muted-foreground">
								<span class="inline-flex items-center gap-1.5">
									<ClockIcon class="size-3.5" />
									{data.lesson.readTime} read
								</span>
							</div>
						</header>

						<!--
							The prose is server-rendered and deliberately sits ABOVE the
							interactive demo: the demo is an iframe, so nothing inside it is
							indexable. The text has to carry the page on its own.
						-->
						<div
							class="lesson-content prose prose-lg dark:prose-invert max-w-none
								prose-headings:font-semibold prose-headings:tracking-tight
								prose-a:text-primary prose-a:no-underline hover:prose-a:underline
								prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
								prose-pre:bg-muted prose-pre:border
								prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r
								prose-li:marker:text-primary"
						>
							<data.lesson.content />
						</div>

						{#if data.lesson.demo}
							<section class="mt-14 scroll-mt-24" id="practice">
								<div class="flex items-center gap-2 mb-2">
									<PlayIcon class="size-4 text-primary" />
									<h2 class="text-2xl font-bold tracking-tight">Try it yourself</h2>
								</div>
								<p class="text-muted-foreground mb-6">
									Run the queries from this lesson against a real database. Nothing to install,
									no account needed.
								</p>
								<!--
									The anchor needs a real target: prerendering rejects a link
									to #fullscreen with no matching id, and without JS the link
									should still land the reader on the exercise.
								-->
								<div
									id="fullscreen"
									class="relative group rounded-lg border overflow-hidden bg-card shadow-sm scroll-mt-24"
								>
									<button
										class="absolute top-3 right-3 z-20 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background hover:border-primary/50 cursor-pointer"
										onclick={openTheater}
										aria-label="Expand exercise to fullscreen"
									>
										<Maximize2Icon class="size-4 text-foreground" />
									</button>
									<iframe
										src="/demo/learn/{data.lesson.demo}"
										title="Interactive {data.lesson.title} exercise"
										loading="lazy"
										class="w-full h-[600px] border-0"
									></iframe>
								</div>
								<p class="text-sm text-muted-foreground mt-3">
									Need more room?
									<a
										href="#fullscreen"
										onclick={(event) => {
											event.preventDefault();
											openTheater();
										}}
										class="text-primary hover:underline"
									>
										Expand it to full screen
									</a>
									, or
									<a href="/download" class="text-primary hover:underline">download Seaquel</a>
									to practise against your own database.
								</p>
							</section>

							<FullscreenOverlay bind:open={theaterMode} onclose={onTheaterClose}>
								<iframe
									src="/demo/learn/{data.lesson.demo}"
									title="Interactive {data.lesson.title} exercise (fullscreen)"
									class="w-full h-full border-0"
								></iframe>
							</FullscreenOverlay>
						{/if}

						<!-- Prev / next keeps crawlers moving through the whole course -->
						<nav class="mt-16 pt-8 border-t grid sm:grid-cols-2 gap-4">
							{#if data.lesson.previous}
								<a
									href="/learn-sql/{data.lesson.previous.slug}"
									class="group rounded-lg border p-4 hover:border-primary transition-colors"
								>
									<div
										class="text-xs text-muted-foreground mb-1 inline-flex items-center gap-1.5"
									>
										<ArrowLeftIcon class="size-3.5" />
										Previous
									</div>
									<div class="font-medium group-hover:text-primary transition-colors">
										{data.lesson.previous.title}
									</div>
								</a>
							{:else}
								<div class="hidden sm:block"></div>
							{/if}

							{#if data.lesson.next}
								<a
									href="/learn-sql/{data.lesson.next.slug}"
									class="group rounded-lg border p-4 hover:border-primary transition-colors sm:text-right"
								>
									<div
										class="text-xs text-muted-foreground mb-1 inline-flex items-center gap-1.5 sm:justify-end sm:w-full"
									>
										Next
										<ArrowRightIcon class="size-3.5" />
									</div>
									<div class="font-medium group-hover:text-primary transition-colors">
										{data.lesson.next.title}
									</div>
								</a>
							{/if}
						</nav>
					</div>
				</div>
			</div>
		</article>

		<FooterSection />
	</div>
</div>
