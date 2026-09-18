<script lang="ts">
  /**
   * Seaquel Cloud onboarding — 3-step flow (Workspace → Set up → Launch).
   *
   * The existing `/api/control/tenants` POST only takes {slug, platform},
   * so:
   *   - Region is captured in the UI (user expectation per design) and
   *     stored client-side for now. The server picks the Fly region via
   *     `defaultRegion()` until we extend the API to accept it.
   *   - Invites and database choice are UI-only wire-ups — they surface
   *     in the confirmation checklist but aren't POST'd until the backend
   *     grows endpoints for them.
   *   - `platform` is an implementation detail and hardcoded to `fly`
   *     (matches the previous page's default). Adding a user-facing
   *     platform toggle would be a separate product decision.
   */
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    ArrowLeft,
    ArrowRight,
    Check,
    Copy,
    Database,
    LoaderCircle,
    Plus,
    Sparkles,
    X,
  } from "lucide-svelte";
  import type { PageData } from "./$types";
  import { Tenant } from "$lib/entities/tenant";

  let { data }: { data: PageData } = $props();

  // The dashboard auth gate ensures every user who reaches /dashboard/new
  // is signed in, so we already know their email (and usually name). When
  // that's the case we skip the Profile step entirely rather than making
  // the user re-enter info we already have. `ownerEmail` comes from this
  // route's own +page.server.ts (the shared layout load only exposes
  // remult.user, which doesn't include email).
  //
  // We capture these at mount: the onboarding flow doesn't survive a
  // session change mid-navigation (the auth gate would bounce us first),
  // so reacting to `data` updates would only cause spurious resets.
  // svelte-ignore state_referenced_locally
  const sessionName = data.user?.name ?? "";
  // svelte-ignore state_referenced_locally
  const sessionEmail = data.ownerEmail ?? "";
  const skipProfile = !!sessionEmail;

  type Region = "us-east" | "eu-west" | "ap-south";
  type DbChoice = "sample" | "connect" | "blank";

  const REGIONS: {
    id: Region;
    label: string;
    city: string;
    flag: string;
    latency: number;
  }[] = [
    { id: "us-east", label: "US East", city: "Ashburn, VA", flag: "🇺🇸", latency: 28 },
    { id: "eu-west", label: "EU West", city: "Frankfurt, DE", flag: "🇪🇺", latency: 94 },
    { id: "ap-south", label: "APAC", city: "Singapore, SG", flag: "🌏", latency: 212 },
  ];

  const DB_OPTIONS: {
    id: DbChoice;
    label: string;
    desc: string;
    tag: string | null;
    detail: string;
  }[] = [
    {
      id: "sample",
      label: "Sample database",
      desc: "Northwind, pre-loaded.",
      tag: "Fastest",
      detail: "postgres • 24MB • 13 tables",
    },
    {
      id: "connect",
      label: "Connect existing",
      desc: "Postgres, MySQL, SQLite…",
      tag: null,
      detail: "Paste a connection string",
    },
    {
      id: "blank",
      label: "Blank workspace",
      desc: "Start empty. Add later.",
      tag: null,
      detail: "No database attached",
    },
  ];

  // Matches the server-side RESERVED_SLUGS set in entities/tenant.ts so
  // the UI can reject these before the POST round-trip.
  const RESERVED = new Set([
    "www", "api", "app", "admin", "dashboard", "docs", "demo", "download",
    "help", "mail", "status", "support", "seaquel", "cloud", "login",
    "logout", "signup", "signin", "account", "billing", "control", "new",
    "success", "settings", "team",
  ]);

  let step = $state(0);
  // Prefill from the session so the Profile step (when shown) starts
  // populated, and so downstream code can reference the owner regardless
  // of whether the Profile step ran.
  let name = $state(sessionName);
  let email = $state(sessionEmail);
  let slug = $state("");
  let region = $state<Region>("us-east");
  let invites = $state<string[]>([]);
  let db = $state<DbChoice>("sample");
  let connString = $state("postgres://user:pass@host:5432/db");
  let inviteDraft = $state("");
  let inviteErr = $state("");
  let busy = $state(false);
  let launching = $state(false);
  let errorMessage = $state("");
  let copied = $state(false);

  // Semantic step list — filtered to the steps actually shown. Driving
  // the stepper (and eyebrow numbering) off this keeps both modes (with
  // or without Profile) correctly numbered.
  type StepId = "profile" | "workspace" | "setup" | "launch";
  type StepDef = { id: StepId; label: string; eyebrow: string };
  const ALL_STEPS: StepDef[] = [
    { id: "profile", label: "Profile", eyebrow: "Profile" },
    { id: "workspace", label: "Workspace", eyebrow: "Workspace" },
    // "Set up" is hidden until the backend accepts region / DB choice /
    // invites. The UI is preserved below under `{#if false}` for fast
    // re-enable once those endpoints land.
    // { id: "setup", label: "Set up", eyebrow: "Set up" },
    { id: "launch", label: "Launch", eyebrow: "You're in" },
  ];
  const STEPS: StepDef[] = skipProfile
    ? ALL_STEPS.filter((s) => s.id !== "profile")
    : ALL_STEPS;
  const TOTAL_STEPS = STEPS.length;

  // Availability probe: the design promises "spinner → ✓ or ✗". We don't
  // have an availability endpoint yet, so this debounces on valid input
  // and optimistically resolves to "available". The server still
  // authoritatively rejects dupes via the tenants.slug UNIQUE constraint
  // at POST time.
  let availability = $state<"idle" | "checking" | "available">("idle");
  let availabilityTimer: ReturnType<typeof setTimeout> | null = null;

  type Validation =
    | { state: "empty" | "ok"; msg: null }
    | { state: "error"; msg: string };

  const validation: Validation = $derived.by(() => {
    const s = slug.trim().toLowerCase();
    if (!s) return { state: "empty", msg: null };
    if (s.length < 3) return { state: "error", msg: "At least 3 characters." };
    if (s.length > 32) return { state: "error", msg: "Max 32 characters." };
    if (!/^[a-z0-9-]+$/.test(s))
      return { state: "error", msg: "Lowercase letters, numbers, and hyphens only." };
    if (s.startsWith("-") || s.endsWith("-"))
      return { state: "error", msg: "Can't start or end with a hyphen." };
    if (RESERVED.has(s)) return { state: "error", msg: `"${s}" is reserved.` };
    return { state: "ok", msg: null };
  });

  $effect(() => {
    if (availabilityTimer) clearTimeout(availabilityTimer);
    if (validation.state !== "ok") {
      availability = "idle";
      return;
    }
    availability = "checking";
    availabilityTimer = setTimeout(() => {
      availability = "available";
    }, 550);
    return () => {
      if (availabilityTimer) clearTimeout(availabilityTimer);
    };
  });

  const nameValid: Validation = $derived.by(() => {
    const t = name.trim();
    if (!t) return { state: "empty", msg: null };
    if (t.length < 2) return { state: "error", msg: "At least 2 characters." };
    return { state: "ok", msg: null };
  });

  const emailValid: Validation = $derived.by(() => {
    const t = email.trim();
    if (!t) return { state: "empty", msg: null };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))
      return { state: "error", msg: "Not a valid email." };
    return { state: "ok", msg: null };
  });

  const profileOk = $derived(nameValid.state === "ok" && emailValid.state === "ok");

  // Initials for the avatar monogram — first letters of up to two words.
  const initials = $derived(
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]!.toUpperCase())
      .join("") || "—",
  );

  const slugOk = $derived(validation.state === "ok" && availability === "available");

  const currentStepDef = $derived(STEPS[step] ?? STEPS[0]);
  const currentStepId = $derived<StepId>(currentStepDef.id);
  const currentEyebrow = $derived(
    `Step ${String(step + 1).padStart(2, "0")} — ${currentStepDef.eyebrow}`,
  );

  const canContinue = $derived(
    currentStepId === "profile"
      ? profileOk
      : currentStepId === "workspace"
        ? slugOk
        : true,
  );
  const isLast = $derived(step === TOTAL_STEPS - 1);
  const activeRegion = $derived(REGIONS.find((r) => r.id === region) ?? REGIONS[0]);

  const dbRow = $derived(
    db === "sample"
      ? { label: "Sample database seeded", detail: "Northwind • 13 tables" }
      : db === "connect"
        ? { label: "Connection saved", detail: "postgres://…" }
        : { label: "Blank workspace ready", detail: "no database attached" },
  );

  const inviteRow = $derived(
    invites.length > 0
      ? {
          done: true,
          label: `${invites.length} invite${invites.length === 1 ? "" : "s"} queued`,
          detail:
            invites.slice(0, 2).join(", ") +
            (invites.length > 2 ? `, +${invites.length - 2} more` : ""),
        }
      : { done: false, label: "No invites", detail: "invite later from Settings" },
  );

  // Region / DB / invite rows are hidden until their backends land. See
  // the note on STEPS above.
  const checklistRows = $derived([
    { done: true, label: "Workspace provisioned", detail: `${slug}.seaquel.app` },
  ]);

  // Focus-ring color helper: amber (default) / emerald (valid) / red (error).
  // Uses shadcn tokens so it adapts to light/dark automatically.
  function ringFor(state: "empty" | "ok" | "error"): string {
    if (state === "error")
      return "focus-within:border-destructive focus-within:ring-3 focus-within:ring-destructive/20";
    if (state === "ok")
      return "focus-within:border-emerald-600 dark:focus-within:border-emerald-400 focus-within:ring-3 focus-within:ring-emerald-600/20 dark:focus-within:ring-emerald-400/20";
    return "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20";
  }

  const slugRing = $derived(
    ringFor(
      validation.state === "error"
        ? "error"
        : availability === "available"
          ? "ok"
          : "empty",
    ),
  );
  const nameRing = $derived(ringFor(nameValid.state));
  const emailRing = $derived(ringFor(emailValid.state));

  function next() {
    if (canContinue && step < TOTAL_STEPS - 1) step += 1;
  }
  function back() {
    if (step > 0) step -= 1;
  }
  function jump(i: number) {
    if (i < step) step = i;
  }

  function onSlugInput(e: Event) {
    const input = e.target as HTMLInputElement;
    slug = input.value.replace(/\s+/g, "-").toLowerCase();
    input.value = slug;
  }

  function addInvite(raw: string) {
    const email = raw.trim();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      inviteErr = "Not a valid email.";
      return;
    }
    if (invites.includes(email)) {
      inviteErr = "Already invited.";
      return;
    }
    invites = [...invites, email];
    inviteDraft = "";
    inviteErr = "";
  }

  function onInviteKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInvite(inviteDraft);
    } else if (e.key === "Backspace" && !inviteDraft && invites.length) {
      invites = invites.slice(0, -1);
    }
  }

  function onInviteBlur() {
    if (inviteDraft) addInvite(inviteDraft);
  }

  async function launch() {
    if (busy || launching) return;
    busy = true;
    errorMessage = "";
    try {
      await Tenant.create({
        slug,
        platform: "fly",
        licenseId: data.license.id,
      });
      launching = true;
      // Hold the booting state briefly so the transition reads, then
      // hand off to the polling page which resolves to /dashboard/[slug].
      setTimeout(() => {
        window.location.href = "/dashboard/new/success";
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // "already taken" races past the UNIQUE constraint — bounce back
      // to step 0 so the user can correct the slug inline.
      if (/already taken/i.test(message)) {
        step = 0;
        errorMessage = message;
      } else {
        errorMessage = message || "Failed to create workspace.";
      }
    } finally {
      busy = false;
    }
  }

  function copy() {
    try {
      navigator.clipboard.writeText("https://" + slug + ".seaquel.app");
    } catch {
      /* clipboard API can throw in insecure contexts — ignore */
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1600);
  }

  function onKey(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" && e.key !== "Enter") return;
    if (e.key !== "Enter" || launching || busy) return;
    if (isLast) launch();
    else next();
  }

  onMount(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

<svelte:head>
  <title>Seaquel Cloud — Create workspace</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col">
  {#if launching}
    <div
      class="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6 py-12
             bg-[radial-gradient(50%_40%_at_50%_30%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]"
    >
      <div class="font-mono text-[11px] text-primary tracking-[0.12em] uppercase">
        Redirecting…
      </div>
      <div class="font-mono text-4xl font-semibold tracking-tight">
        <span class="text-primary">{slug}</span><span class="text-muted-foreground">.seaquel.app</span>
      </div>
      <div class="font-mono flex items-center gap-2.5 text-muted-foreground text-[13px]">
        <LoaderCircle class="size-3.5 animate-spin" />
        booting your workspace
      </div>
    </div>
  {:else}
    <div class="flex-1 flex flex-col items-center px-6 pt-11 pb-7">
      <div class="w-full max-w-[720px] flex flex-col">
        <!-- Top row: wordmark · stepper · team badge -->
        <div class="flex justify-between items-center gap-4">
          <a
            href="/dashboard"
            class="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            <span class="w-2.5 h-2.5 rounded-sm bg-primary"></span>
            <span>Seaquel</span>
          </a>
          <div class="flex items-center">
            {#each STEPS as s, i}
              {@const label = s.label}
              {@const state = i < step ? "done" : i === step ? "active" : "upcoming"}
              <button
                type="button"
                class="flex items-center gap-2.5 bg-transparent border-0 p-0 enabled:cursor-pointer disabled:cursor-default"
                onclick={() => jump(i)}
                disabled={i >= step}
                aria-current={i === step ? "step" : undefined}
              >
                <span
                  class="w-[22px] h-[22px] rounded-full border flex items-center justify-center font-mono text-[11px] font-semibold transition-colors"
                  class:border-border={state === "upcoming"}
                  class:text-muted-foreground={state === "upcoming"}
                  class:border-primary={state !== "upcoming"}
                  class:text-primary={state === "active"}
                  class:bg-primary={state === "done"}
                  class:text-primary-foreground={state === "done"}
                >
                  {#if state === "done"}
                    <Check class="size-3" strokeWidth={2.4} />
                  {:else}
                    {String(i + 1).padStart(2, "0")}
                  {/if}
                </span>
                <span
                  class="text-[12.5px] whitespace-nowrap"
                  class:text-muted-foreground={state === "upcoming"}
                  class:text-foreground={state !== "upcoming"}
                  class:font-semibold={state === "active"}
                >
                  {label}
                </span>
              </button>
              {#if i < STEPS.length - 1}
                <span
                  class="inline-block w-6 h-px mx-2.5 shrink-0"
                  class:bg-border={i >= step}
                  class:bg-primary={i < step}
                  class:opacity-60={i < step}
                ></span>
              {/if}
            {/each}
          </div>
          <div class="font-mono text-[11.5px] text-muted-foreground/70 whitespace-nowrap">
            <span class="text-muted-foreground">plan</span>
            ·
            {data.license.seats > 1
              ? `business · ${data.license.seats} seats`
              : "individual"}
          </div>
        </div>

        <!-- Step content -->
        {#key step}
          <div class="mt-9 flex flex-col gap-8" in:fade={{ duration: 280 }}>
            {#if currentStepId === "profile"}
              <header class="flex flex-col gap-3.5">
                <div class="font-mono text-[11.5px] text-primary tracking-[0.08em] uppercase">
                  {currentEyebrow}
                </div>
                <h1 class="text-[34px] font-bold tracking-tight leading-[1.1] m-0 text-foreground">
                  First, who are we provisioning for?
                </h1>
                <p class="text-[15px] text-muted-foreground leading-normal max-w-[480px] m-0">
                  This is the owner account. You can add more admins later.
                </p>
              </header>

              <!-- Name + Email grid -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Full name -->
                <div>
                  <label
                    for="profile-name"
                    class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2"
                  >
                    Full name
                  </label>
                  <div
                    class="flex items-center bg-muted/40 border border-border rounded-[10px]
                           transition-[border-color,box-shadow] duration-150 {nameRing}"
                  >
                    <!-- svelte-ignore a11y_autofocus -->
                    <input
                      id="profile-name"
                      type="text"
                      bind:value={name}
                      placeholder="Alex Rivera"
                      spellcheck="false"
                      autocomplete="name"
                      autofocus
                      class="flex-1 min-w-0 bg-transparent border-0 outline-none text-foreground
                             placeholder:text-muted-foreground/60 text-[15px] px-3.5 py-3"
                    />
                    <span class="w-9 flex items-center justify-center pr-2.5">
                      {#if nameValid.state === "ok"}
                        <Check class="size-4 text-emerald-600 dark:text-emerald-400" />
                      {:else if nameValid.state === "error"}
                        <X class="size-4 text-destructive" />
                      {/if}
                    </span>
                  </div>
                  <div class="min-h-5 mt-2 flex items-center gap-1.5 text-[12.5px]">
                    {#if nameValid.state === "error"}
                      <span class="text-destructive">{nameValid.msg}</span>
                    {:else}
                      <span class="text-muted-foreground/70">
                        Shows up on your commits and shared queries.
                      </span>
                    {/if}
                  </div>
                </div>

                <!-- Work email -->
                <div>
                  <label
                    for="profile-email"
                    class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2"
                  >
                    Work email
                  </label>
                  <div
                    class="flex items-center bg-muted/40 border border-border rounded-[10px]
                           transition-[border-color,box-shadow] duration-150 {emailRing}"
                  >
                    <input
                      id="profile-email"
                      type="email"
                      bind:value={email}
                      placeholder="alex@acme.co"
                      spellcheck="false"
                      autocomplete="email"
                      class="font-mono flex-1 min-w-0 bg-transparent border-0 outline-none text-foreground
                             placeholder:text-muted-foreground/60 text-[14px] px-3.5 py-3"
                    />
                    <span class="w-9 flex items-center justify-center pr-2.5">
                      {#if emailValid.state === "ok"}
                        <Check class="size-4 text-emerald-600 dark:text-emerald-400" />
                      {:else if emailValid.state === "error"}
                        <X class="size-4 text-destructive" />
                      {/if}
                    </span>
                  </div>
                  <div class="min-h-5 mt-2 flex items-center gap-1.5 text-[12.5px]">
                    {#if emailValid.state === "error"}
                      <span class="text-destructive">{emailValid.msg}</span>
                    {:else}
                      <span class="text-muted-foreground/70">
                        We'll send your login link here.
                      </span>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Live preview card: avatar monogram + name + email + Owner badge -->
              <div
                class="flex items-center gap-3.5 px-4 py-3.5 rounded-[10px] border border-border bg-muted/40"
              >
                <div
                  class="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center
                         font-mono text-[14px] font-semibold tracking-tight
                         bg-primary/15 border border-primary/25 text-primary"
                >
                  {initials}
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-[13.5px] font-medium text-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {#if name.trim()}
                      {name.trim()}
                    {:else}
                      <span class="text-muted-foreground/70">your name</span>
                    {/if}
                  </div>
                  <div
                    class="font-mono text-[12px] text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {#if email.trim()}
                      {email.trim()}
                    {:else}
                      <span class="text-muted-foreground/70">you@company.com</span>
                    {/if}
                  </div>
                </div>
                <span
                  class="font-mono text-[10.5px] uppercase tracking-[0.08em] text-primary
                         border border-primary rounded px-2 py-0.5"
                >
                  Owner
                </span>
              </div>
            {:else if currentStepId === "workspace"}
              <header class="flex flex-col gap-3.5">
                <div class="font-mono text-[11.5px] text-primary tracking-[0.08em] uppercase">
                  {currentEyebrow}
                </div>
                <h1 class="text-[34px] font-bold tracking-tight leading-[1.1] m-0 text-foreground">
                  Name your workspace.
                </h1>
                <p class="text-[15px] text-muted-foreground leading-normal max-w-[480px] m-0">
                  This becomes your subdomain. You can't change it later, but
                  you can create more.
                </p>
              </header>

              <!-- Subdomain field -->
              <div>
                <label
                  for="workspace-slug"
                  class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2"
                >
                  Workspace subdomain
                </label>
                <div
                  class="flex items-center bg-muted/40 border border-border rounded-[10px]
                         transition-[border-color,box-shadow] duration-150 {slugRing}"
                >
                  <!-- svelte-ignore a11y_autofocus -->
                  <input
                    id="workspace-slug"
                    type="text"
                    value={slug}
                    oninput={onSlugInput}
                    placeholder="acme-co"
                    spellcheck="false"
                    autocomplete="off"
                    maxlength="32"
                    autofocus
                    class="font-mono flex-1 min-w-0 bg-transparent border-0 outline-none
                           text-foreground placeholder:text-muted-foreground/60 text-[15px] tracking-tight
                           py-3 pl-3.5"
                  />
                  <span class="font-mono text-[15px] text-muted-foreground pr-2.5 select-none">
                    .seaquel.app
                  </span>
                  <span class="w-9 flex items-center justify-center pr-2.5">
                    {#if availability === "checking"}
                      <LoaderCircle class="size-4 animate-spin text-muted-foreground" />
                    {:else if availability === "available" && validation.state === "ok"}
                      <Check class="size-4 text-emerald-600 dark:text-emerald-400" />
                    {:else if validation.state === "error"}
                      <X class="size-4 text-destructive" />
                    {/if}
                  </span>
                </div>
                <div class="min-h-5 mt-2 flex items-center gap-1.5 text-[12.5px]">
                  {#if validation.state === "error"}
                    <span class="text-destructive">{validation.msg}</span>
                  {:else if availability === "available"}
                    <span class="text-emerald-600 dark:text-emerald-400">Available. Nice pick.</span>
                  {:else if availability === "checking"}
                    <span class="text-muted-foreground/70">Checking availability…</span>
                  {:else}
                    <span class="text-muted-foreground/70">3–32 chars. Lowercase, numbers, hyphens.</span>
                  {/if}
                </div>
              </div>

              <!--
                Region picker hidden until POST /api/control/tenants
                accepts `region` in the body. `region` state stays pinned
                at its default so the summary/launch preview still works.
              -->
              {#if false}
                <div>
                  <span class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2">
                    Data region
                  </span>
                  <div class="grid grid-cols-3 gap-2">
                    {#each REGIONS as r}
                      {@const active = region === r.id}
                      {@const comingSoon = r.id !== "us-east"}
                      <button
                        type="button"
                        disabled
                        data-active={active}
                        class="text-left px-3.5 py-3 rounded-[10px] border transition-colors
                               text-foreground bg-transparent border-border
                               data-[active=true]:bg-muted/40 data-[active=true]:border-primary
                               disabled:cursor-not-allowed"
                        class:opacity-60={comingSoon}
                      >
                        <div class="flex justify-between items-center mb-1.5">
                          <span class="text-[13px] font-semibold">{r.label}</span>
                          {#if active}
                            <Check class="size-3.5 text-primary" />
                          {/if}
                        </div>
                        <div class="font-mono text-[11.5px] text-muted-foreground">{r.city}</div>
                        {#if comingSoon}
                          <div
                            class="font-mono text-[10px] text-muted-foreground/70 mt-1.5 uppercase tracking-[0.08em]"
                          >
                            Coming soon
                          </div>
                        {:else}
                          <div class="font-mono text-[11px] text-muted-foreground/70 mt-1.5">
                            ~{r.latency}ms
                          </div>
                        {/if}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            {:else if currentStepId === "setup"}
              <header class="flex flex-col gap-3.5">
                <div class="font-mono text-[11.5px] text-primary tracking-[0.08em] uppercase">
                  {currentEyebrow}
                </div>
                <h1 class="text-[34px] font-bold tracking-tight leading-[1.1] m-0 text-foreground">
                  Invite the team. Pick a database.
                </h1>
                <p class="text-[15px] text-muted-foreground leading-normal max-w-[480px] m-0">
                  Skip anything — you can do it later from the dashboard.
                </p>
              </header>

              <!-- Invite block -->
              <div>
                <div class="flex justify-between items-baseline">
                  <label
                    for="invite-input"
                    class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2"
                  >
                    Invite teammates
                    <span class="normal-case text-muted-foreground/70 font-normal">— optional</span>
                  </label>
                  {#if invites.length > 0}
                    <span class="font-mono text-[11.5px] text-muted-foreground/70">
                      {invites.length} pending
                    </span>
                  {/if}
                </div>
                <div
                  class="flex flex-wrap items-center gap-1.5 bg-muted/40 border border-border
                         rounded-[10px] min-h-12 px-2.5 py-1.5 transition-[border-color,box-shadow] duration-150
                         focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
                >
                  {#each invites as e}
                    <span
                      class="inline-flex items-center gap-1.5 bg-muted border border-border
                             rounded-md pl-2 pr-1 py-1 font-mono text-[12px] text-foreground"
                    >
                      {e}
                      <button
                        type="button"
                        class="bg-transparent border-0 cursor-pointer text-muted-foreground/70 p-0.5 flex"
                        onclick={() => (invites = invites.filter((x) => x !== e))}
                        aria-label={`Remove ${e}`}
                      >
                        <X class="size-2.5" strokeWidth={2} />
                      </button>
                    </span>
                  {/each}
                  <input
                    id="invite-input"
                    type="text"
                    bind:value={inviteDraft}
                    oninput={() => (inviteErr = "")}
                    onkeydown={onInviteKey}
                    onblur={onInviteBlur}
                    placeholder={invites.length ? "" : "alex@acme.co, sam@acme.co"}
                    class="font-mono flex-1 min-w-[180px] bg-transparent border-0 outline-none
                           text-foreground placeholder:text-muted-foreground/60 text-[13.5px] px-1 py-2.5"
                  />
                </div>
                <div class="min-h-5 mt-2 flex items-center gap-1.5 text-[12.5px]">
                  {#if inviteErr}
                    <span class="text-destructive">{inviteErr}</span>
                  {:else}
                    <span class="text-muted-foreground/70">
                      Press Enter or comma to add. They'll get an invite to join
                      your workspace.
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Database block -->
              <div>
                <span class="block text-xs font-medium tracking-[0.04em] uppercase text-muted-foreground mb-2">
                  First database
                </span>
                <div class="grid grid-cols-3 gap-2">
                  {#each DB_OPTIONS as opt}
                    {@const active = db === opt.id}
                    <button
                      type="button"
                      onclick={() => (db = opt.id)}
                      data-active={active}
                      class="text-left px-3.5 pt-3.5 pb-4 rounded-[10px] border cursor-pointer transition-colors
                             flex flex-col gap-1.5 min-h-[108px] text-foreground bg-transparent border-border
                             data-[active=true]:bg-muted/40 data-[active=true]:border-primary"
                    >
                      <div class="flex items-center justify-between">
                        <span
                          class:text-muted-foreground={!active}
                          class:text-primary={active}
                        >
                          {#if opt.id === "sample"}
                            <Sparkles class="size-4" />
                          {:else if opt.id === "connect"}
                            <Database class="size-4" />
                          {:else}
                            <Plus class="size-4" />
                          {/if}
                        </span>
                        {#if opt.tag}
                          <span
                            class="font-mono text-[10px] uppercase tracking-[0.08em] text-primary
                                   border border-primary rounded px-1.5 py-0.5 opacity-90"
                          >
                            {opt.tag}
                          </span>
                        {/if}
                      </div>
                      <div class="text-[14px] font-semibold mt-1">{opt.label}</div>
                      <div class="text-[12.5px] text-muted-foreground">{opt.desc}</div>
                      <div class="font-mono text-[11px] text-muted-foreground/70 mt-auto">{opt.detail}</div>
                    </button>
                  {/each}
                </div>

                {#if db === "connect"}
                  <div
                    class="flex items-center mt-3 bg-muted/40 border border-border rounded-[10px]
                           transition-[border-color,box-shadow] duration-150
                           focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
                  >
                    <span class="font-mono text-[13px] text-muted-foreground/70 py-3 pl-3.5 select-none">$</span>
                    <input
                      bind:value={connString}
                      spellcheck="false"
                      class="font-mono flex-1 bg-transparent border-0 outline-none text-foreground
                             placeholder:text-muted-foreground/60 text-[13px] px-3.5 py-3"
                    />
                  </div>
                {:else if db === "sample"}
                  <div
                    class="flex items-center gap-3 mt-3 px-3.5 py-3 rounded-[10px] bg-muted/40
                           border border-border font-mono text-[12px] text-muted-foreground"
                  >
                    <Check class="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Northwind will be seeded on first boot.</span>
                    <span class="text-muted-foreground/70">customers, orders, products, employees…</span>
                  </div>
                {/if}
              </div>
            {:else}
              <header class="flex flex-col gap-3.5">
                <div class="font-mono text-[11.5px] text-primary tracking-[0.08em] uppercase">
                  {currentEyebrow}
                </div>
                <h1 class="text-[34px] font-bold tracking-tight leading-[1.1] m-0 text-foreground">
                  Workspace ready. <span class="text-primary">Let's query.</span>
                </h1>
                <p class="text-[15px] text-muted-foreground leading-normal max-w-[480px] m-0">
                  Bookmark the URL. Your teammates will land here when they accept.
                </p>
              </header>

              <!-- URL card -->
              <div class="border border-border rounded-xl bg-card overflow-hidden">
                <div
                  class="flex justify-between px-3.5 py-2 font-mono text-[11px] text-muted-foreground/70
                         border-b border-border/60"
                >
                  <span>// your workspace</span>
                  <span>{activeRegion.flag} {activeRegion.label}</span>
                </div>
                <div class="flex items-center p-4.5">
                  <div class="flex-1 min-w-0">
                    <div class="font-mono text-[13px] text-muted-foreground/70 mb-1">https://</div>
                    <div
                      class="font-mono text-2xl font-semibold tracking-tight overflow-hidden
                             text-ellipsis whitespace-nowrap"
                    >
                      <span class="text-primary">{slug || "workspace"}</span><span
                        class="text-muted-foreground">.seaquel.app</span
                      >
                    </div>
                  </div>
                  <button
                    type="button"
                    onclick={copy}
                    data-copied={copied}
                    class="inline-flex items-center gap-1.5 bg-transparent border rounded-lg px-3 py-2
                           cursor-pointer font-mono text-[12px] transition
                           text-muted-foreground border-border
                           data-[copied=true]:text-emerald-600 data-[copied=true]:border-emerald-600/40
                           dark:data-[copied=true]:text-emerald-400 dark:data-[copied=true]:border-emerald-400/40"
                  >
                    {#if copied}
                      <Check class="size-3" />
                      copied
                    {:else}
                      <Copy class="size-3" />
                      copy
                    {/if}
                  </button>
                </div>
              </div>

              <!-- Checklist -->
              <div class="flex flex-col">
                {#each checklistRows as row, i}
                  {@const divider = i < checklistRows.length - 1 ? "border-b border-border/60" : ""}
                  {@const dot = row.done
                    ? "border border-solid border-emerald-600/40 bg-emerald-600/15 text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-400"
                    : "border border-dashed border-border text-muted-foreground/70"}
                  <div class="flex items-center gap-3 py-2.5 {divider}">
                    <span
                      class="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 {dot}"
                    >
                      {#if row.done}
                        <Check class="size-2.5" strokeWidth={2.2} />
                      {/if}
                    </span>
                    <span
                      class="flex-1 min-w-0 text-[13.5px] {row.done ? 'text-foreground' : 'text-muted-foreground'}"
                    >
                      {row.label}
                    </span>
                    <span
                      class="font-mono text-[11.5px] text-muted-foreground/70 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {row.detail}
                    </span>
                  </div>
                {/each}
              </div>

              <!-- Next up -->
              <div
                class="px-4 py-3.5 rounded-[10px] border border-dashed border-border
                       font-mono text-[12px] text-muted-foreground leading-[1.7]"
              >
                <div class="text-muted-foreground/70 mb-1.5">// next up</div>
                <div>→ <span class="text-foreground">launch workspace</span></div>
                <div>→ <span class="text-foreground">open a query tab</span> <span class="text-muted-foreground/70">⌘T</span></div>
                <div>→ <span class="text-foreground">invite later</span> <span class="text-muted-foreground/70">Settings › Members</span></div>
              </div>
            {/if}
          </div>
        {/key}

        {#if errorMessage}
          <div
            role="alert"
            class="mt-5 px-3.5 py-2.5 rounded-lg bg-destructive/10 border border-destructive/40
                   text-destructive text-[13px]"
          >
            {errorMessage}
          </div>
        {/if}

        <!-- Nav bar -->
        <div class="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-border/60">
          <button
            type="button"
            onclick={back}
            disabled={step === 0 || busy}
            class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium
                   text-muted-foreground bg-transparent border border-border transition
                   enabled:cursor-pointer enabled:hover:bg-muted/50
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft class="size-3.5" />
            Back
          </button>
          <div class="font-mono text-[11.5px] text-muted-foreground/70 tracking-[0.04em]">
            {isLast ? "Press ⏎ to launch" : "↵ to continue"}
          </div>
          {#if isLast}
            <button
              type="button"
              onclick={launch}
              disabled={busy}
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold
                     tracking-tight bg-primary text-primary-foreground border-0 transition
                     enabled:cursor-pointer enabled:hover:brightness-110
                     disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {#if busy}
                <LoaderCircle class="size-3.5 animate-spin" />
                Launching…
              {:else}
                Launch workspace
                <ArrowRight class="size-3.5" />
              {/if}
            </button>
          {:else}
            <button
              type="button"
              onclick={next}
              disabled={!canContinue}
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold
                     tracking-tight bg-primary text-primary-foreground border-0 transition
                     enabled:cursor-pointer enabled:hover:brightness-110
                     disabled:opacity-45 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight class="size-3.5" />
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
