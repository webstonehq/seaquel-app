import { Allow, BackendMethod, Entity, Fields, remult } from "remult";
import { CHALLENGES, TOTAL_CHALLENGES } from "$lib/learn-sql/challenges";
import { LessonProgress } from "./lesson-progress";

/** The localStorage shape: solved challenge ids keyed by lesson slug. */
export type ClaimedProgress = Record<string, string[]>;

function catalogue(): [string, string[]][] {
  return Object.entries(CHALLENGES).map(([slug, list]) => [
    slug,
    list.map((challenge) => challenge.id),
  ]);
}

/**
 * Checks a progress map against the challenge catalogue.
 *
 * Counts only ids that actually exist, so a client sending a hundred made-up
 * ids gains nothing. Exported so the rules can be tested without a Remult
 * request context.
 */
export function verifyComplete(progress: ClaimedProgress): {
  complete: boolean;
  solved: number;
  missing: string[];
} {
  const missing: string[] = [];
  let solved = 0;

  for (const [slug, ids] of catalogue()) {
    const claimed = new Set(progress[slug] ?? []);
    for (const id of ids) {
      if (claimed.has(id)) solved += 1;
      else missing.push(id);
    }
  }

  return { complete: missing.length === 0, solved, missing };
}

/**
 * A completion certificate for the SQL course.
 *
 * All CRUD over the generic REST endpoint is denied. Issuing goes through
 * `claim`, which re-verifies the work server-side: the client reports which
 * challenges it solved and a client can always lie, so the certificate means
 * something only because `claim` checks those ids against `CHALLENGES` rather
 * than trusting a count. Public reads happen server-side by id in the
 * certificate route.
 */
@Entity<Certificate>("learn_sql_certificates", {
  allowApiCrud: false,
})
export class Certificate {
  /** Also the public URL segment: /learn-sql/certificate/<id>. */
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({ required: true, allowApiUpdate: false })
  userId = "";

  /**
   * Shown on the certificate and in its OG image. Copied from the account's
   * profile name at claim time; never supplied by the client.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  name = "";

  @Fields.integer({ allowApiUpdate: false })
  challengeCount = 0;

  @Fields.integer({ allowApiUpdate: false })
  lessonCount = 0;

  @Fields.createdAt({ allowApiUpdate: false })
  issuedAt?: Date;

  /**
   * Merge browser progress into the signed-in account and issue a certificate
   * if the course is complete. The name comes from the caller's profile.
   * Idempotent: claiming twice returns the same certificate rather than
   * minting a second one.
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async claim(progress: ClaimedProgress): Promise<{ id: string }> {
    const userId = remult.user?.id;
    if (!userId) throw "unauthorized";

    // The name is read from the signed-in profile rather than taken as an
    // argument, so a certificate can only ever carry the name on the account
    // that earned it.
    const name = remult.user?.name?.trim();
    if (!name) throw "add a name to your profile before claiming a certificate";

    const repo = remult.repo(LessonProgress);

    // Merge rather than replace: someone who did half the course on a phone
    // and half on a laptop should end up with the union of both, not
    // whichever device claimed last.
    for (const [slug, ids] of catalogue()) {
      const claimed = (progress?.[slug] ?? []).filter((id) => ids.includes(id));
      if (claimed.length === 0) continue;

      const existing = await repo.findFirst({ userId, lessonSlug: slug });
      if (existing) {
        const merged = [...new Set([...existing.solvedChallengeIds, ...claimed])];
        if (merged.length !== existing.solvedChallengeIds.length) {
          await repo.save({ ...existing, solvedChallengeIds: merged });
        }
      } else {
        await repo.insert({ userId, lessonSlug: slug, solvedChallengeIds: claimed });
      }
    }

    // Verify against what is now stored, not against what the client sent.
    const stored: ClaimedProgress = {};
    for (const row of await repo.find({ where: { userId } })) {
      stored[row.lessonSlug] = row.solvedChallengeIds;
    }

    const { complete, solved } = verifyComplete(stored);
    if (!complete) {
      throw `not finished yet — ${solved} of ${TOTAL_CHALLENGES} challenges solved`;
    }

    const certificates = remult.repo(Certificate);
    const existing = await certificates.findFirst({ userId });
    if (existing) {
      // Keeps the certificate in step with a later profile rename.
      if (existing.name !== name) await certificates.save({ ...existing, name });
      return { id: existing.id };
    }

    const issued = await certificates.insert({
      userId,
      name,
      challengeCount: TOTAL_CHALLENGES,
      lessonCount: Object.keys(CHALLENGES).length,
    });
    return { id: issued.id };
  }
}
