<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CheckIcon, MailXIcon } from "lucide-svelte";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const token = $derived(page.url.searchParams.get("t") ?? "");
	const done = $derived(data.state === "done" || form?.state === "done");
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Unsubscribe · Seaquel</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col">
	<NavHeader />

	<main class="flex-1 pt-16 flex items-center justify-center px-4 py-20">
		<div class="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
			{#if done}
				<div
					class="inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 p-2 mb-4"
				>
					<CheckIcon class="size-5 text-primary" />
				</div>
				<h1 class="text-2xl font-bold tracking-tight mb-2">You're unsubscribed</h1>
				<p class="text-muted-foreground">
					We won't email you again. Thanks for giving Seaquel a look.
				</p>
			{:else}
				<div
					class="inline-flex items-center justify-center rounded-full bg-muted p-2 mb-4"
				>
					<MailXIcon class="size-5 text-muted-foreground" />
				</div>
				<h1 class="text-2xl font-bold tracking-tight mb-2">Unsubscribe?</h1>
				<p class="text-muted-foreground mb-6">
					<span class="font-medium text-foreground">{data.email}</span> will stop receiving
					{data.purposeLabel}.
				</p>
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<input type="hidden" name="token" value={token} />
					<Button type="submit" disabled={submitting} class="w-full">
						{submitting ? "Unsubscribing..." : "Yes, unsubscribe me"}
					</Button>
				</form>
				{#if form?.state === "error"}
					<p class="mt-4 text-sm text-destructive" role="alert">
						Something went wrong. Please try again, or reply to the email and we'll remove
						you by hand.
					</p>
				{/if}
			{/if}
		</div>
	</main>

	<FooterSection />
</div>
