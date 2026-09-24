/**
 * The engines with an error code reference at /sql-errors/{engine}. Kept free
 * of the code lists themselves, which live server-side in
 * $lib/server/sql-error-codes, so the router and guide pages can use it.
 */

export const ENGINE_SLUGS = ['postgresql', 'mysql', 'sqlite', 'sql-server'] as const;
export type EngineSlug = (typeof ENGINE_SLUGS)[number];

/** As written in a guide's `messages`. */
export const ENGINE_NAMES: Record<EngineSlug, string> = {
	postgresql: 'PostgreSQL',
	mysql: 'MySQL',
	sqlite: 'SQLite',
	'sql-server': 'SQL Server'
};

export function isEngine(value: string): value is EngineSlug {
	return (ENGINE_SLUGS as readonly string[]).includes(value);
}

/**
 * The URL segment for a code. SQLite's numbers aren't what people search for;
 * its names are, so its codes are given (and linked) by name.
 */
export function codeSlug(engine: EngineSlug, code: string, name?: string): string {
	return engine === 'sqlite' && name ? name.toLowerCase().replaceAll('_', '-') : code;
}

export function codeHref(engine: EngineSlug, slug: string): string {
	return `/sql-errors/${engine}/${slug}`;
}
