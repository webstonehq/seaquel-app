<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { ExternalLinkIcon } from "lucide-svelte";

  let { data } = $props();
  const tenant = $derived(data.tenant);
  const portalLink = $derived(data.portalLink);
</script>

<Card class="border-2 p-6">
  <h2 class="font-semibold mb-2">Billing for {tenant.slug}</h2>
  <p class="text-sm text-muted-foreground mb-6">
    Manage your payment method, view invoices, switch plans, or cancel —
    all from the Dodo Payments billing portal.
  </p>

  {#if portalLink}
    <Button
      href={portalLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open billing portal
      <ExternalLinkIcon class="size-4 ml-2" />
    </Button>
  {:else}
    <p class="text-sm text-muted-foreground">
      Billing portal not available yet — your payment account will be
      linked automatically once the purchase webhook is processed. Let's be honest though... that should have happened by the time you reach this page. Please contact us and we'll help you out.
    </p>
  {/if}
</Card>
