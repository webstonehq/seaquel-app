<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import PostCard from "$lib/components/blog/post-card.svelte";
	import NewsletterSignup from "$lib/components/blog/newsletter-signup.svelte";
	import authorAvatar from "$lib/assets/mike_headshot.webp";
	import {
		SparklesIcon,
		CalendarIcon,
		ClockIcon,
		ArrowRightIcon,
		ChevronLeftIcon,
		ChevronRightIcon
	} from "lucide-svelte";
	import { fly } from "svelte/transition";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";

	let { data }: { data: PageData } = $props();

	const POSTS_PER_PAGE = 9;

	let page = $state(1);

	const featured = $derived(data.entries[0]);
	const rest = $derived(data.entries.slice(1));
	const pageCount = $derived(Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE)));
	const showPagination = $derived(data.entries.length >= 10);
	const pagedRest = $derived(
		showPagination
			? rest.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
			: rest
	);

	function goToPage(p: number) {
		page = Math.min(Math.max(1, p), pageCount);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}
</script>

<Seo
	title="Blog - Seaquel"
	description="Deep dives, launch notes, and honest postmortems on building a desktop app that also runs as a web app with multi-tenancy and self-hosted instances."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero -->
		<section class="py-20 md:py-24 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fly={{ y: 30, duration: 600 }}>
					<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-medium text-primary mb-5">
						<SparklesIcon class="size-3.5" />
						<span>The Seaquel Blog</span>
					</div>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Notes from the <span class="text-primary">query engine</span>
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Deep dives, launch notes, and honest postmortems on building a desktop app that also runs as a web app with multi-tenancy and self-hosted instances.
					</p>
				</div>
			</div>
		</section>

		<!-- Posts -->
		<section class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				{#if featured}
					<!-- Featured -->
					<div in:fly={{ y: 30, delay: 100, duration: 600 }} class="mb-12 md:mb-16">
						<a href="/blog/{featured.slug}" class="group block">
							<Card class="overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 p-0">
								<div class="grid md:grid-cols-2">
									<div class="relative min-h-[280px] border-b md:border-b-0 md:border-r overflow-hidden">
										<img
											src="/blog/{featured.slug}/og-light.webp"
											alt=""
											loading="eager"
											class="block dark:hidden absolute inset-0 w-full h-full object-cover"
										/>
										<img
											src="/blog/{featured.slug}/og-dark.webp"
											alt=""
											loading="eager"
											class="hidden dark:block absolute inset-0 w-full h-full object-cover"
										/>
										<div class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur border border-primary/30 px-4 py-2 text-sm font-medium text-primary">
											<SparklesIcon class="size-4" />
											Featured post
										</div>
									</div>
									<CardContent class="p-8 md:p-10 flex flex-col gap-4">
										<div class="flex items-center gap-3 text-xs text-muted-foreground">
											<span class="inline-flex items-center gap-1.5">
												<CalendarIcon class="size-3.5" />
												<time datetime={featured.date}>{featured.dateFormatted}</time>
											</span>
											<span class="opacity-40">·</span>
											<span class="inline-flex items-center gap-1.5">
												<ClockIcon class="size-3.5" />
												{featured.readTime}
											</span>
										</div>
										<h2 class="text-2xl md:text-3xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
											{featured.title}
										</h2>
										<p class="text-muted-foreground leading-relaxed">
											{featured.description}
										</p>
										<div class="flex items-center gap-3 mt-auto pt-4 border-t">
											<enhanced:img
												src={authorAvatar}
												alt={featured.author.name}
												class="size-10 rounded-full object-cover"
											/>
											<div class="flex flex-col leading-tight">
												<span class="text-sm font-medium">{featured.author.name}</span>
												<span class="text-xs text-muted-foreground">{featured.author.role}</span>
											</div>
											<div class="ml-auto inline-flex size-9 items-center justify-center rounded-full border group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
												<ArrowRightIcon class="size-4" />
											</div>
										</div>
									</CardContent>
								</div>
							</Card>
						</a>
					</div>
				{/if}

				{#if rest.length > 0}
					<div class="flex items-baseline justify-between mb-6">
						<h3 class="text-xl font-semibold tracking-tight">Latest posts</h3>
						<span class="text-sm text-muted-foreground">
							{rest.length} article{rest.length === 1 ? "" : "s"}
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each pagedRest as entry, index (entry.slug)}
							<div in:fly={{ y: 20, delay: 150 + index * 40, duration: 500 }}>
								<PostCard {entry} />
							</div>
						{/each}
					</div>

					{#if showPagination && pageCount > 1}
						<div class="flex justify-center items-center gap-2 mt-12">
							<Button
								variant="outline"
								size="icon"
								disabled={page === 1}
								onclick={() => goToPage(page - 1)}
								aria-label="Previous page"
							>
								<ChevronLeftIcon class="size-4" />
							</Button>
							{#each Array(pageCount) as _, i}
								<Button
									variant={page === i + 1 ? "default" : "outline"}
									size="icon"
									onclick={() => goToPage(i + 1)}
									aria-label="Page {i + 1}"
								>
									{i + 1}
								</Button>
							{/each}
							<Button
								variant="outline"
								size="icon"
								disabled={page === pageCount}
								onclick={() => goToPage(page + 1)}
								aria-label="Next page"
							>
								<ChevronRightIcon class="size-4" />
							</Button>
						</div>
					{/if}
				{/if}

				{#if data.entries.length === 0}
					<div class="text-center py-16 text-muted-foreground">
						<p>No posts yet. Check back soon!</p>
					</div>
				{/if}

				<div class="mt-20">
					<NewsletterSignup source="blog-index" />
				</div>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
