<script lang="ts">
	import ConsentSignup from "$lib/components/consent-signup.svelte";
	import { CONSENT_COPY } from "$lib/consent-copy";

	// Thin wrapper kept so blog callers don't change. All the behaviour —
	// consent capture, real error handling — lives in ConsentSignup.
	let {
		heading = "Get new posts in your inbox",
		description = "One email a week, likely less. No spam, no sales pitches — just the new writing.",
		source,
	}: {
		heading?: string;
		description?: string;
		source: string;
	} = $props();
</script>

<ConsentSignup
	purpose="newsletter"
	{source}
	{heading}
	{description}
	consentLabel={CONSENT_COPY.newsletter}
	submitLabel="Subscribe"
/>
