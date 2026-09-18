<script lang="ts">
  import { onMount } from "svelte";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { ExternalLinkIcon, LoaderCircleIcon, Trash2Icon } from "lucide-svelte";
  import { Tenant } from "$lib/entities/tenant";

  let { data } = $props();
  let tenant = $derived({ ...data.tenant });
  let lastEvent = $state<string | null>(null);
  let confirmingDelete = $state(false);
  let deleting = $state(false);

  async function refresh() {
    try {
      const res = await fetch(`/api/control/tenants/${tenant.id}/status`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        status: string;
        publicUrl: string;
        lastEvent: string | null;
      };
      tenant = { ...tenant, status: data.status, publicUrl: data.publicUrl };
      lastEvent = data.lastEvent;
    } catch {}
  }

  // Poll while provisioning so the UI flips to "active" without manual refresh.
  onMount(() => {
    let cancelled = false;
    (async () => {
      while (!cancelled && tenant.status === "provisioning") {
        await refresh();
        await new Promise((r) => setTimeout(r, 2000));
      }
    })();
    return () => {
      cancelled = true;
    };
  });

  async function deleteTenant() {
    deleting = true;
    try {
      await Tenant.softDelete(tenant.id);
      window.location.href = "/dashboard";
    } catch {
      // BackendMethod throws on auth / ownership failure; the dashboard
      // shell will redirect on next navigation. No inline error surface
      // here — the danger-zone button is only rendered for owners.
    } finally {
      deleting = false;
    }
  }

  function statusColor(status: string): string {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "provisioning":
        return "text-amber-600 dark:text-amber-400";
      case "suspended":
        return "text-red-600 dark:text-red-400";
      case "deleting":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  }
</script>

<div class="grid gap-6 md:grid-cols-2">
  <Card class="border-2 p-6">
    <h2 class="font-semibold mb-4">Status</h2>
    <dl class="text-sm space-y-3">
      <div class="flex items-center justify-between">
        <dt class="text-muted-foreground">State</dt>
        <dd class="font-medium {statusColor(tenant.status)} capitalize">
          {tenant.status}
          {#if tenant.status === "provisioning"}
            <LoaderCircleIcon class="inline-block size-3.5 animate-spin ml-1" />
          {/if}
        </dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-muted-foreground">Platform</dt>
        <dd class="capitalize">{tenant.platform}</dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-muted-foreground">Region</dt>
        <dd class="font-mono">{tenant.region}</dd>
      </div>
      {#if lastEvent}
        <div class="flex items-center justify-between">
          <dt class="text-muted-foreground">Last event</dt>
          <dd class="font-mono text-xs">{lastEvent}</dd>
        </div>
      {/if}
    </dl>
  </Card>

  <Card class="border-2 p-6">
    <h2 class="font-semibold mb-4">Access</h2>
    {#if tenant.status === "active" && tenant.publicUrl}
      <a
        href={tenant.publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary hover:underline inline-flex items-center gap-1.5 font-mono text-sm break-all"
      >
        {tenant.publicUrl}
        <ExternalLinkIcon class="size-3.5 shrink-0" />
      </a>
      <p class="text-xs text-muted-foreground mt-3">
        First visit to your tenant URL: sign up — that user automatically
        becomes the Owner of the tenant. Add teammates from inside the
        tenant's Settings.
      </p>
    {:else}
      <p class="text-sm text-muted-foreground">
        Your tenant URL becomes available once provisioning completes.
      </p>
    {/if}
  </Card>
</div>

<Card class="border-2 p-6 mt-6">
  <h2 class="font-semibold mb-2 text-destructive">Danger zone</h2>
  <p class="text-sm text-muted-foreground mb-4">
    Deleting a tenant removes the public URL and stops the container. Data
    is retained for 30 days during a soft-delete grace period — contact
    support to restore. After that, everything is wiped.
  </p>
  {#if !confirmingDelete}
    <Button
      variant="outline"
      onclick={() => (confirmingDelete = true)}
      disabled={deleting}
    >
      <Trash2Icon class="size-4 mr-2" />
      Delete tenant
    </Button>
  {:else}
    <div class="flex items-center gap-2">
      <Button variant="ghost" onclick={() => (confirmingDelete = false)}>
        Cancel
      </Button>
      <Button
        onclick={deleteTenant}
        disabled={deleting}
        class="bg-destructive text-white hover:bg-destructive/90"
      >
        {#if deleting}
          <LoaderCircleIcon class="size-4 animate-spin mr-2" />
          Deleting…
        {:else}
          Confirm delete
        {/if}
      </Button>
    </div>
  {/if}
</Card>
