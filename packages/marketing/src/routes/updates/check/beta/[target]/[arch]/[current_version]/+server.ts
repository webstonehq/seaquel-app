import { latestJsonFor } from "$lib/server/releases";

export const GET = async ({ params, platform }) => {
  console.log("Checking for available beta updates.", { params });
  return latestJsonFor("beta", platform);
};
