/**
 * Browser-side Better Auth client. Used by the dashboard's signup /
 * signin pages. The server-side handler is wired in
 * `src/lib/server/remult/better-auth.ts`; this client talks to those
 * `/api/auth/*` endpoints.
 *
 * `baseURL` is intentionally relative ("") so the client uses the
 * current origin — works in dev (`localhost:5173`), wrangler dev
 * (`localhost:8787`), and prod (`seaquel.app`) without env-aware config.
 */
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "",
});
