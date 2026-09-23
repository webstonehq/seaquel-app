<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon } from "lucide-svelte";
	import Seo from "$lib/components/seo.svelte";
	import CertificateClaim from "$lib/components/certificate-claim.svelte";
	import { exportProgress } from "$lib/learn-sql/progress";
	import { onMount } from "svelte";

	// The claim lives on its own page rather than on /learn-sql: that page
	// auto-opens the demo in a fullscreen overlay, which would cover the card
	// on every visit and swallow the click.
	let solvedCount = $state(0);

	onMount(() => {
		solvedCount = Object.values(exportProgress()).reduce((n, ids) => n + ids.length, 0);
	});
</script>

<Seo
	title="Your SQL Course Certificate | Seaquel"
	description="Claim your certificate for completing the Seaquel SQL course: 11 lessons and 29 hands-on PostgreSQL challenges."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<section class="py-16 md:py-24">
			<div class="container mx-auto px-4 md:px-6 max-w-2xl">
				<Button href="/learn-sql" variant="ghost" size="sm" class="-ml-2 gap-2 mb-8">
					<ArrowLeftIcon class="size-4" />
					All lessons
				</Button>

				<h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your certificate</h1>
				<p class="text-muted-foreground mb-8">
					Finish every challenge in the course and claim a certificate with your name on it,
					ready to share.
				</p>

				<CertificateClaim {solvedCount} />
			</div>
		</section>

		<FooterSection />
	</div>
</div>
