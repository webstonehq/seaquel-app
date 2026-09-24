import { describe, expect, it } from 'vitest';
import { highlight, tokenize } from './sql-highlight';

/** Only the colored tokens, as `type:text`, to keep expectations readable. */
const colored = (sql: string) =>
	tokenize(sql)
		.filter((t) => t.type)
		.map((t) => `${t.type}:${t.text}`);

describe('tokenize', () => {
	it('colors keywords case-insensitively and leaves identifiers plain', () => {
		expect(colored('select name FROM users Where id')).toEqual([
			'keyword:select',
			'keyword:FROM',
			'keyword:Where'
		]);
	});

	it('treats a word directly followed by ( as a function call', () => {
		expect(colored('count(*)')).toEqual(['function:count', 'operator:*']);
		// Column lists after a table name have a space and stay plain.
		expect(colored('INSERT INTO books (id)')).toEqual(['keyword:INSERT', 'keyword:INTO']);
		// Keywords win over the call rule: VALUES(, IN(, varchar(.
		expect(colored('VALUES(1)')).toEqual(['keyword:VALUES', 'number:1']);
	});

	it('handles strings with doubled quotes, E-strings and dollar quotes', () => {
		expect(colored(`'it''s'`)).toEqual([`string:'it''s'`]);
		expect(colored(`E'a\\'b'`)).toEqual([`string:E'a\\'b'`]);
		expect(colored('$$ SELECT 1 $$')).toEqual(['string:$$ SELECT 1 $$']);
		expect(colored('$fn$ a $$ b $fn$ x')).toEqual(['string:$fn$ a $$ b $fn$']);
	});

	it('runs unterminated strings and comments to the end while typing', () => {
		expect(colored(`WHERE a = 'abc`)).toEqual(['keyword:WHERE', 'operator:=', `string:'abc`]);
		expect(colored('/* note')).toEqual(['comment:/* note']);
	});

	it('does not color anything inside comments or quoted identifiers', () => {
		expect(colored('-- select 1\nSELECT')).toEqual(['comment:-- select 1', 'keyword:SELECT']);
		expect(colored('/* from */ 1')).toEqual(['comment:/* from */', 'number:1']);
		expect(colored('"select" "order"')).toEqual([]);
	});

	it('recognizes numbers but not digits inside identifiers', () => {
		expect(colored('1 2.5 .5 1e10')).toEqual(['number:1', 'number:2.5', 'number:.5', 'number:1e10']);
		expect(colored('t1 col_2')).toEqual([]);
	});

	it('recognizes multi-character operators as one token', () => {
		expect(colored('a::int <> b || c >= d')).toEqual([
			'operator:::',
			'keyword:int',
			'operator:<>',
			'operator:||',
			'operator:>='
		]);
	});

	it('never loses or reorders input', () => {
		const samples = [
			"SELECT p.name, sum(oi.quantity * oi.unit_price) AS revenue\nFROM order_items oi -- x\nWHERE a <> 'b''c' AND $$d$$ = \"E\"",
			"'unterminated",
			'/* open',
			'$tag$ never closed',
			'weird ` chars # @ ? { } [ ] \\ \t\r\n',
			''
		];
		for (const sql of samples) expect(tokenize(sql).map((t) => t.text).join('')).toBe(sql);
	});
});

describe('highlight', () => {
	it('wraps colored tokens in classed spans and escapes HTML', () => {
		expect(highlight("SELECT '<b>' & 1")).toBe(
			`<span class="t-keyword">SELECT</span> <span class="t-string">'&lt;b&gt;'</span> <span class="t-operator">&amp;</span> <span class="t-number">1</span>`
		);
	});
});
