import { describe, expect, it } from "vitest";
import { CANCELLED_GRACE_SECONDS, computeBundleNotAfter } from "./expiry";

const NOW = 1_800_000_000;
const at = (s: number) => new Date(s * 1000);
const GRACE = 2_592_000;

describe("computeBundleNotAfter", () => {
  it("active: period end + grace", () => {
    const license = { status: "active", currentPeriodEnd: at(NOW + 100), updatedAt: at(NOW) };
    expect(computeBundleNotAfter(license, GRACE, NOW)).toBe(NOW + 100 + GRACE);
  });

  it("active without a period end: now + grace", () => {
    const license = { status: "active", updatedAt: at(NOW) };
    expect(computeBundleNotAfter(license, GRACE, NOW)).toBe(NOW + GRACE);
  });

  it("cancelled: anchored to canceledAt, not to now", () => {
    const canceled = NOW - 3 * 86_400;
    const license = { status: "canceled", canceledAt: at(canceled), updatedAt: at(NOW) };
    expect(computeBundleNotAfter(license, GRACE, NOW)).toBe(canceled + CANCELLED_GRACE_SECONDS);
    // Re-requesting later does not move the expiry forward.
    expect(computeBundleNotAfter(license, GRACE, NOW + 86_400)).toBe(
      canceled + CANCELLED_GRACE_SECONDS,
    );
  });

  it("cancelled past the grace window: expiry is in the past", () => {
    const license = { status: "expired", canceledAt: at(NOW - 8 * 86_400), updatedAt: at(NOW) };
    expect(computeBundleNotAfter(license, GRACE, NOW)).toBeLessThanOrEqual(NOW);
  });

  it("cancelled before canceledAt existed: falls back to updatedAt", () => {
    const license = { status: "canceled", updatedAt: at(NOW - 86_400) };
    expect(computeBundleNotAfter(license, GRACE, NOW)).toBe(NOW - 86_400 + CANCELLED_GRACE_SECONDS);
  });
});
