<script lang="ts">
  import { page } from "$app/state";
  import { authClient } from "$lib/auth-client";
  import { Button } from "$lib/components/ui/button";

  let { children, data } = $props();

  const user = $derived(data.user);
  const tenants = $derived(data.tenants ?? []);
  const onPublicPage = $derived(
    page.url.pathname === "/dashboard/signup" ||
      page.url.pathname === "/dashboard/signin",
  );
  // The onboarding flow renders its own full-bleed shell (top row with
  // logo, stepper, team badge) and wants the whole viewport. Skip the
  // dashboard chrome so the two don't stack.
  const immersive = $derived(page.url.pathname.startsWith("/dashboard/new"));

  async function signOut() {
    await authClient.signOut();
    window.location.href = "/dashboard/signin";
  }
</script>

<!--
  The dashboard is an authenticated surface. robots.txt also blocks the
  path, but a robots meta tag is the defence that follows the page if it
  ever gets linked from somewhere a crawler reaches without consulting
  robots.txt first.
-->
<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
  {#if user && !onPublicPage && !immersive}
    <header
      class="border-b bg-background/95 backdrop-blur sticky top-0 z-10"
    >
      <div class="container mx-auto flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-6">
          <a href="/dashboard" class="font-semibold tracking-tight"
            >Seaquel Dashboard</a
          >
          {#if tenants.length > 0}
            <nav class="hidden md:flex items-center gap-1 text-sm">
              {#each tenants as t}
                <a
                  href={`/dashboard/${t.slug}`}
                  class="px-2 py-1 rounded-md hover:bg-muted transition-colors"
                  class:bg-muted={page.url.pathname.startsWith(`/dashboard/${t.slug}`)}
                >
                  {t.slug}
                </a>
              {/each}
            </nav>
          {/if}
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-muted-foreground hidden sm:inline">{user.name}</span>
          <Button variant="ghost" size="sm" onclick={signOut}>Sign out</Button>
        </div>
      </div>
    </header>
  {/if}

  {#if immersive}
    {@render children()}
  {:else}
    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>
  {/if}
</div>
