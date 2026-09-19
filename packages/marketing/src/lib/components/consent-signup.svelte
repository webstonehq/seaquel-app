<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { MailIcon, CheckIcon, AlertCircleIcon } from "lucide-svelte";

	let {
		heading,
		description,
		consentLabel,
		purpose,
		source,
		submitLabel = "Count me in",
	}: {
		heading: string;
		description: string;
		/** Must match the server wording for `purpose` in $lib/server/consent. */
		consentLabel: string;
		purpose: "research" | "newsletter";
		source: string;
		submitLabel?: string;
	} = $props();

	let email = $state("");
	let consent = $state(false);
	let submitting = $state(false);
	let submitted = $state(false);
	let failed = $state(false);

	async function onSubmit(event: Event) {
		event.preventDefault();
		if (submitting) return;
		submitting = true;
		failed = false;
		try {
			const res = await fetch("/api/consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, purpose, source, consent }),
			});
			// The endpoint returns 200 for repeat signups too, so a duplicate
			// reads as success here without this component knowing about it.
			if (res.ok) {
				submitted = true;
				email = "";
				consent = false;
			} else {
				failed = true;
			}
		} catch {
			// Previously this reported success on failure, which silently lost
			// exactly the people who wanted to be reached.
			failed = true;
		}
		submitting = false;
	}
</script>

<div class="mx-auto max-w-2xl rounded-xl border bg-card p-8 md:p-10 text-center shadow-sm">
	<div
		class="inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 p-2 mb-4"
	>
		<MailIcon class="size-5 text-primary" />
	</div>
	<h3 class="text-2xl font-bold tracking-tight mb-2">{heading}</h3>
	<p class="text-muted-foreground mb-6">{description}</p>

	{#if submitted}
		<div
			class="inline-flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 text-primary px-4 py-2.5 text-sm font-medium"
		>
			<CheckIcon class="size-4" />
			Thanks — you're on the list.
		</div>
	{:else}
		<form class="mx-auto max-w-md space-y-4" onsubmit={onSubmit}>
			<div class="flex flex-col sm:flex-row gap-2">
				<input
					type="email"
					required
					bind:value={email}
					placeholder="you@company.com"
					disabled={submitting}
					class="flex-1 rounded-md border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
				/>
				<Button type="submit" disabled={submitting}>
					{submitting ? "Saving..." : submitLabel}
				</Button>
			</div>

			<!-- Never pre-ticked: a pre-ticked box is not consent. `required`
			     lets the browser block submission without custom validation. -->
			<label class="flex items-start gap-2.5 text-left text-sm text-muted-foreground">
				<input
					type="checkbox"
					required
					bind:checked={consent}
					disabled={submitting}
					class="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
				/>
				<span>{consentLabel}</span>
			</label>

			{#if failed}
				<p
					class="flex items-center justify-center gap-2 text-sm text-destructive"
					role="alert"
				>
					<AlertCircleIcon class="size-4" />
					That didn't go through. Please try again.
				</p>
			{/if}
		</form>
	{/if}
</div>
