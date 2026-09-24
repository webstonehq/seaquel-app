/**
 * Downloads each engine's official list of error codes and writes it to
 * src/content/sql-error-codes/{engine}.json, which /sql-errors/{engine} pages
 * are built from. The build never fetches; rerun this (pnpm errors:update)
 * after a new release and review the diff.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface ErrorCode {
	code: string;
	/** Condition name (PostgreSQL), symbol (MySQL, SQL Server) or result code name (SQLite). */
	name?: string;
	message?: string;
	sqlstate?: string;
	severity?: number;
	category: string;
	/** Plain-text explanation from the source, where it has one. */
	description?: string;
	docsUrl: string;
}

const OUT_DIR = join(import.meta.dirname, '../src/content/sql-error-codes');

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`);
	return res.text();
}

const ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	mdash: '—',
	ndash: '–',
	rsquo: '’',
	lsquo: '‘',
	rdquo: '”',
	ldquo: '“'
};

function decode(text: string): string {
	return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, entity: string) => {
		if (entity[0] === '#') {
			const hex = entity[1] === 'x' || entity[1] === 'X';
			return String.fromCodePoint(parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
		}
		return ENTITIES[entity] ?? match;
	});
}

/** Strips tags, decodes entities and collapses whitespace. */
function text(html: string): string {
	return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

// --- PostgreSQL ---------------------------------------------------------------

async function postgresql(): Promise<ErrorCode[]> {
	const url = 'https://www.postgresql.org/docs/current/errcodes-appendix.html';
	const html = await fetchText(url);
	const codes: ErrorCode[] = [];
	let category = '';

	// The table is one <tr> per class heading or per code, in order.
	for (const [, row] of html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
		const heading = row.match(/<strong>(Class [\s\S]*?)<\/strong>/);
		if (heading) {
			category = text(heading[1]);
			continue;
		}
		const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => text(m[1]));
		if (cells.length !== 2 || !/^[0-9A-Z]{5}$/.test(cells[0])) continue;
		codes.push({
			code: cells[0],
			name: cells[1],
			sqlstate: cells[0],
			category,
			docsUrl: url
		});
	}
	return codes;
}

// --- MySQL --------------------------------------------------------------------

async function mysqlReference(page: string, category: string): Promise<ErrorCode[]> {
	const url = `https://dev.mysql.com/doc/mysql-errors/8.4/en/${page}`;
	const html = await fetchText(url);
	const codes: ErrorCode[] = [];

	for (const chunk of html.split('Error number:').slice(1)) {
		const entry = chunk.split('</li>')[0];
		const code = entry.match(/^\s*<code class="literal">([^<]+)<\/code>/)?.[1];
		// MY-0xxxxx numbers are server error-log messages; clients never see them.
		if (!code || !/^\d+$/.test(code)) continue;
		const symbol = entry.match(/Symbol:\s*<a[^>]*href="[^"]*#([^"]+)"[^>]*><code[^>]*>([^<]+)</);
		const sqlstate = entry.match(/SQLSTATE:\s*<code[^>]*>([^<]+)</)?.[1];
		const message = entry.match(/Message:([\s\S]*?)<\/p>/)?.[1];
		codes.push({
			code,
			name: symbol?.[2],
			message: message ? text(message) : undefined,
			sqlstate,
			category,
			docsUrl: symbol ? `${url}#${symbol[1]}` : url
		});
	}
	return codes;
}

async function mysql(): Promise<ErrorCode[]> {
	return [
		...(await mysqlReference('server-error-reference.html', 'Server errors')),
		...(await mysqlReference('client-error-reference.html', 'Client errors'))
	];
}

// --- SQLite -------------------------------------------------------------------

async function sqlite(): Promise<ErrorCode[]> {
	const url = 'https://www.sqlite.org/rescode.html';
	const html = await fetchText(url);
	const codes: ErrorCode[] = [];

	// Each code is `<a name="x"></a><h3>(N) NAME</h3>` followed by paragraphs,
	// up to the next HTML-comment divider.
	const sections = html.matchAll(
		/<a name="([^"]+)"><\/a>\s*<h3>\((\d+)\)\s*(SQLITE_[A-Z_0-9]+)<\/h3>([\s\S]*?)(?=<!--|<a name="[^"]+"><\/a>\s*<h|$)/g
	);
	for (const [, anchor, number, name, body] of sections) {
		const paragraphs = body
			.split(/<\/?p>/)
			.map(text)
			.filter(Boolean);
		// Extended codes carry their primary code in the low 8 bits.
		const primary = Number(number) & 0xff;
		codes.push({
			code: number,
			name,
			category: String(primary),
			description: paragraphs.join('\n\n') || undefined,
			docsUrl: `${url}#${anchor}`
		});
	}

	// Name the categories after their primary code.
	const primaryName = new Map(codes.filter((c) => Number(c.code) < 256).map((c) => [c.code, c.name!]));
	for (const c of codes) c.category = primaryName.get(c.category) ?? c.category;
	return codes;
}

// --- SQL Server ---------------------------------------------------------------

const MSSQL_REPO = 'https://raw.githubusercontent.com/MicrosoftDocs/sql-docs/live/docs/relational-databases/errors-events';
const MSSQL_DOCS = 'https://learn.microsoft.com/en-us/sql/relational-databases/errors-events';

/** The ranges below 10000 cover the core engine; the rest is feature-specific. */
const MSSQL_RANGES = [
	'0-999',
	'1000-1999',
	'2000-2999',
	'3000-3999',
	'4000-4999',
	'5000-5999',
	'6000-6999',
	'7000-7999',
	'8000-8999',
	'9000-9999'
];

