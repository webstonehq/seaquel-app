<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { LoaderCircleIcon } from "lucide-svelte";
  import { Tenant } from "$lib/entities/tenant";

  let { licenseId }: { licenseId: string } = $props();

  let slug = $state("");
  // Platform is locked to "fly" in v1 — the Cloudflare adapter
  // (`$lib/server/control/platform/cloudflare.ts`) throws "not implemented"
  // on every method. The chooser UI below is kept (disabled, "coming soon")
  // so the layout is final and the next release just flips a feature flag.
  let platform = $state<"fly" | "cloudflare">("fly");
  let busy = $state(false);
  let errorMessage = $state("");

  /** Normalize whatever the user types into a valid slug on every keystroke. */
  function normalizeSlug(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") // spaces, underscores, symbols → hyphens
      .replace(/-{2,}/g, "-")      // collapse consecutive hyphens
      .replace(/^-+/, "")          // no leading hyphen
      .slice(0, 32);
  }

  function onSlugInput(e: Event) {
    const input = e.target as HTMLInputElement;
    slug = normalizeSlug(input.value);
    // Write back so the input reflects the normalized value.
    input.value = slug;
  }

  async function submit(e: Event) {
    e.preventDefault();
    // Strip trailing hyphen on submit (we allow it while typing so the
    // user can type "my-" before finishing "my-app").
    slug = slug.replace(/-+$/, "");
    if (slug.length < 3) {
      errorMessage = "Slug must be at least 3 characters.";
      return;
    }
    busy = true;
    errorMessage = "";

    try {
      await Tenant.create({ slug, licenseId, platform });
      window.location.href = "/dashboard/new/success";
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Failed to create tenant.";
    } finally {
      busy = false;
    }
  }
</script>

<form onsubmit={submit} class="flex flex-col gap-6">
  <Card class="border-2 p-6 flex flex-col gap-4">
    <div>
      <label class="text-sm font-medium mb-1.5 block" for="slug">Tenant slug</label>
      <div class="flex items-stretch">
        <input
          id="slug"
          type="text"
          value={slug}
          oninput={onSlugInput}
          required
          maxlength="32"
          placeholder="acme"
          class="flex-1 rounded-l-md border border-r-0 px-3 py-2 text-sm font-mono bg-background"
          disabled={busy}
        />
        <span
          class="inline-flex items-center rounded-r-md border bg-muted px-3 text-sm text-muted-foreground"
        >
          .seaquel.app
        </span>
      </div>
      <p class="text-xs text-muted-foreground mt-1.5">
        {#if slug}
          <span class="font-mono text-foreground">{slug}.seaquel.app</span>
        {:else}
          Letters, digits, and hyphens. This is your tenant's URL.
        {/if}
      </p>
    </div>

    <div>
      <span class="text-sm font-medium mb-1.5 block">Platform</span>
      <div class="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          class="text-left rounded-lg border-2 p-3 transition-colors {platform === 'fly' ? 'border-primary bg-primary/10' : ''}"
          onclick={() => (platform = "fly")}
          disabled={busy}
        >
          <div class="font-semibold">Fly.io</div>
          <div class="text-xs text-muted-foreground mt-0.5">Fast deploys, global edge network</div>
        </button>
        <button
          type="button"
          class="text-left rounded-lg border-2 p-3 opacity-60 cursor-not-allowed"
          aria-disabled="true"
          disabled
          title="Cloudflare provisioning is coming soon"
        >
          <div class="font-semibold flex items-center gap-2">
            Cloudflare
            <span class="text-[10px] font-medium uppercase tracking-wide rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
              Soon
            </span>
          </div>
          <div class="text-xs text-muted-foreground mt-0.5">Containers on Cloudflare's network</div>
        </button>
      </div>
    </div>
  </Card>

  {#if errorMessage}
    <div
      class="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3"
    >
      {errorMessage}
    </div>
  {/if}

  <Button type="submit" size="lg" disabled={busy || slug.length < 3}>
    {#if busy}
      <LoaderCircleIcon class="size-4 animate-spin mr-2" />
      Creating tenant…
    {:else}
      Create tenant
    {/if}
  </Button>
</form>
