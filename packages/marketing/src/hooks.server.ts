import { sequence } from "@sveltejs/kit/hooks";
import { api as handleRemult } from "#lib/server/remult/api.js";
import { handleAuth } from "#lib/server/remult/handle-auth.js";

export const handle = sequence(handleRemult, handleAuth);
