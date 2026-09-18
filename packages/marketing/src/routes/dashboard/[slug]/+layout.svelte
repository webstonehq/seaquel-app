<script lang="ts">
  import { page } from "$app/state";
  let { children, data } = $props();
  const tenant = $derived(data.tenant);

  const tabs = $derived([
    { label: "Overview", href: `/dashboard/${tenant.slug}` },
    { label: "Members", href: `/dashboard/${tenant.slug}/members` },
    // Self-hosted tenants get an extra tab for managing the offline
    // license bundle. Cloud tenants are always online against the
    // control plane and have no bundle to download.
    ...(tenant.platform === "self-hosted"
      ? [{ label: "Offline bundle", href: `/dashboard/${tenant.slug}/airgap` }]
      : []),
    ...(data.isOwner
      ? [{ label: "Billing", href: `/dashboard/${tenant.slug}/billing` }]
      : []),
  ]);
</script>

<div class="mb-8 flex items-center justify-between">
  <div>
    <p class="text-sm text-muted-foreground mb-1">
      <a href="/dashboard" class="hover:underline">Tenants</a> /
      <span class="font-mono">{tenant.slug}</span>
    </p>
    <h1 class="text-2xl font-semibold tracking-tight">{tenant.slug}</h1>
  </div>
</div>

<nav class="flex items-center gap-1 mb-6 border-b">
  {#each tabs as t (t.href)}
    <a
      href={t.href}
      class="px-4 py-2 text-sm border-b-2 -mb-px transition-colors"
      class:border-primary={page.url.pathname === t.href}
      class:text-foreground={page.url.pathname === t.href}
      class:border-transparent={page.url.pathname !== t.href}
      class:text-muted-foreground={page.url.pathname !== t.href}
    >
      {t.label}
    </a>
  {/each}
</nav>

{@render children()}
