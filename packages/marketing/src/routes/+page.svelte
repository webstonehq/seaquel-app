<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import HeroSection from "$lib/components/hero-section.svelte";
	import SocialProof from "$lib/components/social-proof.svelte";
	import FeaturesSection from "$lib/components/features-section.svelte";
	import ComparisonSection from "$lib/components/comparison-section.svelte";
	import CtaSection from "$lib/components/cta-section.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { FOUNDER } from "$lib/founder";

	let { data } = $props();

	const origin = "https://seaquel.app";
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Seaquel",
		url: origin,
		logo: `${origin}/seaquel-logo.png`,
		email: "support@seaquel.app",
		founder: { "@type": "Person", name: FOUNDER.name, sameAs: [FOUNDER.linkedin] },
		sameAs: ["https://github.com/webstonehq/seaquel", "https://discord.gg/QuzUESE8x4"],
	});
</script>

<Seo
	title="Seaquel — Fast, Offline SQL Client for Postgres & More"
	description="A fast, offline-first SQL client for Postgres, MySQL, MariaDB, SQLite, SQL Server and DuckDB. Browse schemas, visualize queries, and add AI assistance only when you want it."
/>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<!-- Add padding-top to account for fixed header -->
	<div class="pt-16">
		<HeroSection downloads={data.downloads} />
		<SocialProof />
		<FeaturesSection />
		<ComparisonSection />
		<CtaSection />
		<FooterSection />
	</div>
</div>
