import { building, dev } from "$app/environment";
import { SqlDatabase } from "remult";
import { remultApi } from "remult/remult-sveltekit";
import { auth } from "./auth";

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
        event.platform.env.SEAQUEL_DB,
      );
    }
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
