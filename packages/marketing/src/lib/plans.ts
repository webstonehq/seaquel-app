/**
 * Single source of truth for plan metadata used across the marketing
 * site and the control-plane dashboard. Kept here (not next to either
 * consumer) so:
 *
 *   - the public pricing page (`/pricing`)
 *   - the dashboard tenant-creation form (`/dashboard/signup`, `/dashboard/new`)
 *
 * tell the same story. If a description changes, it changes once.
 *
 * The tier keys (`individual`, `business`) must match the values in
 * `PUBLIC_DODO_PRODUCT_MAP` — that's how `productId → human-readable
 * plan` resolution works. Adding a new plan means adding a new tier
 * here plus adding its Dodo product id to the product map.
 */
export interface PlanMeta {
  /** Human-readable name (title case). */
  name: string;
  /** One-sentence pitch shown next to the name. */
  description: string;
}

export const PLAN_META: Record<string, PlanMeta> = {
  individual: {
    name: "Individual",
    description:
      "For individual developers using Seaquel commercially or as freelancers.",
  },
  business: {
    name: "Business",
    description:
      "For teams and organizations. Reassign seats as your team changes.",
  },
};
