<script lang="ts">
  /**
   * Landing page after Dodo redirects post-payment. The webhook is what
   * actually creates the tenant row, and webhooks can take a few seconds
   * to arrive. We poll `/api/control/tenants` until we see a
   * provisioning-or-active tenant for this user, then redirect to its
   * overview.
   *
   * No session_id round-trip needed because we always create at most one
   * checkout-session-in-flight per user — the freshest provisioning
   * tenant on this account is the one the user just paid for.
   *
   * Visual aesthetic matches the onboarding flow's "LaunchedView":
   * amber + monospace, using shadcn tokens so it adapts to light/dark.
   */
  import { onMount } from "svelte";
  import { Check, LoaderCircle, TriangleAlert } from "lucide-svelte";
  import { remult } from "remult";
  import { Tenant } from "$lib/entities/tenant";

  let status = $state<"polling" | "found" | "failed" | "timeout">("polling");
  let foundTenant = $state<{ slug: string } | null>(null);
  let attempt = $state(0);

  const MAX_ATTEMPTS = 30; // ~60s at 2s intervals

  async function pollOnce(): Promise<boolean> {
    // Owner-scoped prefilter on the Tenant entity returns only this
    // user's tenants — no query args needed. Sort newest-first and pick
    // whichever is in a terminal-or-near-terminal state.
    const tenants = await remult
      .repo(Tenant)
      .find({ orderBy: { createdAt: "desc" } });
    const newest = tenants.find(
      (t) =>
        t.status === "provisioning" ||
        t.status === "active" ||
        t.status === "failed",
    );
    if (!newest) return false;
    foundTenant = newest;
    status = newest.status === "failed" ? "failed" : "found";
    return true;
  }

  onMount(() => {
    let cancelled = false;
    (async () => {
      while (!cancelled && attempt < MAX_ATTEMPTS) {
        if (await pollOnce()) {
          if (status === "failed") return;
          await new Promise((r) => setTimeout(r, 800));
          if (!cancelled && foundTenant)
            window.location.href = `/dashboard/${foundTenant.slug}`;
          return;
        }
        attempt++;
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) status = "timeout";
    })();
    return () => {
      cancelled = true;
    };
  });
</script>

<svelte:head>
  <title>Seaquel Cloud — Provisioning</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
  <div
    class="flex flex-col items-center gap-6 text-center max-w-[560px] px-6 py-12
           bg-[radial-gradient(50%_40%_at_50%_30%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]"
  >
    {#if status === "polling"}
      <div class="font-mono text-[11px] text-primary tracking-[0.12em] uppercase">
        Provisioning…
      </div>
      <div class="font-mono text-[18px] font-medium text-muted-foreground">
        your workspace is spinning up
      </div>
      <div class="font-mono flex items-center gap-2.5 text-muted-foreground text-[13px]">
        <LoaderCircle class="size-3.5 animate-spin" />
        {#if attempt < 3}
          starting machine
        {:else if attempt < 10}
          writing DNS record
        {:else}
          waiting on container health
        {/if}
      </div>
      <div class="text-[13px] text-muted-foreground/70 max-w-[400px] leading-normal">
        Payment received. Your dedicated container takes 10–30 seconds to boot.
      </div>
    {:else if status === "found" && foundTenant}
      <div
        class="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 tracking-[0.12em] uppercase"
      >
        Redirecting…
      </div>
      <div class="font-mono text-[32px] font-semibold tracking-tight break-all">
        <span class="text-primary">{foundTenant.slug}</span><span class="text-muted-foreground"
          >.seaquel.app</span
        >
      </div>
      <div class="font-mono flex items-center gap-2.5 text-muted-foreground text-[13px]">
        <Check class="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
        workspace is live
      </div>
    {:else if status === "failed" && foundTenant}
      <div class="font-mono text-[11px] text-destructive tracking-[0.12em] uppercase">
        Provisioning failed
      </div>
      <div class="font-mono text-[18px] font-medium text-muted-foreground">
        we couldn't finish spinning up your workspace
      </div>
      <div class="font-mono flex items-center gap-2.5 text-muted-foreground text-[13px]">
        <TriangleAlert class="size-3.5 text-destructive" strokeWidth={2} />
        <span class="text-primary">{foundTenant.slug}</span><span class="text-muted-foreground"
          >.seaquel.app</span
        >
      </div>
      <div class="text-[13px] text-muted-foreground/70 max-w-[400px] leading-normal">
        Your payment went through. Our team has been notified — email
        <a href="mailto:support@seaquel.app" class="text-primary underline underline-offset-2"
          >support@seaquel.app</a
        >
        with your license key and we'll either retry or refund within one business day.
      </div>
    {:else}
      <div class="font-mono text-[11px] text-destructive tracking-[0.12em] uppercase">
        Still working on it
      </div>
      <div class="font-mono text-[18px] font-medium text-muted-foreground">
        provisioning is taking longer than expected
      </div>
      <div class="text-[13px] text-muted-foreground/70 max-w-[400px] leading-normal">
        Payment received. Refresh in a minute, or
        <a href="/dashboard" class="text-primary underline underline-offset-2">
          go to the dashboard
        </a> to check status.
      </div>
    {/if}
  </div>
</div>
