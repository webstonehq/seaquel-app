<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { ExternalLinkIcon, LoaderCircleIcon, PlusIcon, UserIcon } from "lucide-svelte";
  import { TenantMember } from "$lib/entities/tenant-member";

  let { data } = $props();

  const tenant = $derived(data.tenant);
  const license = $derived(data.license);
  const isOwner = $derived(data.isOwner);

  const visible = $derived(
    (data.members ?? []).filter((m) => m.status !== "removed"),
  );
  const occupied = $derived(visible.length);
  const seatLimit = $derived(license?.seats ?? 0);
  const seatsLeft = $derived(Math.max(0, seatLimit - occupied));
  // Removal is owner-only and lives inside the tenant container so the
  // local user/session/member_license rows are torn down atomically.
  // Hide the link until provisioning has written `publicUrl`.
  const canManageInContainer = $derived(isOwner && !!tenant.publicUrl);

  let inviteEmail = $state("");
  let inviting = $state(false);
  let inviteError = $state("");

  async function invite(e: Event) {
    e.preventDefault();
    if (!isOwner) return;
    if (!inviteEmail.trim()) return;
    inviting = true;
    inviteError = "";
    try {
      await TenantMember.invite({
        tenantId: tenant.id,
        email: inviteEmail.trim(),
      });
      inviteEmail = "";
      await invalidateAll();
    } catch (err) {
      inviteError = err instanceof Error ? err.message : "Invite failed.";
    } finally {
      inviting = false;
    }
  }
</script>

{#if license}
  <div class="mb-4 text-sm text-muted-foreground">
    {occupied}/{seatLimit} seats used —
    {seatsLeft > 0 ? `${seatsLeft} remaining` : "no seats left"}.
    {#if license.seats > 1}
      Business plan invites teammates to this tenant.
    {:else}
      Individual plan — upgrade to add teammates.
    {/if}
  </div>
{/if}

<Card class="border-2 p-0 overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
      <tr>
        <th class="text-left font-medium px-4 py-2.5">Email</th>
        <th class="text-left font-medium px-4 py-2.5">Role</th>
        <th class="text-left font-medium px-4 py-2.5">Status</th>
      </tr>
    </thead>
    <tbody>
      {#each visible as m}
        <tr class="border-t border-border/60">
          <td class="px-4 py-3 font-mono text-[13px] flex items-center gap-2">
            <UserIcon class="size-3.5 text-muted-foreground" />
            {m.email}
          </td>
          <td class="px-4 py-3 capitalize">{m.role}</td>
          <td class="px-4 py-3 capitalize">
            <span
              class="text-xs"
              class:text-green-600={m.status === "active"}
              class:dark:text-green-400={m.status === "active"}
              class:text-amber-600={m.status === "pending"}
              class:dark:text-amber-400={m.status === "pending"}
            >
              {m.status}
            </span>
          </td>
        </tr>
      {/each}
      {#if visible.length === 0}
        <tr>
          <td colspan="3" class="px-4 py-6 text-center text-muted-foreground">
            No members yet.
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</Card>

{#if canManageInContainer}
  <p class="text-xs text-muted-foreground mt-3">
    To remove a member, open
    <a
      href={tenant.publicUrl}
      target="_blank"
      rel="noopener"
      class="underline inline-flex items-center gap-1"
    >
      {tenant.publicUrl}<ExternalLinkIcon class="size-3" />
    </a>
    and remove them from <span class="font-medium">Settings → Team</span>.
  </p>
{/if}

{#if isOwner && license && seatsLeft > 0}
  <Card class="border-2 p-5 mt-6">
    <h2 class="font-semibold mb-3">Invite a teammate</h2>
    <form onsubmit={invite} class="flex items-start gap-2">
      <input
        type="email"
        bind:value={inviteEmail}
        placeholder="alex@acme.co"
        required
        class="flex-1 bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-3 focus:ring-ring/20 focus:border-ring"
      />
      <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
        {#if inviting}
          <LoaderCircleIcon class="size-4 animate-spin mr-2" />
          Sending…
        {:else}
          <PlusIcon class="size-4 mr-2" />
          Invite
        {/if}
      </Button>
    </form>
    {#if inviteError}
      <p class="text-sm text-destructive mt-2">{inviteError}</p>
    {/if}
    <p class="text-xs text-muted-foreground mt-3">
      They'll be added to this tenant when they sign up with this email.
    </p>
  </Card>
{:else if isOwner && license}
  <p class="text-sm text-muted-foreground mt-6">
    All {license.seats} seats are currently occupied. Remove a member from
    your tenant's <span class="font-medium">Settings → Team</span> page to
    free a seat.
  </p>
{/if}
