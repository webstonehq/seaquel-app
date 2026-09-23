import { Allow, Entity, Fields, remult } from "remult";

/**
 * One row per (user, lesson) holding the challenge ids that user has solved.
 *
 * Progress starts in localStorage so the course needs no account. It only
 * reaches this table when someone claims a certificate, at which point
 * `Certificate.claim` merges what the browser has into their account.
 *
 * Read-only over HTTP and scoped to the caller. Writes are closed because
 * `apiPrefilter` does not apply to inserts, so an open insert would let any
 * signed-in user mark every challenge solved for themselves and mint a
 * certificate they hadn't earned.
 */
@Entity<LessonProgress>("learn_sql_progress", {
  allowApiRead: Allow.authenticated,
  allowApiInsert: false,
  allowApiUpdate: false,
  allowApiDelete: false,
  apiPrefilter: () => ({ userId: remult.user?.id ?? "__none__" }),
})
export class LessonProgress {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({ required: true, allowApiUpdate: false })
  userId = "";

  /** Lesson slug, e.g. `"joins"`. */
  @Fields.string({ required: true, allowApiUpdate: false })
  lessonSlug = "";

  /** Solved challenge ids. Stored as JSON to mirror the localStorage shape. */
  @Fields.json<LessonProgress, string[]>()
  solvedChallengeIds: string[] = [];

  @Fields.createdAt({ allowApiUpdate: false })
  createdAt?: Date;

  @Fields.updatedAt({ allowApiUpdate: false })
  updatedAt?: Date;
}
