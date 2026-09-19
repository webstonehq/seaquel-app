/**
 * /unsubscribe?t=<token>
 *
 * A page, not an API call, and deliberately split across GET and POST:
 * corporate mail scanners and link prefetchers request every URL in an
 * email, so a mutating GET would unsubscribe people who never clicked.
 * The load only reads; the form action does the write.
 *
 * Unknown and already-used tokens render the same "you're unsubscribed"
 * state as a successful one. That keeps the page from confirming whether
 * a token is real, and means a second click reads as success rather than
 * an error.
 */
import { fail } from "@sveltejs/kit";
import { remult } from "remult";
import { EmailConsent } from "$lib/entities/email-consent";
import { maskEmail, type ConsentPurpose } from "$lib/server/consent";
import { enforceRateLimit } from "$lib/server/rate-limit";
import type { Actions, PageServerLoad } from "./$types";

const PURPOSE_LABELS: Record<ConsentPurpose, string> = {
  research: "feedback emails about Seaquel",
  newsletter: "the Seaquel blog newsletter",
};

const findByToken = async (token: string) =>
  token ? await remult.repo(EmailConsent).findFirst({ unsubscribeToken: token }) : undefined;

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  // Unsubscribe links land in inboxes and caches; never store the page.
  setHeaders({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex" });

  const token = url.searchParams.get("t") ?? "";
  const row = await findByToken(token);

  if (!row || row.status === "unsubscribed") {
    return { state: "done" as const, email: null, purposeLabel: null };
  }
  return {
    state: "confirm" as const,
    email: maskEmail(row.email),
    purposeLabel: PURPOSE_LABELS[row.purpose as ConsentPurpose] ?? "Seaquel emails",
  };
};

export const actions: Actions = {
  default: async (event) => {
    // Token guessing is infeasible at 32 bytes, but the limit keeps the
    // endpoint from being used as a probe generator.
    await enforceRateLimit(event, { bucket: "unsubscribe", windowSeconds: 60, max: 10 });

    const form = await event.request.formData();
    const token = String(form.get("token") ?? "");
    const row = await findByToken(token);

    if (row && row.status !== "unsubscribed") {
      try {
        await remult.repo(EmailConsent).update(row.id, {
          status: "unsubscribed",
          unsubscribedAt: new Date(),
        });
      } catch (err) {
        console.error("[unsubscribe] update failed", err);
        return fail(500, { state: "error" as const });
      }
    }
    // Unknown token: nothing to do, but report success all the same.
    return { state: "done" as const };
  },
};
