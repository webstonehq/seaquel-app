import { error } from "@sveltejs/kit";
import { remult } from "remult";
import { Certificate } from "$lib/entities";
import type { PageServerLoad } from "./$types";

// Certificates are meant to be shared, so this route is public and read
// server-side. The entity itself is closed over REST (`allowApiCrud: false`),
// which is what keeps the rest of the table unreadable.
export const load: PageServerLoad = async ({ params, setHeaders }) => {
  const certificate = await remult.repo(Certificate).findId(params.id);
  if (!certificate) throw error(404, "Certificate not found");

  // Shareable and immutable apart from the name, so let crawlers and
  // repeat visits cache it.
  setHeaders({ "Cache-Control": "public, max-age=300, s-maxage=3600" });

  return {
    certificate: {
      id: certificate.id,
      name: certificate.name,
      challengeCount: certificate.challengeCount,
      lessonCount: certificate.lessonCount,
      issuedAt: certificate.issuedAt?.toISOString() ?? null,
    },
    isOwner: remult.user?.id === certificate.userId,
  };
};
