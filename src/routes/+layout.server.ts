import { dev } from "$app/environment";
import { remult } from "remult";
import type { LayoutServerLoad } from "./$types";

const ONE_MINUTE = 60;
const FIFTEEN_MINUTES = ONE_MINUTE * 15;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export const load: LayoutServerLoad = ({ setHeaders }) => {
  if (!dev) {
    setHeaders({
      "Cache-Control": `public, max-age=${FIFTEEN_MINUTES}, s-maxage=${ONE_DAY}`,
      Vary: "Accept-Encoding",
    });
  }
  return { user: remult.user };
};
