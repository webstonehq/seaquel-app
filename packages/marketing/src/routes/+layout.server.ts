import { dev } from "$app/environment";
import { remult } from "remult";
import type { LayoutServerLoad } from "./$types";

const ONE_MINUTE = 60;

export const load: LayoutServerLoad = ({ setHeaders }) => {
  if (!dev) {
    // Pages reference content-hashed /_app/immutable/ assets that only exist
    // for the current deploy, so HTML must not outlive it by much. Browsers
    // always revalidate; the edge absorbs the traffic but goes stale within a
    // minute of a deploy.
    setHeaders({
      "Cache-Control": `public, max-age=0, must-revalidate, s-maxage=${ONE_MINUTE}`,
      Vary: "Accept-Encoding",
    });
  }
  return { user: remult.user };
};
