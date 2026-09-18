<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { ExternalLinkIcon, PlusIcon, KeyIcon } from "lucide-svelte";

  let { data } = $props();

  const licenses = $derived(data.licenses ?? []);
  const tenants = $derived(data.tenants ?? []);

  // Index tenants by licenseId so each license card can show its linked
  // tenant inline without an N+1 lookup at render time.
  const tenantByLicense = $derived(
    Object.fromEntries(tenants.filter((t) => t.licenseId).map((t) => [t.licenseId, t])),
  );

  function planLabel(seats: number): string {
    return seats > 1 ? `Business (${seats} seats)` : "Individual";
  }

  /**
   * UI-level license status. The DB `status` mirrors Dodo (active /
   * past_due / canceled / expired), but a Dodo-active subscription whose
   * `license_key.created` event hasn't landed yet shouldn't read as a
   * green "Active" — the user can't actually use it. Surface that
   * gap as a separate "Pending" state.
   */
  function licenseDisplayStatus(l: { status: string; licenseKey: string }): string {
    if (l.status === "active" && !l.licenseKey) return "pending";
    return l.status;
  }

  function statusColor(status: string): string {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "pending":
      case "provisioning":
      case "past_due":
        return "text-amber-600 dark:text-amber-400";
      case "suspended":
      case "canceled":
      case "expired":
        return "text-red-600 dark:text-red-400";
      case "deleting":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  }
</script>

<div class="flex items-center justify-between mb-8">
  <h1 class="text-2xl font-semibold tracking-tight">Your licenses</h1>
  {#if licenses.length > 0}
    <Button href="/pricing">
      <PlusIcon class="size-4 mr-2" />
      Add license
    </Button>
  {/if}
</div>

{#if licenses.length === 0}
  <Card class="border-2 p-12 text-center">
    <h2 class="text-xl font-semibold mb-2">No licenses yet</h2>
    <p class="text-muted-foreground mb-6 max-w-md mx-auto">
      A Seaquel license unlocks commercial desktop use and one Cloud
      tenant. Each license you buy gives you a new tenant.
    </p>
    <div class="flex items-center justify-center gap-3">
      <Button href="/pricing" size="lg">
        Buy a license
      </Button>
      <Button href="/dashboard/activate" variant="outline" size="lg">
        <KeyIcon class="size-4 mr-2" />
        I have a key
      </Button>
    </div>
  </Card>
{:else}
  <div class="flex flex-col gap-4">
    {#each licenses as l}
      {@const tenant = tenantByLicense[l.id]}
      {@const displayStatus = licenseDisplayStatus(l)}
      <Card class="border-2 p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="font-semibold">{planLabel(l.seats)} license</span>
            <span class="text-xs font-medium {statusColor(displayStatus)} capitalize">
              {displayStatus}
            </span>
          </div>
          {#if l.licenseKey}
            <code class="font-mono text-xs text-muted-foreground break-all">{l.licenseKey}</code>
          {:else}
            <span class="text-xs text-muted-foreground">Activation key pending — check your email.</span>
          {/if}
          {#if tenant}
            <div class="text-sm text-muted-foreground mt-1">
              Tenant:
              <a href={`/dashboard/${tenant.slug}`} class="font-mono text-foreground hover:underline">
                {tenant.slug}
              </a>
              <span class="mx-1.5">·</span>
              <span class="capitalize {statusColor(tenant.status)}">{tenant.status}</span>
            </div>
          {/if}
        </div>

        <div class="flex items-center gap-2 shrink-0">
          {#if !tenant && l.status === "active" && !l.licenseKey}
            <!-- Webhook landed `subscription.active` but `license_key.created`
                 hasn't arrived yet (or the user came in via an unverified
                 path). Push them through manual activation before they can
                 stand up a tenant — same form the desktop app uses. -->
            <Button href="/dashboard/activate" variant="outline">
              <KeyIcon class="size-4 mr-2" />
              Verify license
            </Button>
          {:else if !tenant && l.status === "active"}
            <Button href={`/dashboard/new?licenseId=${l.id}`}>
              <PlusIcon class="size-4 mr-2" />
              Provision tenant
            </Button>
          {:else if tenant && tenant.status === "active" && tenant.publicUrl}
            <Button href={`/dashboard/${tenant.slug}`} variant="outline">
              Manage
            </Button>
            <Button href={tenant.publicUrl} variant="outline" target="_blank" rel="noopener noreferrer">
              Open
              <ExternalLinkIcon class="size-3.5 ml-2" />
            </Button>
          {:else if tenant}
            <Button href={`/dashboard/${tenant.slug}`} variant="outline">
              Open
            </Button>
          {/if}
        </div>
      </Card>
    {/each}
  </div>
{/if}