/** Unescapes the markdown in a table cell. */
function unmarkdown(cell: string): string {
	return decode(cell.replace(/\\([*_\\[\]<>|`])/g, '$1').replace(/<br\s*\/?>/g, ' ')).trim();
}

/** Product names the docs pull in with [!INCLUDE] tokens. */
const MSSQL_INCLUDES: Array<[RegExp, string]> = [
	[/^ssde/i, 'SQL Server Database Engine'],
	[/^tsql/i, 'Transact-SQL'],
	[/^ssmanstudio|^ssms/i, 'SQL Server Management Studio'],
	[/^(?:sql|ssversion|sssql)(\d{4}(?:r2)?)/i, 'SQL Server $1'],
	[/^ss/i, 'SQL Server']
];

function resolveIncludes(md: string): string {
	return md.replace(/\[!INCLUDE\s*\[([^\]]*)\]\(([^)]*)\)\]/g, (_, name: string, path: string) => {
		// "Applies to" banners carry no prose.
		if (path.includes('applies-to-version')) return '';
		for (const [pattern, replacement] of MSSQL_INCLUDES) {
			const match = name.match(pattern);
			if (match) return replacement.replace('$1', (match[1] ?? '').toUpperCase());
		}
		return 'SQL Server';
	});
}

/** Markdown inline syntax to plain text. */
function plain(md: string): string {
	return unmarkdown(
		md
			.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
			.replace(/\*\*|__|`/g, '')
			.replace(/(^|\W)\*(\S[^*]*?\S|\S)\*(?=\W|$)/g, '$1$2')
			.replace(/\s+/g, ' ')
	);
}

/**
 * Opening of the explanation in a per-error article: its first paragraph,
 * plus the list that follows when the paragraph only introduces one.
 */
async function mssqlExplanation(article: string): Promise<{ description?: string; name?: string }> {
	const md = resolveIncludes(await fetchText(`${MSSQL_REPO}/${article}`));
	const name = md.match(/\|\s*Symbolic Name\s*\|\s*([^|]*?)\s*\|/)?.[1];

	const section = ['Explanation', 'Cause', 'Symptoms']
		.map((heading) => md.split(new RegExp(`^##\\s+${heading}\\s*$`, 'mi'))[1])
		.find(Boolean)
		?.split(/^#{2,}\s/m)[0];
	const blocks = (section ?? '')
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter((b) => b && !b.startsWith('```') && !b.startsWith('|') && !b.startsWith('>'));

	const paragraphs: string[] = [];
	const lead = blocks.shift();
	if (lead && !/^([-*]|\d+\.)\s/.test(lead)) {
		paragraphs.push(plain(lead));
		if (/[:]$|following/i.test(lead)) {
			for (const block of blocks) {
				const item = block.match(/^([-*]|\d+\.)\s+([\s\S]*)/);
				if (!item) break;
				paragraphs.push(plain(item[2]));
			}
		}
	}
	const description = paragraphs.filter(Boolean).join('\n\n') || undefined;
	return { description, name: name && name !== 'N/A' ? name : undefined };
}

async function sqlServer(): Promise<ErrorCode[]> {
	const codes: ErrorCode[] = [];
	const articles = new Map<string, string>();

	for (const range of MSSQL_RANGES) {
		const md = await fetchText(
			`${MSSQL_REPO}/includes/sql-server-2025-database-engine-events-and-errors-${range}.md`
		);
		const [from, to] = range.split('-');
		for (const line of md.split('\n')) {
			const row = line.match(/^\|\s*(\[(\d+)\]\(([^)]+)\)|\d+)\s*\|\s*(\d+)\s*\|\s*\w+\s*\|(.*)\|\s*$/);
			if (!row) continue;
			const code = row[2] ?? row[1];
			const severity = Number(row[4]);
			// 11-16 are errors the user can correct; 10 and below are
			// informational, 17 and up are resource or system failures.
			if (severity < 11 || severity > 16) continue;
			if (row[3]) articles.set(code, row[3].replace(/^\.\.\//, ''));
			codes.push({
				code,
				message: unmarkdown(row[5]),
				severity,
				category: `${from}–${to}`,
				docsUrl: `${MSSQL_DOCS}/database-engine-events-and-errors-${range.replace('-', '-to-')}`
			});
		}
	}

	for (const c of codes) {
		const article = articles.get(c.code);
		if (!article) continue;
		const { description, name } = await mssqlExplanation(article);
		c.description = description;
		c.name = name;
		c.docsUrl = `${MSSQL_DOCS}/${article.replace(/\.md$/, '')}`;
	}
	return codes;
}

// ------------------------------------------------------------------------------

const engines: Record<string, () => Promise<ErrorCode[]>> = {
	postgresql,
	mysql,
	sqlite,
	'sql-server': sqlServer
};

mkdirSync(OUT_DIR, { recursive: true });
const only = process.argv.slice(2);

for (const [engine, load] of Object.entries(engines)) {
	if (only.length > 0 && !only.includes(engine)) continue;
	const codes = await load();
	if (codes.length === 0) throw new Error(`${engine}: parsed no codes; has the source page changed?`);
	const unique = new Map(codes.map((c) => [c.code, c]));
	writeFileSync(join(OUT_DIR, `${engine}.json`), JSON.stringify([...unique.values()], null, '\t') + '\n');
	console.log(`${engine}: ${unique.size} codes`);
}
