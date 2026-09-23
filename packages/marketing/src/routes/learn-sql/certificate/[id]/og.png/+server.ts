import { error } from "@sveltejs/kit";
import { remult } from "remult";
import { Certificate } from "$lib/entities";
import { renderCertificateImage } from "$lib/server/certificate-image";
import type { RequestHandler } from "./$types";

/**
 * The OG image LinkedIn and friends fetch when a certificate is shared.
 *
 * Rendered per person because the name on the card is the whole reason anyone
 * posts one. Crawlers fetch this once and cache hard, so the immutable
 * max-age is deliberate: the image only changes if the learner renames the
 * certificate, which is rare enough to live with.
 */
export const GET: RequestHandler = async ({ params, url, platform }) => {
  const certificate = await remult.repo(Certificate).findId(params.id);
  if (!certificate) throw error(404, "Not found");

  const png = await renderCertificateImage(
    {
      name: certificate.name,
      lessonCount: certificate.lessonCount,
      challengeCount: certificate.challengeCount,
      issuedAt: certificate.issuedAt ?? new Date(),
    },
    { origin: url.origin, assets: platform?.env?.ASSETS },
  );

  return new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
};
