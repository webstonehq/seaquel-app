<script lang="ts">
	import { setApp } from "$lib/hooks/app.svelte.js";
	import NavHeader from "$lib/components/nav-header.svelte";
	import HeroSection from "$lib/components/hero-section.svelte";
	import FeaturesSection from "$lib/components/features-section.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";

	// Set app hook with system theme by default
	const app = setApp();
</script>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<!-- Add padding-top to account for fixed header -->
	<div class="pt-16">
		<HeroSection />
		<FeaturesSection />
		<CtaSection />
		<FooterSection />
	</div>
</div>
