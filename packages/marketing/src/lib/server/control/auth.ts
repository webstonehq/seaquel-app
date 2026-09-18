/**
 * Small helper used by every control-plane API route. Verifies there's
 * an authenticated Better Auth session and returns the user id (which is
 * the same as `remult.user.id` once Remult's auth module runs).
 *
 * SvelteKit's `error(status)` returns a typed error that bubbles up to
 * the framework's default 4xx handling — exactly what we want for
 * missing auth on JSON endpoints.
 */
import { error } from "@sveltejs/kit";
import { remult } from "remult";

export function requireUserId(): string {
  const user = remult.user;
  if (!user?.id) throw error(401, "unauthorized");
  return user.id;
}
