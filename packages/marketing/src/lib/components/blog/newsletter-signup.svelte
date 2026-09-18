<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { MailIcon, CheckIcon } from "lucide-svelte";

	let {
		heading = "Get new posts in your inbox",
		description = "One email a week, likely less. No spam, no sales pitches — just the new writing.",
		source,
	}: {
		heading?: string;
		description?: string;
		source: string;
	} = $props();

	let email = $state("");
	let submitted = $state(false);
	let submitting = $state(false);

	async function onSubmit(event: Event) {
		event.preventDefault();
		if (!email || submitting) return;
		submitting = true;
		try {
			// Posts to /api/newsletter/subscribe which applies KV-backed
			// rate limiting and email validation before inserting. The
			// endpoint swallows duplicates and returns 200 for the same
			// success UX as a first-time signup.
			const res = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, source }),
			});
			if (!res.ok) {
				console.debug("[newsletter-signup] non-OK response", res.status);
			}
		} catch (err) {
			// Network failure — surface as success per product decision to
			// keep the UX frictionless.
			console.debug("[newsletter-signup] request failed; showing success", err);
		}
		submitted = true;
		submitting = false;
		email = "";
	}
</script>

<div class="mx-auto max-w-2xl rounded-xl border bg-card p-8 md:p-10 text-center shadow-sm">
	<div class="inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 p-2 mb-4">
		<MailIcon class="size-5 text-primary" />
	</div>
	<h3 class="text-2xl font-bold tracking-tight mb-2">{heading}</h3>
	<p class="text-muted-foreground mb-6">{description}</p>

	{#if submitted}
		<div class="inline-flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 text-primary px-4 py-2.5 text-sm font-medium">
			<CheckIcon class="size-4" />
			Thanks — you're subscribed.
		</div>
	{:else}
		<form class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onsubmit={onSubmit}>
			<input
				type="email"
				required
				bind:value={email}
				placeholder="you@company.com"
				disabled={submitting}
				class="flex-1 rounded-md border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
			/>
			<Button type="submit" disabled={submitting}>
				{submitting ? "Subscribing..." : "Subscribe"}
			</Button>
		</form>
	{/if}
</div>
