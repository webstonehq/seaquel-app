<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import HeroSection from "$lib/components/hero-section.svelte";
	import SocialProof from "$lib/components/social-proof.svelte";
	import FeaturesSection from "$lib/components/features-section.svelte";
	import ComparisonSection from "$lib/components/comparison-section.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
</script>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<!-- Add padding-top to account for fixed header -->
	<div class="pt-16">
		<HeroSection />
		<SocialProof />
		<FeaturesSection />
		<ComparisonSection />
		<CtaSection />
		<FooterSection />
	</div>
</div>
