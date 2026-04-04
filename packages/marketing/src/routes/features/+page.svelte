<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import FeatureCategory from "$lib/components/feature-category.svelte";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { fly } from "svelte/transition";
	import { ArrowRightIcon } from "lucide-svelte";
	import { featureCategories } from "$lib/features";
	import Seo from "$lib/components/seo.svelte";

	const visualTools = featureCategories.find((c) => c.slug === "visual-tools")!;
	const otherCategories = featureCategories.filter((c) => c.slug !== "visual-tools");
</script>

<Seo
	title="Features - Seaquel"
	description="Explore all Seaquel features: AI assistant, dashboards, pending changes, table management, split panes, version history, interactive SQL tutorials, visual query builder, canvas workspace, query plans, ERD viewer, and more."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fly={{ y: 30, duration: 600 }}>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Every Feature You Need
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Seaquel packs professional-grade database tools into a fast, lightweight package.
						Discover everything that makes database management a joy.
					</p>
				</div>
			</div>
		</section>

		<!-- Visual Tools - Priority Section -->
		<section class="py-16 bg-muted/30">
			<div class="container mx-auto px-4 md:px-6">
				<div class="mb-10 text-center">
					<span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Highlighted</span>
					<h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-2">{visualTools.title}</h2>
					<p class="text-muted-foreground max-w-xl mx-auto">{visualTools.description}</p>
					<a href="/features/{visualTools.slug}" class="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
						Learn more <ArrowRightIcon class="size-3.5" />
					</a>
				</div>

				<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{#each visualTools.features as feature, index (feature.title)}
						<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
							<Card class="h-full border-2 border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-primary/5 to-primary/10">
								<CardHeader class="pb-2">
									<div class="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20">
										<feature.icon class="size-7 text-primary" />
									</div>
									<CardTitle class="text-2xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription class="text-base leading-relaxed">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Feature Categories -->
		{#each otherCategories as category (category.slug)}
			<FeatureCategory
				title={category.title}
				description={category.description}
				features={category.features}
				variant={category.variant}
				slug={category.slug}
			/>
		{/each}

		<CtaSection />
		<FooterSection />
	</div>
</div>
