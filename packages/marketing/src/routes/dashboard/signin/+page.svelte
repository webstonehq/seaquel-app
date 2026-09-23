<script lang="ts">
  import { page } from "$app/state";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { LoaderCircleIcon } from "lucide-svelte";
  import { authClient } from "$lib/auth-client";

  let email = $state("");
  let password = $state("");
  let busy = $state(false);
  let errorMessage = $state("");

  const redirectTo = $derived(
    page.url.searchParams.get("redirect") ?? "/dashboard",
  );

  async function signIn(e: Event) {
    e.preventDefault();
    busy = true;
    errorMessage = "";
    const { error } = await authClient.signIn.email({ email, password });
    busy = false;
    if (error) {
      errorMessage = error.message ?? "Sign-in failed.";
      return;
    }
    window.location.href = redirectTo;
  }
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-3xl font-semibold tracking-tight mb-2">Sign in</h1>
  <p class="text-muted-foreground mb-8">Welcome back.</p>

  <Card class="border-2 p-6">
    <form onsubmit={signIn} class="flex flex-col gap-4">
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
        <label class="text-sm font-medium mb-1.5 block" for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          autocomplete="current-password"
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
          Signing in…
        {:else}
          Sign in
        {/if}
      </Button>
      <p class="text-sm text-muted-foreground text-center">
        New here? <a
          href={page.url.searchParams.get("redirect")
            ? `/dashboard/signup?redirect=${encodeURIComponent(page.url.searchParams.get("redirect")!)}`
            : "/dashboard/signup"}
          class="underline">Create an account</a
        >.
      </p>
    </form>
  </Card>
</div>
