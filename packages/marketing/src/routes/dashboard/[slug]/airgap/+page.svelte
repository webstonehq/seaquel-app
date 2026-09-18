<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import {
    AlertTriangleIcon,
    DownloadIcon,
    LoaderCircleIcon,
    RotateCcwIcon,
    ShieldCheckIcon,
  } from "lucide-svelte";

  let { data } = $props();

  const tenant = $derived(data.tenant);
  const license = $derived(data.license);
  const tier = $derived(data.tier);
  const members = $derived(data.members ?? []);
  const revocations = $derived(data.revocations ?? []);
  const recentBundles = $derived(data.recentBundles ?? []);
  const computedNotAfter = $derived(data.computedNotAfter);

  // Per-row in-flight state for the revoke checkbox. Keyed by licenseKey
  // (not member id) so the same map covers the restore button below —
  // both surfaces address the same (subscriptionId, licenseKey) tuple.
  let pendingKey = $state<string>("");
  let downloadBusy = $state(false);
  let downloadError = $state("");

  /**
   * Reverse-lookup: is this licenseKey currently in the deny-list? The
   * revocations array is small (one per revoked key), so an O(n) scan
   * per checkbox is fine — saves us building a Set every render.
   */
  function isRevoked(licenseKey: string): boolean {
    if (!licenseKey) return false;
    return revocations.some((r) => r.licenseKey === licenseKey);
  }

  function maskKey(key: string): string {
    if (!key) return "—";
    if (key.length <= 4) return key;
    return `••••-${key.slice(-4)}`;
  }

  function formatUnix(seconds: number | null | undefined): string {
    if (!seconds || !Number.isFinite(seconds)) return "—";
    return new Date(seconds * 1000).toISOString().replace(".000Z", "Z");
  }

  function formatIso(iso: string | null | undefined): string {
    if (!iso) return "—";
    return iso;
  }

  function shortHash(hex: string): string {
    if (!hex) return "—";
    if (hex.length <= 12) return hex;
    return `${hex.slice(0, 12)}…`;
  }

  async function setRevoked(licenseKey: string, next: boolean) {
    if (!licenseKey || pendingKey) return;
    pendingKey = licenseKey;
    try {
      if (next) {
        const res = await fetch("/api/control/airgap/revoke", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            subscriptionId: license.dodoSubscriptionId,
            licenseKey,
            reason: "manual",
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `revoke failed: ${res.status}`);
        }
      } else {
        const qs = new URLSearchParams({
          subscriptionId: license.dodoSubscriptionId,
          licenseKey,
        });
        const res = await fetch(`/api/control/airgap/revoke?${qs.toString()}`, {
          method: "DELETE",
        });
        // 404 is a legitimate "already restored" race — treat as success.
        if (!res.ok && res.status !== 404) {
          const text = await res.text();
          throw new Error(text || `restore failed: ${res.status}`);
        }
      }
      await invalidateAll();
    } catch (err) {
      // Surface the error on the download alert too — the checkbox itself
      // has no inline message slot, but the page-level alert is sticky.
      downloadError =
        err instanceof Error ? err.message : "Revocation update failed.";
    } finally {
      pendingKey = "";
    }
  }

  async function downloadBundle() {
    downloadBusy = true;
    downloadError = "";
    try {
      const res = await fetch("/api/control/airgap/bundle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id }),
      });

      // The endpoint returns `application/octet-stream` on success and
      // a JSON error body on failure. Branching on the response's own
      // content-type avoids mis-parsing the binary bundle as JSON.
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok) {
        let message = `Bundle download failed (${res.status}).`;
        if (contentType.includes("application/json")) {
          const body = (await res.json()) as { message?: string };
          if (body.message) message = humanizeError(res.status, body.message);
        } else {
          const text = await res.text();
          if (text) message = humanizeError(res.status, text);
        }
        downloadError = message;
        return;
      }

      const blob = await res.blob();
      const filename =
        filenameFromDisposition(res.headers.get("content-disposition")) ??
        `seaquel-airgap-${tenant.slug}-${Math.floor(Date.now() / 1000)}.bundle`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // The endpoint inserts an IssuedBundle row; refresh the audit list
      // so the new row appears at the top without a manual reload.
      await invalidateAll();
    } catch (err) {
      downloadError =
        err instanceof Error ? err.message : "Bundle download failed.";
    } finally {
      downloadBusy = false;
    }
  }

  /**
   * Map known control-plane error codes to friendlier copy. The endpoint
   * uses SvelteKit's `error()` helper which serialises the second
   * argument as `message`, so we pattern-match on those magic strings.
   */
  function humanizeError(status: number, raw: string): string {
    const msg = raw.trim();
    if (status === 409 && /seats_overcommitted/i.test(msg)) {
      return "Can't issue a bundle: more seats are occupied than the license allows. Remove a member first.";
    }
    if (status === 400 && /not_self_hosted/i.test(msg)) {
      return "This tenant isn't self-hosted, so it doesn't get an offline bundle.";
    }
    if (status === 400 && /no_license_key|has no key/i.test(msg)) {
      return "The license has no key yet. Activate it at /dashboard/activate and try again.";
    }
    if (status === 500 && /signing key not configured/i.test(msg)) {
      return "Bundle signing isn't configured on the control plane. Contact support — this is a server-side setup error.";
    }
    if (status === 410 && /license_expired/i.test(msg)) {
      return "This license is no longer active and its 7-day grace period has ended, so no new bundle can be issued. Renew the subscription to continue.";
    }
    if (status === 429) {
      return "Too many bundle downloads in a short window. Wait a minute and try again.";
    }
    return msg.length ? msg : `Bundle download failed (${status}).`;
  }

  function filenameFromDisposition(header: string | null): string | null {
    if (!header) return null;
    // Best-effort RFC 6266 parse — the endpoint only emits the plain
    // `filename="..."` form, so we don't need full quoted-string support.
    const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
    return m ? m[1] : null;
  }
