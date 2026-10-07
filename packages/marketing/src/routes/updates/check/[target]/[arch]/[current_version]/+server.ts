import { env } from "cloudflare:workers";
import { latestJsonFor } from "#lib/server/releases.js";

export const GET = async ({ params }) => {
  console.log("Checking for available updates.", { params });
  return latestJsonFor("stable", env);
};
