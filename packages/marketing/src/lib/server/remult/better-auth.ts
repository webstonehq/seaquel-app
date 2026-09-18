import { betterAuth } from "better-auth";
import { remultAdapter } from "@nerdfolio/remult-better-auth";
import { authEntities } from "$lib/entities/auth-entities";
import { linkByVerifiedEmail } from "./auth-helpers";

export const auth = betterAuth({
  database: remultAdapter({
    // When you `npm run auth:generate` you need to have `authEntities: {}`
    // It generates all entites needed for better-auth. You might need to check diffs in GIT.
    // Help: https://github.com/nerdfolio/remult-better-auth
    authEntities,
    // authEntities: {},
    usePlural: true,
  }),
  user: {
    additionalFields: {
      roles: { type: "string[]" },
    },
  },

  // config example:
  emailAndPassword: {
    enabled: true,
  },

  // Link licenses / invites bought under the user's email once — on
  // sign-in and when the email becomes verified — instead of on every
  // request.
  databaseHooks: {
    session: {
      create: { after: async (session) => linkByVerifiedEmail(session.userId) },
    },
    user: {
      update: {
        after: async (user) => {
          if (user.emailVerified) await linkByVerifiedEmail(user.id);
        },
      },
    },
  },
});
