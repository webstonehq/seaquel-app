import { building, dev } from "$app/env";
import { env, waitUntil } from "cloudflare:workers";
import { SqlDatabase } from "remult";
import { remultApi } from "remult/remult-sveltekit";
import { auth } from "./auth";
import { entities } from "#lib/entities/index.js";
import { readEnv } from "#lib/server/control/env.js";
import { getDnsClient } from "#lib/server/control/dns.js";
import {
  provisionTenant,
  deprovisionTenant,
  type ProvisionTenantInput,
} from "#lib/server/control/tenants.js";
import type { Tenant } from "#lib/entities/tenant.js";

// Module augmentation so entity BackendMethods can read per-request
// orchestrator bindings and the caller's email off `remult.context` with
// full type safety. Populated in `initRequest` below (and in the auth
// module's `initRequest` for `userEmail`).
declare module "remult" {
  export interface RemultContext {
    orchestrator?: {
      provisionTenant: (input: ProvisionTenantInput) => Promise<Tenant>;
      deprovisionTenant: (tenantId: string) => Promise<void>;
    };
    userEmail?: string;
  }
}

export const api = remultApi({
  dataProvider: async () => {
    if (dev) {
      const Database = (await import("better-sqlite3")).default;
      const { BetterSqlite3DataProvider } =
        await import("remult/remult-better-sqlite3");
      return new SqlDatabase(
        new BetterSqlite3DataProvider(new Database("./seaquel.sqlite")),
      );
    }
  },
  initRequest: async (event, { remult }) => {
    if (!dev && !building) {
      const { createD1DataProvider } = await import("remult/remult-d1");
      remult.dataProvider = createD1DataProvider(
        env.SEAQUEL_DB,
      );
    }

    // Per-request orchestrator binding. BackendMethods on `Tenant` read
    // these off `remult.context` rather than taking a RequestEvent —
    // keeps the entity file free of $lib/server imports (which would
    // break the client bundle).
    //
    // Env access is deferred until the method actually fires: the
    // Cloudflare adapter's `cloudflare:workers` env throws if a
    // prerenderable route (like `/blog`) touches it. `initRequest` runs
    // on every request — including those routes — so reading env eagerly
    // here would break unrelated pages. Inside the closure the caller is
    // always an authenticated /api/* request, so env access is safe.
    const resolveDeps = () => {
      const cpEnv = readEnv();
      const dns = getDnsClient(cpEnv);
      return { env: cpEnv, dns, waitUntil };
    };
    remult.context.orchestrator = {
      provisionTenant: (input) => provisionTenant(resolveDeps(), input),
      deprovisionTenant: (tenantId) =>
        deprovisionTenant(resolveDeps(), tenantId),
    };
  },
  admin: dev,
  entities,
  modules: [
    auth({
      // Add some roles to some users with env variable.
      // SUPER_ADMIN_EMAILS
    }),
  ],
});
