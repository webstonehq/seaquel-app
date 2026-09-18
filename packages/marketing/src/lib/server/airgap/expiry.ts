import type { License } from "$lib/entities/license";

/** Cancelled-license grace window before bundles hard-expire. 7 days. */
export const CANCELLED_GRACE_SECONDS = 7 * 24 * 60 * 60;

/**
 * `not_after` (unix seconds) for a bundle issued against `license` at
 * `nowSeconds`. Shared by `/api/control/airgap/bundle` and the airgap
 * dashboard page so the preview always matches what gets signed.
 *
 *   - Active license: end of the current billing cycle + `graceSeconds`.
 *   - Inactive license: cancellation time + 7 days. Anchored to when the
 *     license stopped being active — NOT to `nowSeconds` — so a cancelled
 *     customer can't keep re-downloading fresh bundles to stay entitled
 *     forever. `updatedAt` is the fallback for rows cancelled before
 *     `canceledAt` existed (the status flip is their last write).
 *
 * A result `<= nowSeconds` means no bundle should be issued.
 */
export function computeBundleNotAfter(
  license: Pick<License, "status" | "currentPeriodEnd" | "canceledAt" | "updatedAt">,
  graceSeconds: number,
  nowSeconds: number,
): number {
  if (license.status === "active") {
    const periodEnd = license.currentPeriodEnd
      ? Math.floor(license.currentPeriodEnd.getTime() / 1000)
      : nowSeconds;
    return periodEnd + graceSeconds;
  }
  const canceledAt = license.canceledAt ?? license.updatedAt;
  const anchor = canceledAt
    ? Math.floor(canceledAt.getTime() / 1000)
    : nowSeconds;
  return anchor + CANCELLED_GRACE_SECONDS;
}
