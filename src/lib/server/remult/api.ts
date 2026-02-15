import Database from "better-sqlite3";
import { SqlDatabase } from "remult";
import { remultApi } from "remult/remult-sveltekit";
import { BetterSqlite3DataProvider } from "remult/remult-better-sqlite3";
import { auth } from "./auth";

export const api = remultApi({
  dataProvider: new SqlDatabase(
    new BetterSqlite3DataProvider(new Database("./seaquel.sqlite")),
  ),
  admin: true,
  entities: [],
  modules: [
    auth({
      // Add some roles to some users with env variable.
      // SUPER_ADMIN_EMAILS
    }),
  ],
});
