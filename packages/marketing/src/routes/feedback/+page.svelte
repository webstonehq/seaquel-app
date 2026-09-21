<script lang="ts">
	import { page } from "$app/state";
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import ConsentSignup from "$lib/components/consent-signup.svelte";
	import { CONSENT_COPY } from "$lib/consent-copy";
	import LogoDiscord from "$lib/components/logo-discord.svelte";
	import { MailIcon } from "lucide-svelte";

	// `?from=` attributes the signup to whichever CTA sent them here, so
	// it's visible which surface actually works. Sanitised because it
	// lands in a stored `source` column with a 64-char server limit.
	const from = $derived(
		(page.url.searchParams.get("from") ?? "")
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, "")
			.slice(0, 32),
	);
	const source = $derived(from ? `feedback:${from}` : "feedback");
</script>

<Seo
	title="Help shape Seaquel"
	description="We're talking to people using Seaquel about what works, what's missing, and what it's worth. Two questions, ten minutes."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<section class="py-20 md:py-28 bg-linear-to-b from-primary/10 via-background to-background">
			<div class="container mx-auto px-4 md:px-6 text-center max-w-3xl">
				<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
					Help shape Seaquel
				</h1>
				<p class="text-lg md:text-xl text-muted-foreground">
					Seaquel is built by a very small team, and the roadmap comes almost entirely from
					what people tell us. We'd like to hear from you.
				</p>
			</div>
		</section>

		<section class="pb-8">
			<div class="container mx-auto px-4 md:px-6 max-w-2xl">
				<div class="prose prose-neutral dark:prose-invert max-w-none mb-10">
					<p>
						Two questions, about ten minutes, by email, a call, or on Discord — whichever
						suits:
					</p>
					<ul>
						<li>What are you actually using Seaquel for, and where does it get in your way?</li>
						<li>What would it be worth to you, and what would justify that?</li>
					</ul>
					<p>
						Nothing is a commitment. If you'd rather only answer the first one, that's
						genuinely useful too.
					</p>
				</div>
			</div>
		</section>

		<section class="pb-16">
			<div class="container mx-auto px-4 md:px-6">
				<ConsentSignup
					purpose="research"
					{source}
					heading="Leave your email"
					description="We'll get in touch once, maybe twice. That's it."
					consentLabel={CONSENT_COPY.research}
					submitLabel="Count me in"
				/>
			</div>
		</section>

		<section class="pb-20 md:pb-28">
			<div class="container mx-auto px-4 md:px-6 max-w-2xl text-center">
				<p class="text-sm text-muted-foreground mb-4">
					Prefer not to leave an email? Join the Discord and answer the two questions there —
					post in the server or send us a DM. Or just email us.
				</p>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<a
						href="/discord"
						target="_blank"
						rel="noopener"
						class="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
					>
						<LogoDiscord class="size-4 fill-current" />
						Answer on Discord
					</a>
					<a
						href="mailto:seaquel@webstonehq.com?subject=Seaquel%20feedback"
						class="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
					>
						<MailIcon class="size-4" />
						Email us directly
					</a>
				</div>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
