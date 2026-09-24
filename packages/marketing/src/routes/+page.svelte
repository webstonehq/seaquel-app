<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import HeroSection from "$lib/components/hero-section.svelte";
	import SocialProof from "$lib/components/social-proof.svelte";
	import FeaturesSection from "$lib/components/features-section.svelte";
	import ComparisonSection from "$lib/components/comparison-section.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
</script>

<Seo
	title="Seaquel — Fast SQL Client for Postgres, MySQL, SQL Server & DuckDB"
	description="A fast, offline-first SQL client for Postgres, MySQL, MariaDB, SQLite, SQL Server and DuckDB. Browse schemas, visualize queries, and add AI assistance only when you want it."
/>

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
