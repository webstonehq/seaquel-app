<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { AwardIcon, Loader2Icon } from "lucide-svelte";
	import { Certificate } from "$lib/entities/certificate";
	import { exportProgress } from "$lib/learn-sql/progress";
	import { TOTAL_CHALLENGES } from "$lib/learn-sql/challenges";
	import { authClient } from "$lib/auth-client";
	import { onMount } from "svelte";

	interface Props {
		solvedCount: number;
	}

	let { solvedCount }: Props = $props();

	// This page is prerendered, so `data.user` from the root layout is baked in
	// as null for everyone. The session has to be read in the browser.
	let user = $state<{ id: string; name?: string } | null>(null);
	let checkedSession = $state(false);
	let busy = $state(false);
	let errorMessage = $state("");

	onMount(async () => {
		try {
			const { data } = await authClient.getSession();
			if (data?.user) {
				user = { id: data.user.id, name: data.user.name };
			}
		} catch {
			/* signed out, or the session endpoint is unreachable */
		} finally {
			checkedSession = true;
		}
	});

	const finished = $derived(solvedCount >= TOTAL_CHALLENGES);

	// Progress lives in this browser, so claiming has to hand it to the server.
	// Signing in first would lose the page, hence the round trip through
	// ?redirect= back to here.
	//
	// Back to the dedicated claim page, not /learn-sql: that page auto-opens
	// the demo in a fullscreen overlay, which would cover this card on arrival.
	const signInHref = `/dashboard/signin?redirect=${encodeURIComponent("/learn-sql/certificate")}`;

	async function claim() {
		busy = true;
		errorMessage = "";
		try {
			const { id } = await Certificate.claim(exportProgress());
			window.location.href = `/learn-sql/certificate/${id}`;
		} catch (err) {
			errorMessage = typeof err === "string" ? err : ((err as Error)?.message ?? "Claim failed.");
			busy = false;
		}
	}
</script>

<div class="rounded-lg border bg-card p-6 md:p-8">
	<div class="flex items-start gap-3 mb-3">
		<AwardIcon class="size-5 text-amber-500 mt-0.5 shrink-0" />
		<div>
			<h3 class="text-xl font-semibold tracking-tight">Certificate of completion</h3>
			<p class="text-sm text-muted-foreground mt-1">
				{#if finished}
					All {TOTAL_CHALLENGES} challenges solved. Claim a shareable certificate with your name on it.
				{:else}
					Solve all {TOTAL_CHALLENGES} challenges to unlock a shareable certificate.
					You're at {solvedCount}.
				{/if}
			</p>
		</div>
	</div>

	{#if finished}
		<div class="mt-5">
			{#if !checkedSession}
				<p class="text-sm text-muted-foreground">Checking your session…</p>
			{:else if !user}
				<p class="text-sm text-muted-foreground mb-3">
					Your progress is saved in this browser. Sign in to attach it to an account and issue the
					certificate.
				</p>
				<Button href={signInHref}>Sign in to claim</Button>
			{:else}
				<!--
					The name is not editable here and is not sent with the claim: the
					server reads it from the signed-in profile, so a certificate can
					only ever carry the name on the account that earned it.
				-->
				<p class="text-sm text-muted-foreground mb-1.5">Name on the certificate</p>
				<p class="text-lg font-medium mb-1">{user.name || "(no name on your profile)"}</p>
				<p class="text-xs text-muted-foreground mb-4">
					Taken from your account.
					<a href="/dashboard" class="text-primary hover:underline">Change it in your profile</a>
					and claim again to update the certificate.
				</p>
				<Button onclick={claim} disabled={busy || !user.name} class="gap-2">
					{#if busy}
						<Loader2Icon class="size-4 animate-spin" />
						Issuing…
					{:else}
						Claim certificate
					{/if}
				</Button>
			{/if}

			{#if errorMessage}
				<p class="mt-3 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
			{/if}
		</div>
	{:else}
		<div class="mt-4 h-2 rounded-full bg-muted overflow-hidden">
			<div
				class="h-full bg-amber-500 transition-all"
				style="width: {Math.round((solvedCount / TOTAL_CHALLENGES) * 100)}%"
			></div>
		</div>
	{/if}
</div>
