/**
 * Just enough SQL (Postgres-flavored) tokenizing to color an editor. It never
 * rejects input: half-typed strings and comments run to the end, and anything
 * it doesn't recognize is plain text, so the tokens always add up to the
 * original string.
 */

export type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'operator';
export interface Token {
	type: TokenType | null;
	text: string;
}

const KEYWORDS = new Set(
	`
	add all alter analyze and any as asc begin between bigint bigserial boolean bool both by
	bytea cascade case cast char character check column commit conflict constraint create
	cross current_date current_time current_timestamp date decimal default delete desc distinct
	do double drop else end except exists explain false fetch filter first float following for
	foreign from full grant group having if ilike in index inner insert int integer intersect
	interval into is join json jsonb key lateral leading left like limit materialized natural
	next not nothing null nulls numeric offset on only or order outer over partition precision
	preceding primary range real recursive references replace returning revoke right rollback
	row rows schema select sequence serial set similar smallint some table temp temporary text
	then time timestamp timestamptz to trailing transaction trigger true truncate unbounded
	union unique update using uuid values varchar view when where window with without
	`
		.trim()
		.split(/\s+/)
);

/** Tried in order at each position; the first match wins. */
const RULES: [TokenType | 'word' | null, RegExp][] = [
	['comment', /--[^\n]*/y],
	['comment', /\/\*[\s\S]*?(?:\*\/|$)/y],
	// E'...' allows backslash escapes; plain '...' only doubles its quotes.
	['string', /[eE]'(?:[^'\\]|\\[\s\S]|'')*'?/y],
	['string', /'(?:[^']|'')*'?/y],
	// Postgres dollar quoting: $$...$$ or $tag$...$tag$.
	['string', /\$([A-Za-z_]\w*)?\$[\s\S]*?(?:\$\1\$|$)/y],
	// "Quoted identifiers" stay plain, but must be consumed whole so nothing
	// inside them gets colored.
	[null, /"(?:[^"]|"")*"?/y],
	['word', /[A-Za-z_][\w$]*/y],
	['number', /(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y],
	['operator', /::|<>|!=|<=|>=|\|\||[-+*/%<>=~!^&|]/y]
];

export function tokenize(sql: string): Token[] {
	const tokens: Token[] = [];
	const push = (type: TokenType | null, text: string) => {
		const last = tokens.at(-1);
		// Merge plain runs so whitespace and punctuation don't become one span each.
		if (type === null && last && last.type === null) last.text += text;
		else tokens.push({ type, text });
	};

	let pos = 0;
	scan: while (pos < sql.length) {
		for (const [kind, regex] of RULES) {
			regex.lastIndex = pos;
			const match = regex.exec(sql);
			if (!match || !match[0]) continue;
			const text = match[0];
			pos += text.length;
			if (kind === 'word') {
				if (KEYWORDS.has(text.toLowerCase())) push('keyword', text);
				// `count(` is a call; `books (` in an INSERT column list isn't.
				else if (sql[pos] === '(') push('function', text);
				else push(null, text);
			} else {
				push(kind, text);
			}
			continue scan;
		}
		push(null, sql[pos]);
		pos++;
	}
	return tokens;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escape = (text: string) => text.replace(/[&<>]/g, (c) => ESCAPES[c]);

/** HTML for a `white-space: pre-wrap` element; colored tokens get a `t-<type>` class. */
export function highlight(sql: string): string {
	return tokenize(sql)
		.map(({ type, text }) => (type ? `<span class="t-${type}">${escape(text)}</span>` : escape(text)))
		.join('');
}
