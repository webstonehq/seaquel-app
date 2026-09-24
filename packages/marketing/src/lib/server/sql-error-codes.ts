import postgresql from '../../content/sql-error-codes/postgresql.json';
import mysql from '../../content/sql-error-codes/mysql.json';
import sqlite from '../../content/sql-error-codes/sqlite.json';
import sqlServer from '../../content/sql-error-codes/sql-server.json';
import { getSqlErrors } from '$lib/sql-errors';
import { ENGINE_NAMES, ENGINE_SLUGS, codeSlug as slugFor, isEngine, type EngineSlug } from '$lib/sql-errors/engines';

export { ENGINE_SLUGS, isEngine, type EngineSlug };

/**
 * Each engine's official list of error codes, as written by
 * scripts/fetch-sql-error-codes.ts. Server-only: the lists run to megabytes
 * and don’t belong in the client bundle.
 */

export interface ErrorCode {
	code: string;
	name?: string;
	message?: string;
	sqlstate?: string;
	severity?: number;
	category: string;
	description?: string;
	docsUrl: string;
}

export interface Engine {
	slug: EngineSlug;
	name: string;
	/** How the engine's own docs refer to one of these, e.g. "SQLSTATE". */
	codeLabel: string;
	sourceName: string;
	sourceUrl: string;
	intro: string;
}

export const ENGINES: Record<EngineSlug, Engine> = {
	postgresql: {
		slug: 'postgresql',
		name: ENGINE_NAMES.postgresql,
		codeLabel: 'SQLSTATE',
		sourceName: 'PostgreSQL documentation, Appendix A',
		sourceUrl: 'https://www.postgresql.org/docs/current/errcodes-appendix.html',
		intro:
			'PostgreSQL reports every error with a five-character SQLSTATE code. The first two characters are the class, so 42703 is a column problem in class 42, syntax error or access rule violation. Clients and drivers expose it as the error code, and PL/pgSQL can catch it by condition name.'
	},
	mysql: {
		slug: 'mysql',
		name: ENGINE_NAMES.mysql,
		codeLabel: 'Error',
		sourceName: 'MySQL 8.4 Error Reference',
		sourceUrl: 'https://dev.mysql.com/doc/mysql-errors/8.4/en/',
		intro:
			'MySQL errors carry a number, a symbol and a SQLSTATE, as in ERROR 1054 (42S22). Server errors come from mysqld; client errors, numbered from 2000, come from the client library when it can’t reach or talk to the server. MariaDB shares the older numbers, up to about 1900, and diverges after that.'
	},
	sqlite: {
		slug: 'sqlite',
		name: ENGINE_NAMES.sqlite,
		codeLabel: 'Result code',
		sourceName: 'SQLite Result and Error Codes',
		sourceUrl: 'https://www.sqlite.org/rescode.html',
		intro:
			'SQLite returns a result code from every API call. The 30 or so primary codes each cover a broad kind of failure. Extended codes carry the primary code in their low eight bits and say more about the cause, so SQLITE_CONSTRAINT_UNIQUE (2067) is a kind of SQLITE_CONSTRAINT (19). Mistakes in the SQL itself all come back as SQLITE_ERROR, with the details in the message.'
	},
	'sql-server': {
		slug: 'sql-server',
		name: ENGINE_NAMES['sql-server'],
		codeLabel: 'Msg',
		sourceName: 'Database Engine events and errors',
		sourceUrl:
			'https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/database-engine-events-and-errors',
		intro:
			'SQL Server identifies each message by number and severity, as in Msg 207, Level 16. This list covers the core engine errors, numbered below 10000, at severities 11 to 16: the ones caused by the query or the data, which you can fix yourself. Severities 17 and up are resource and system failures.'
	}
};

const CODES: Record<EngineSlug, ErrorCode[]> = {
	postgresql,
	mysql,
	sqlite,
	'sql-server': sqlServer
};

export function getEngineCodes(engine: EngineSlug): ErrorCode[] {
	return CODES[engine];
}

export function codeSlug(engine: EngineSlug, code: ErrorCode): string {
	return slugFor(engine, code.code, code.name);
}

/** "PostgreSQL 42703", "MySQL error 1054", "SQLITE_BUSY", "SQL Server error 207". */
export function codeTitle(engine: EngineSlug, code: ErrorCode): string {
	switch (engine) {
		case 'postgresql':
			return `PostgreSQL error ${code.code}`;
		case 'sqlite':
			return code.name ?? `SQLite result code ${code.code}`;
		default:
			return `${ENGINES[engine].name} error ${code.code}`;
	}
}

export interface GuideRef {
	slug: string;
	title: string;
}

/**
 * Guides that map to each code, keyed by engine and code slug. A guide gives
 * SQLite codes by name and the others by number, which is what the slug is.
 */
