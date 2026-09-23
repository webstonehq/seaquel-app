<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { LoaderCircleIcon } from "lucide-svelte";
  import { authClient } from "$lib/auth-client";
  import { remult } from "remult";
  import { License } from "$lib/entities/license";
  import TenantForm from "$lib/components/dashboard/tenant-form.svelte";
  import { page } from "$app/state";

  // Signing up from somewhere other than the dashboard (claiming a course
  // certificate, for instance) should return there rather than dropping the
  // person into the license wizard, which has nothing to do with why they
  // came. Mirrors the ?redirect= that /dashboard/signin already honours.
  const redirectTo = $derived(page.url.searchParams.get("redirect"));

  let step = $state<"account" | "license" | "tenant">("account");
  let name = $state("");
  let email = $state("");
  let password = $state("");
  let licenseKey = $state("");
  let busy = $state(false);
  let errorMessage = $state("");
  let activeLicenseId = $state("");

  async function createAccount(e: Event) {
    e.preventDefault();
    busy = true;
    errorMessage = "";
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    busy = false;
    if (error) {
      errorMessage = error.message ?? "Sign-up failed.";
      return;
    }
    if (redirectTo) {
      window.location.href = redirectTo;
      return;
    }
    step = "license";
  }

  async function activateLicense(e: Event) {
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
      // Grab the freshly-claimed license id so the tenant step can bind
      // the new tenant to it. The activate endpoint doesn't echo the id,
      // so re-read the owner-scoped Remult view. A user arriving here
      // just activated one license — picking the newest "active" row is
      // unambiguous.
      const licenses = await remult
        .repo(License)
        .find({ where: { status: "active" }, orderBy: { createdAt: "desc" } });
      if (!licenses[0]) {
        errorMessage = "Activation succeeded but no license was found. Refresh and try again.";
        return;
      }
      activeLicenseId = licenses[0].id;
      step = "tenant";
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Unknown error.";
    } finally {
      busy = false;
    }
  }

  const titles: Record<string, string> = {
    account: "Create your account",
    license: "Activate your license",
    tenant: "Create your first tenant",
  };

  const descriptions: Record<string, string> = {
    account:
      "One Seaquel account, multiple tenants. Pick a password you don't use anywhere else.",
    license:
      "Enter the license key from your purchase confirmation email.",
    tenant:
      "Pick a slug for your tenant's subdomain. Your container spins up automatically and you'll be redirected to it in a few seconds.",
  };
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-3xl font-semibold tracking-tight mb-2">
    {titles[step]}
  </h1>
  <p class="text-muted-foreground mb-8">
    {descriptions[step]}
  </p>

  {#if step === "account"}
    <Card class="border-2 p-6">
      <form onsubmit={createAccount} class="flex flex-col gap-4">
        <div>
          <label class="text-sm font-medium mb-1.5 block" for="name">Name</label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            autocomplete="name"
            class="w-full rounded-md border px-3 py-2 text-sm bg-background"
            disabled={busy}
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1.5 block" for="email">Email</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            class="w-full rounded-md border px-3 py-2 text-sm bg-background"
            disabled={busy}
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1.5 block" for="password"
            >Password</label
          >
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full rounded-md border px-3 py-2 text-sm bg-background"
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
        <Button type="submit" disabled={busy}>
          {#if busy}
            <LoaderCircleIcon class="size-4 animate-spin mr-2" />
            Creating…
          {:else}
            Continue
          {/if}
        </Button>
        <p class="text-sm text-muted-foreground text-center">
          Already have an account? <a
            href={redirectTo
              ? `/dashboard/signin?redirect=${encodeURIComponent(redirectTo)}`
              : "/dashboard/signin"}
            class="underline"
            >Sign in</a
          >.
        </p>
      </form>
    </Card>
  {:else if step === "license"}
    <Card class="border-2 p-6">
      <form onsubmit={activateLicense} class="flex flex-col gap-4">
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
        <p class="text-sm text-muted-foreground text-center">
          Don't have a license? <a href="/pricing" class="underline"
            >Pick a plan</a
          >.
        </p>
      </form>
    </Card>
  {:else}
    <TenantForm licenseId={activeLicenseId} />
  {/if}
</div>
