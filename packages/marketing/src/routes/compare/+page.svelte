<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { ArrowRightIcon, ScaleIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Seaquel compared to other SQL clients — sourced, dated | Seaquel"
	description="Honest, source-linked comparisons of Seaquel against TablePlus, DBeaver, DataGrip, Beekeeper Studio and Azure Data Studio, including where each of them is the better tool."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<section class="bg-linear-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
			<div class="container mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center md:px-6">
				<div
					class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
				>
					<ScaleIcon class="size-4" />
					<span>Comparisons</span>
				</div>
				<h1 class="text-balance font-bold text-4xl tracking-tight md:text-6xl">
					How Seaquel compares
				</h1>
				<p class="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
					Every claim here links to the vendor's own page and carries the date I checked it.
					Each one also has a section on what the other app does better, because sometimes
					it's the one you should buy.
				</p>
			</div>
		</section>

		<section class="py-16 md:py-20">
			<div class="container mx-auto max-w-4xl px-4 md:px-6">
				<ul class="grid gap-4 md:grid-cols-2">
					{#each data.competitors as competitor (competitor.slug)}
						<li>
							<a
								href="/compare/{competitor.slug}"
								class="flex h-full flex-col rounded-xl border bg-card p-6 transition-colors hover:bg-muted/40"
							>
								<div class="mb-2 flex items-center justify-between gap-3">
									<h2 class="font-semibold text-lg">Seaquel vs {competitor.name}</h2>
									<ArrowRightIcon class="size-4 shrink-0 text-muted-foreground" />
								</div>
								<p class="mb-4 text-muted-foreground text-sm leading-relaxed">
									{competitor.description}
								</p>
								<dl class="mt-auto grid grid-cols-2 gap-2 border-t pt-4 text-xs">
									<div>
										<dt class="text-muted-foreground">Their pricing</dt>
										<dd class="font-medium">{competitor.pricing.summary}</dd>
									</div>
									<div>
										<dt class="text-muted-foreground">Their engines</dt>
										<dd class="font-medium">~{competitor.engineCount}</dd>
									</div>
								</dl>
							</a>
						</li>
					{/each}
				</ul>

				<p class="mt-8 text-center text-muted-foreground text-sm">
					Switching from one of these? See the
					<a href="/alternatives" class="text-primary hover:underline">alternatives guides</a>.
				</p>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