async function guidesByCode(): Promise<Map<string, GuideRef[]>> {
	const map = new Map<string, GuideRef[]>();
	for (const guide of await getSqlErrors()) {
		for (const [engine, value] of Object.entries(guide.codes)) {
			if (!isEngine(engine)) continue;
			const key = `${engine}:${slugFor(engine, value, value)}`;
			map.set(key, [...(map.get(key) ?? []), { slug: guide.slug, title: guide.title }]);
		}
	}
	return map;
}

/**
 * A code page earns a place in the index when it has something beyond the
 * one-line message: a guide, or an explanation from the engine's own docs.
 * The rest stay reachable but noindex, so they don't count as thin content.
 */
function indexable(code: ErrorCode, guides: GuideRef[]): boolean {
	return guides.length > 0 || Boolean(code.description);
}

export interface CodeListing {
	slug: string;
	code: string;
	name?: string;
	message?: string;
	indexable: boolean;
}

export interface EngineIndex {
	engine: Engine;
	count: number;
	categories: Array<{ name: string; codes: CodeListing[] }>;
}

export async function getEngineIndex(engine: EngineSlug): Promise<EngineIndex> {
	const guides = await guidesByCode();
	const categories = new Map<string, CodeListing[]>();
	for (const code of CODES[engine]) {
		const listing: CodeListing = {
			slug: codeSlug(engine, code),
			code: code.code,
			name: code.name,
			message: code.message,
			indexable: indexable(code, guides.get(`${engine}:${codeSlug(engine, code)}`) ?? [])
		};
		categories.set(code.category, [...(categories.get(code.category) ?? []), listing]);
	}
	return {
		engine: ENGINES[engine],
		count: CODES[engine].length,
		categories: [...categories].map(([name, codes]) => ({ name, codes }))
	};
}

export interface CodeRef {
	engine: EngineSlug;
	engineName: string;
	slug: string;
	code: string;
	name?: string;
}

export interface CodePage {
	engine: Engine;
	code: ErrorCode;
	title: string;
	indexable: boolean;
	guides: GuideRef[];
	/** The same mistake in other engines, from guides and matching SQLSTATEs. */
	equivalents: CodeRef[];
	/** Neighbours in the same class or range. */
	siblings: CodeRef[];
}

function ref(engine: EngineSlug, code: ErrorCode): CodeRef {
	return {
		engine,
		engineName: ENGINES[engine].name,
		slug: codeSlug(engine, code),
		code: code.code,
		name: code.name
	};
}

const SIBLINGS = 12;

export async function getCodePage(engine: EngineSlug, slug: string): Promise<CodePage | null> {
	const codes = CODES[engine];
	const index = codes.findIndex((c) => codeSlug(engine, c) === slug);
	if (index === -1) return null;
	const code = codes[index];

	const byCode = await guidesByCode();
	const guides = byCode.get(`${engine}:${slug}`) ?? [];

	const equivalents = new Map<string, CodeRef>();
	const mapped = (await getSqlErrors()).filter((g) => guides.some((r) => r.slug === g.slug));
	for (const guide of mapped) {
		for (const [other, value] of Object.entries(guide.codes)) {
			if (other === engine || !isEngine(other)) continue;
			const otherSlug = slugFor(other, value, value);
			const match = CODES[other].find((c) => codeSlug(other, c) === otherSlug);
			if (match) equivalents.set(`${other}:${otherSlug}`, ref(other, match));
		}
	}
	// PostgreSQL's code is a SQLSTATE, so a MySQL error that reports the same
	// SQLSTATE names the same condition.
	if (engine === 'mysql' && code.sqlstate) {
		const match = CODES.postgresql.find((c) => c.code === code.sqlstate);
		if (match) equivalents.set(`postgresql:${match.code}`, ref('postgresql', match));
	}

	const category = codes.filter((c) => c.category === code.category);
	const position = category.indexOf(code);
	const start = Math.max(0, Math.min(position - SIBLINGS / 2, category.length - SIBLINGS - 1));
	const siblings = category
		.slice(start, start + SIBLINGS + 1)
		.filter((c) => c !== code)
		.map((c) => ref(engine, c));

	return {
		engine: ENGINES[engine],
		code,
		title: codeTitle(engine, code),
		indexable: indexable(code, guides),
		guides,
		equivalents: [...equivalents.values()],
		siblings
	};
}

/** Every code page, for prerendering and the sitemap. */
export async function getAllCodePages(): Promise<
	Array<{ engine: EngineSlug; slug: string; indexable: boolean }>
> {
	const guides = await guidesByCode();
	return ENGINE_SLUGS.flatMap((engine) =>
		CODES[engine].map((code) => ({
			engine,
			slug: codeSlug(engine, code),
			indexable: indexable(code, guides.get(`${engine}:${codeSlug(engine, code)}`) ?? [])
		}))
	);
}
