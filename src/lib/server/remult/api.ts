import { dev } from "$app/environment";
import { SqlDatabase } from "remult";
import { remultApi } from "remult/remult-sveltekit";
import { auth } from "./auth";
import type { D1Database } from "@cloudflare/workers-types";

let resolveD1: (db: D1Database) => void;
const d1Promise = new Promise<D1Database>((resolve) => {
  resolveD1 = resolve;
});
export function setD1(db: D1Database) {
  resolveD1(db);
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
    const { createD1DataProvider } = await import("remult/remult-d1");
    const d1 = await d1Promise;
    return createD1DataProvider(d1);
  },
  admin: dev,
  entities: [],
  modules: [
    auth({
      // Add some roles to some users with env variable.
      // SUPER_ADMIN_EMAILS
    }),
  ],
});
