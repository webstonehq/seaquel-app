/**
 * Lesson progress, kept in localStorage so the course needs no account.
 *
 * Signing in isn't required until someone claims a certificate, at which point
 * `exportProgress()` is handed to the server and merged into their account.
 * Everything here is deliberately storage-shaped rather than lesson-shaped so
 * that swap only touches this file.
 */

const KEY = 'seaquel:learn-sql:progress';

/** Solved challenge ids, keyed by lesson slug. */
export type Progress = Record<string, string[]>;

function read(): Progress {
	if (typeof localStorage === 'undefined') return {};
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		// Anything hand-edited or written by an older version is dropped rather
		// than trusted: a malformed entry here would break every lesson page.
		const clean: Progress = {};
		for (const [slug, ids] of Object.entries(parsed as Record<string, unknown>)) {
			if (Array.isArray(ids)) clean[slug] = ids.filter((id): id is string => typeof id === 'string');
		}
		return clean;
	} catch {
		return {};
	}
}

function write(progress: Progress): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(KEY, JSON.stringify(progress));
	} catch {
		// Private browsing, blocked storage, quota. Losing progress is bad but
		// throwing in the middle of a correct answer is worse.
	}
}

export function getSolved(slug: string): string[] {
	return read()[slug] ?? [];
}

export function markSolved(slug: string, challengeId: string): Progress {
	const progress = read();
	const solved = new Set(progress[slug] ?? []);
	solved.add(challengeId);
	progress[slug] = [...solved];
	write(progress);
	return progress;
}

export function exportProgress(): Progress {
	return read();
}

export function clearProgress(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.removeItem(KEY);
	} catch {
		/* see write() */
	}
}

/** Counts a lesson as done when every one of its challenges is solved. */
export function isLessonComplete(slug: string, challengeIds: string[]): boolean {
	if (challengeIds.length === 0) return false;
	const solved = new Set(getSolved(slug));
	return challengeIds.every((id) => solved.has(id));
}
