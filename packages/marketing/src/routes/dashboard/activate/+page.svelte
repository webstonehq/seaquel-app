<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { LoaderCircleIcon, KeyRoundIcon } from "lucide-svelte";

  let licenseKey = $state("");
  let busy = $state(false);
  let errorMessage = $state("");

  async function activate(e: Event) {
    e.preventDefault();
    if (!licenseKey.trim()) return;
    busy = true;
    errorMessage = "";

    try {
      const res = await fetch("/api/control/licenses/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        errorMessage = data.message ?? "Activation failed.";
        return;
      }
      // License linked — go to the dashboard.
      window.location.href = "/dashboard";
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Unknown error.";
    } finally {
      busy = false;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <div class="inline-flex items-center justify-center size-14 rounded-full bg-primary/10 mb-6">
    <KeyRoundIcon class="size-7 text-primary" />
  </div>

  <h1 class="text-3xl font-semibold tracking-tight mb-2">
    Activate your license
  </h1>
  <p class="text-muted-foreground mb-8">
    Enter the license key from your purchase confirmation email. If you
    haven't purchased a license yet,
    <a href="/pricing" class="underline">pick a plan on the pricing page</a>.
  </p>

  <Card class="border-2 p-6">
    <form onsubmit={activate} class="flex flex-col gap-4">
      <div>
        <label class="text-sm font-medium mb-1.5 block" for="license-key"
          >License key</label
        >
        <input
          id="license-key"
          type="text"
          bind:value={licenseKey}
          required
          autocomplete="off"
          spellcheck="false"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          class="w-full rounded-md border px-3 py-2 text-sm font-mono bg-background"
          disabled={busy}
        />
      </div>

      {#if errorMessage}
        <div
          class="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3"
        >
          {errorMessage}
        </div>
      {/if}

      <Button type="submit" disabled={busy || !licenseKey.trim()}>
        {#if busy}
          <LoaderCircleIcon class="size-4 animate-spin mr-2" />
          Validating…
        {:else}
          Activate
        {/if}
      </Button>
    </form>
  </Card>
</div>
