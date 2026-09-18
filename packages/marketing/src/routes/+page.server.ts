import type { PageServerLoad } from "./$types";

const LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</docs>; rel="service-doc"',
].join(", ");

export const load: PageServerLoad = ({ setHeaders }) => {
  setHeaders({ Link: LINK_HEADER });
  return {};
};
