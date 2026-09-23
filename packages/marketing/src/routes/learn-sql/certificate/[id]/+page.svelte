<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CheckIcon, LinkIcon, ArrowRightIcon } from "lucide-svelte";
	import Seo from "$lib/components/seo.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";
	const url = $derived(`${origin}/learn-sql/certificate/${data.certificate.id}`);

	const issued = $derived(
		data.certificate.issuedAt
			? new Date(data.certificate.issuedAt).toLocaleDateString("en-GB", {
					day: "numeric",
					month: "long",
					year: "numeric"
				})
			: ""
	);

	let copied = $state(false);

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* clipboard blocked; the URL is visible in the address bar anyway */
		}
	}

	const linkedInHref = $derived(
		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
	);
	const xHref = $derived(
		`https://x.com/intent/post?text=${encodeURIComponent(
			`I completed the Seaquel SQL course — ${data.certificate.challengeCount} hands-on Postgres challenges.`
		)}&url=${encodeURIComponent(url)}`
	);
</script>

<Seo
	title="{data.certificate.name} — SQL Course Certificate | Seaquel"
	description="{data.certificate.name} completed all {data.certificate
		.lessonCount} lessons and {data.certificate
		.challengeCount} hands-on SQL challenges on Seaquel."
	ogImage="/learn-sql/certificate/{data.certificate.id}/og.png"
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<section class="py-16 md:py-24">
			<div class="container mx-auto px-4 md:px-6 max-w-3xl">
				<!-- The card mirrors the OG image, so what's shared matches what's seen. -->
				<div
					class="rounded-xl border-t-8 border-t-amber-500 border bg-card shadow-xl px-8 py-12 md:px-14 md:py-16"
				>
					<div class="text-xs font-semibold tracking-[0.3em] text-amber-500 mb-2">SEAQUEL</div>
					<p class="text-lg text-muted-foreground mb-8">Certificate of Completion</p>

					<h1 class="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-5">
						{data.certificate.name}
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground text-pretty">
						Completed all {data.certificate.lessonCount} lessons and
						{data.certificate.challengeCount} hands-on SQL challenges, each one graded by running
						it against a real PostgreSQL database.
					</p>

					<div
						class="mt-10 pt-6 border-t flex items-center justify-between text-sm text-muted-foreground"
					>
						<span>{issued}</span>
						<a href="/learn-sql" class="font-semibold text-amber-500 hover:underline">
							seaquel.app/learn-sql
						</a>
					</div>
				</div>

				{#if data.isOwner}
					<div class="mt-8 flex flex-wrap items-center gap-3">
						<Button href={linkedInHref} target="_blank" rel="noreferrer" class="gap-2">
							Share on LinkedIn
							<ArrowRightIcon class="size-4" />
						</Button>
						<Button href={xHref} target="_blank" rel="noreferrer" variant="outline" class="gap-2">
							Share on X
						</Button>
						<Button onclick={copyLink} variant="outline" class="gap-2">
							{#if copied}
								<CheckIcon class="size-4" />
								Copied
							{:else}
								<LinkIcon class="size-4" />
								Copy link
							{/if}
						</Button>
					</div>
				{:else}
					<div class="mt-10 text-center">
						<p class="text-muted-foreground mb-4">
							Want one of these? The course is free and needs no account to start.
						</p>
						<Button href="/learn-sql" class="gap-2">
							Start learning SQL
							<ArrowRightIcon class="size-4" />
						</Button>
					</div>
				{/if}
			</div>
		</section>

		<FooterSection />
	</div>
</div>
