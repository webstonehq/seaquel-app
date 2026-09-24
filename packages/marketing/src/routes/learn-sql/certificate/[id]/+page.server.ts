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

  // Shareable and immutable apart from the name, but the HTML still points at
  // per-deploy asset hashes, so it gets the same short TTL as every other page.
  setHeaders({ "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=60" });

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
