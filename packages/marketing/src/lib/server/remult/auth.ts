import { Module } from "remult/server";
import { authEntities } from "$lib/entities/auth-entities";
import { Roles } from "./auth-roles";
import { addRolesToUser } from "./auth-helpers";
import { auth as betterAuth } from "./better-auth";
import { remult } from "remult";

export const auth = (o?: { SUPER_ADMIN_EMAILS?: string }) =>
  new Module({
    key: "auth",

    entities: Object.values(authEntities),

    initApi: async () => {
      // Add some roles to some users.
      const emails = (o?.SUPER_ADMIN_EMAILS ?? "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      await addRolesToUser(emails, Object.values(Roles));
    },

    initRequest: async () => {
      const s = await betterAuth.api.getSession({
        headers: new Headers(remult.context.headers?.getAll()),
      });

      if (s) {
        const roles = s.user.roles;

        // Tweak the remult.user object.
        remult.user = {
          id: s.user.id,
          name: s.user.name,
          roles,
        };

        // Stash email on the Remult context so entity BackendMethods can
        // stamp `TenantMember.email` for the owner row without a second
        // better-auth round-trip. UserInfo doesn't carry email itself.
        if (s.user.email) remult.context.userEmail = s.user.email;
      }
    },
  });
