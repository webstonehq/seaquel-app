<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { ArrowRightIcon, RepeatIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="SQL client alternatives — honest switching guides | Seaquel"
	description="Replacing TablePlus, DBeaver or the retired Azure Data Studio? Sourced guides covering what you gain, what you give up, and when staying put is the better call."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<section class="bg-linear-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
			<div class="container mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center md:px-6">
				<div
					class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
				>
					<RepeatIcon class="size-4" />
					<span>Switching guides</span>
				</div>
				<h1 class="text-balance font-bold text-4xl tracking-tight md:text-6xl">
					Looking for an alternative?
				</h1>
				<p class="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
					What you get by switching, what you lose, and when you're better off keeping the
					app you already have.
				</p>
			</div>
		</section>

		<section class="py-16 md:py-20">
			<div class="container mx-auto max-w-4xl px-4 md:px-6">
				<ul class="grid gap-4 md:grid-cols-2">
					{#each data.competitors as competitor (competitor.slug)}
						<li>
							<a
								href="/alternatives/{competitor.slug}"
								class="flex h-full flex-col rounded-xl border bg-card p-6 transition-colors hover:bg-muted/40"
							>
								<div class="mb-2 flex items-center justify-between gap-3">
									<h2 class="font-semibold text-lg">{competitor.altTitle}</h2>
									<ArrowRightIcon class="size-4 shrink-0 text-muted-foreground" />
								</div>
								<p class="text-muted-foreground text-sm leading-relaxed">
									{competitor.altDescription ?? competitor.description}
								</p>
							</a>
						</li>
					{/each}
				</ul>

				<p class="mt-8 text-center text-muted-foreground text-sm">
					Want the feature tables instead? See the
					<a href="/compare" class="text-primary hover:underline">full comparisons</a>.
				</p>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