</script>

<div class="space-y-6">
  <!-- Section 1: Subscription metadata header -->
  <Card class="border-2 p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="font-semibold mb-1">Offline bundle</h2>
        <p class="text-sm text-muted-foreground">
          Sign a snapshot of this tenant's seats and revocations and ship it
          to an air-gapped Seaquel install. The bundle is read on next boot
          to decide which keys are entitled this cycle.
        </p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
      >
        <ShieldCheckIcon class="size-3.5" />
        Signing ready
      </span>
    </div>

    <dl class="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <dt class="text-muted-foreground text-xs uppercase tracking-wide">Tier</dt>
        <dd class="mt-1 font-medium capitalize">{tier}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs uppercase tracking-wide">Seats</dt>
        <dd class="mt-1 font-medium">{license.seats}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs uppercase tracking-wide">
          Current period end
        </dt>
        <dd class="mt-1 font-mono text-xs">{formatIso(license.currentPeriodEnd)}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs uppercase tracking-wide">
          Next bundle expires
        </dt>
        <dd class="mt-1 font-mono text-xs">{formatUnix(computedNotAfter)}</dd>
      </div>
    </dl>
  </Card>

  <!-- Section 2: Members table with per-row revocation toggle -->
  <Card class="border-2 p-0 overflow-hidden">
    <div class="px-6 py-4 border-b">
      <h2 class="font-semibold">Seats &amp; revocation</h2>
      <p class="text-sm text-muted-foreground mt-1">
        Check a row to add its key to the next bundle's deny-list. The owner
        seat can't be revoked from here.
      </p>
    </div>
    <table class="w-full text-sm">
      <thead class="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th class="text-left font-medium px-6 py-2.5">Email</th>
          <th class="text-left font-medium px-4 py-2.5">Role</th>
          <th class="text-left font-medium px-4 py-2.5">Status</th>
          <th class="text-left font-medium px-4 py-2.5">License key</th>
          <th class="text-left font-medium px-4 py-2.5">Revoke in next bundle</th>
        </tr>
      </thead>
      <tbody>
        {#each members as m (m.id)}
          {@const revoked = isRevoked(m.licenseKey)}
          {@const busy = pendingKey === m.licenseKey && !!m.licenseKey}
          {@const ownerRow = m.role === "owner"}
          {@const disabled = ownerRow || !m.licenseKey || busy}
          <tr class="border-t border-border/60">
            <td class="px-6 py-3 font-mono text-[13px]">{m.email}</td>
            <td class="px-4 py-3 capitalize">{m.role}</td>
            <td class="px-4 py-3 capitalize text-xs">
              <span
                class:text-green-600={m.status === "active"}
                class:dark:text-green-400={m.status === "active"}
                class:text-amber-600={m.status === "pending"}
                class:dark:text-amber-400={m.status === "pending"}
              >
                {m.status}
              </span>
            </td>
            <td class="px-4 py-3 font-mono text-xs text-muted-foreground">
              {maskKey(m.licenseKey)}
            </td>
            <td class="px-4 py-3">
              <label class="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  class="size-4 rounded border-border accent-primary disabled:opacity-50"
                  checked={revoked}
                  {disabled}
                  onchange={(e) => {
                    const target = e.currentTarget;
                    setRevoked(m.licenseKey, target.checked);
                  }}
                />
                {#if busy}
                  <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <LoaderCircleIcon class="size-3 animate-spin" />
                    saving…
                  </span>
                {:else if ownerRow}
                  <span class="text-xs text-muted-foreground">owner</span>
                {:else if !m.licenseKey}
                  <span class="text-xs text-muted-foreground">no key</span>
                {/if}
              </label>
            </td>
          </tr>
        {/each}
        {#if members.length === 0}
          <tr>
            <td colspan="5" class="px-6 py-6 text-center text-muted-foreground">
              No seats bound yet.
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </Card>

  <!-- Section 3: Manual revocations list with restore action -->
  <Card class="border-2 p-0 overflow-hidden">
    <div class="px-6 py-4 border-b">
      <h2 class="font-semibold">Revoked keys</h2>
      <p class="text-sm text-muted-foreground mt-1">
        Keys on this list are baked into the next bundle's deny-list. Restore
        a row to remove it from the next bundle.
      </p>
    </div>
    <table class="w-full text-sm">
      <thead class="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th class="text-left font-medium px-6 py-2.5">License key</th>
          <th class="text-left font-medium px-4 py-2.5">Reason</th>
          <th class="text-left font-medium px-4 py-2.5">Revoked at</th>
          <th class="text-right font-medium px-6 py-2.5">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each revocations as r (r.id)}
          {@const busy = pendingKey === r.licenseKey}
          <tr class="border-t border-border/60">
            <td class="px-6 py-3 font-mono text-xs">{maskKey(r.licenseKey)}</td>
            <td class="px-4 py-3 capitalize text-xs">{r.reason.replace(/_/g, " ")}</td>
            <td class="px-4 py-3 font-mono text-xs text-muted-foreground">
              {formatUnix(r.revokedAt)}
            </td>
            <td class="px-6 py-3 text-right">
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onclick={() => setRevoked(r.licenseKey, false)}
              >
                {#if busy}
                  <LoaderCircleIcon class="size-3.5 animate-spin mr-1.5" />
                  Restoring…
                {:else}
                  <RotateCcwIcon class="size-3.5 mr-1.5" />
                  Restore
                {/if}
              </Button>
            </td>
          </tr>
        {/each}
        {#if revocations.length === 0}
          <tr>
            <td colspan="4" class="px-6 py-6 text-center text-muted-foreground">
              No keys revoked yet.
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </Card>

  <!-- Section 4: Download bundle -->
  <Card class="border-2 p-6">
    <h2 class="font-semibold mb-2">Download bundle</h2>
    <p class="text-sm text-muted-foreground mb-4">
      The bundle is a signed snapshot of subscription
      <span class="font-mono text-xs">{license.dodoSubscriptionId || "—"}</span>:
      tier <span class="font-medium">{tier}</span>, {license.seats}
      seat{license.seats === 1 ? "" : "s"}, expiring
      <span class="font-mono text-xs">{formatUnix(computedNotAfter)}</span>, with
      {revocations.length} revoked key{revocations.length === 1 ? "" : "s"}.
    </p>
    {#if downloadError}
      <div
        class="mb-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
      >
        <AlertTriangleIcon class="size-4 mt-0.5 shrink-0" />
        <span>{downloadError}</span>
      </div>
    {/if}
    <Button onclick={downloadBundle} disabled={downloadBusy} size="lg">
      {#if downloadBusy}
        <LoaderCircleIcon class="size-4 animate-spin mr-2" />
        Preparing bundle…
      {:else}
        <DownloadIcon class="size-4 mr-2" />
        Download offline license bundle
      {/if}
    </Button>
  </Card>

  <!-- Section 5: Recently issued bundles audit list -->
  <Card class="border-2 p-0 overflow-hidden">
    <div class="px-6 py-4 border-b">
      <h2 class="font-semibold">Recently issued</h2>
      <p class="text-sm text-muted-foreground mt-1">
        The last {recentBundles.length || 5} bundles signed for this subscription.
      </p>
    </div>
    <table class="w-full text-sm">
      <thead class="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th class="text-left font-medium px-6 py-2.5">Issued at</th>
          <th class="text-left font-medium px-4 py-2.5">Expires at</th>
          <th class="text-left font-medium px-4 py-2.5">Payload sha256</th>
          <th class="text-left font-medium px-4 py-2.5">Signing key</th>
          <th class="text-left font-medium px-6 py-2.5">Issued by</th>
        </tr>
      </thead>
      <tbody>
        {#each recentBundles as b (b.id)}
          <tr class="border-t border-border/60">
            <td class="px-6 py-3 font-mono text-xs">{formatUnix(b.issuedAt)}</td>
            <td class="px-4 py-3 font-mono text-xs">{formatUnix(b.notAfter)}</td>
            <td class="px-4 py-3 font-mono text-xs">{shortHash(b.payloadSha256)}</td>
            <td class="px-4 py-3 font-mono text-xs">{shortHash(b.pubkeyFingerprint)}</td>
            <td class="px-6 py-3 font-mono text-xs text-muted-foreground">
              {b.issuedByUserId || "—"}
            </td>
          </tr>
        {/each}
        {#if recentBundles.length === 0}
          <tr>
            <td colspan="5" class="px-6 py-6 text-center text-muted-foreground">
              No bundles issued yet.
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </Card>
</div>
