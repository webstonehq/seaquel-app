/**
 * <seaquel-sql>: a "Run this SQL" block anyone can drop into a blog post.
 *
 *   <script type="module" src="https://seaquel.app/embed/seaquel-sql.js"></script>
 *   <seaquel-sql>
 *     <script type="text/sql">CREATE TABLE ...; INSERT ...;</script>
 *     <pre>SELECT * FROM ...</pre>
 *     <a href="https://seaquel.app">Powered by Seaquel</a>
 *   </seaquel-sql>
 *
 * The <pre> is the starting query and doubles as the no-JS fallback. The
 * optional <script type="text/sql"> is setup SQL; without one the widget runs
 * against the sample shop from /learn-sql. Several widgets can share one setup
 * via `setup="#some-id"` pointing at a <script type="text/sql"> elsewhere on
 * the page. Postgres (PGlite) only downloads once a reader reaches for a widget.
 *
 * Colors follow the reader's OS setting; `theme="light"` or `theme="dark"`
 * pins one.
 */
import type { RunResult } from './database';
import STYLES from './seaquel-sql.css?inline';
import { dedent } from './dedent';
import { highlight } from './sql-highlight';

const ROW_LIMIT = 100;
/** Only useful once PGlite is on its way, so it rides along in the lazy chunk. */
const database = () => import('./database');
const HOME_URL = 'https://seaquel.app/';

function formatCell(value: unknown): string {
	if (value === null || value === undefined) return 'NULL';
	if (value instanceof Date) return value.toISOString().replace('T', ' ').replace(/\.000Z$/, '');
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function isNumeric(value: unknown): boolean {
	return typeof value === 'number' || typeof value === 'bigint';
}

function plural(n: number, word: string): string {
	return `${n} ${word}${n === 1 ? '' : 's'}`;
}

const TEMPLATE = /* html */ `
<div class="frame">
	<div class="bar">
		<span class="label">PostgreSQL · runs in your browser</span>
		<button type="button" class="reset" hidden>Reset</button>
		<button type="button" class="run">Run<kbd></kbd></button>
	</div>
	<div class="editor">
		<pre class="highlight" aria-hidden="true"></pre>
		<textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="SQL query"></textarea>
	</div>
	<div class="output" aria-live="polite"></div>
	<div class="foot">
		<span class="status"></span>
		<a target="_blank" rel="noopener">Powered by <strong>Seaquel</strong></a>
	</div>
</div>
`;

export class SeaquelSql extends HTMLElement {
	#root: ShadowRoot | null = null;
	#initial = '';
	#editor!: HTMLTextAreaElement;
	#highlight!: HTMLPreElement;
	#run!: HTMLButtonElement;
	#reset!: HTMLButtonElement;
	#output!: HTMLDivElement;
	#status!: HTMLSpanElement;
	#running = false;

	connectedCallback() {
		// Moving the element around the DOM re-fires this; build only once.
		if (this.#root) return;

		this.#initial = dedent(this.querySelector('pre')?.textContent ?? '');

		const root = (this.#root = this.attachShadow({ mode: 'open' }));
		root.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;

		this.#editor = root.querySelector('textarea')!;
		this.#highlight = root.querySelector('.highlight')!;
		this.#run = root.querySelector('.run')!;
		this.#reset = root.querySelector('.reset')!;
		this.#output = root.querySelector('.output')!;
		this.#status = root.querySelector('.status')!;

		this.#editor.value = this.#initial;
		this.#paint();
		root.querySelector('kbd')!.textContent = /Mac|iP(hone|ad)/.test(navigator.platform) ? '⌘↵' : 'Ctrl↵';

		const link = root.querySelector('a')!;
		const url = new URL(HOME_URL);
		url.searchParams.set('ref', `embed${location.hostname ? `-${location.hostname}` : ''}`);
		link.href = url.toString();

		this.#run.addEventListener('click', () => this.run());
		this.#reset.addEventListener('click', () => this.#resetQuery());
		this.#editor.addEventListener('input', () => {
			this.#reset.hidden = this.#editor.value === this.#initial;
			this.#paint();
		});
		this.#editor.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				this.run();
			}
		});

		// Start fetching Postgres the moment a reader shows interest, so the
		// first Run doesn't pay the whole download.
		const warmUp = () => {
			database()
				.then((db) => db.getDatabase())
				.catch(() => {});
			this.removeEventListener('pointerenter', warmUp);
			this.removeEventListener('focusin', warmUp);
		};
		this.addEventListener('pointerenter', warmUp);
		this.addEventListener('focusin', warmUp);
	}

	/** Setup SQL from a child <script type="text/sql">, or the one `setup` points at. */
	#setupSql(): string | null {
		const ref = this.getAttribute('setup');
		const script = ref
			? document.querySelector(ref)
			: this.querySelector('script[type="text/sql"]');
		if (ref && !script) throw new Error(`setup="${ref}" doesn't match any element on the page.`);
		return script ? dedent(script.textContent ?? '') : null;
	}

	async run() {
		if (this.#running) return;
		const sql = this.#editor.value.trim();
		if (!sql) {
			this.#showMessage('Write a query first.');
			return;
		}

		this.#running = true;
		this.#run.disabled = true;
		this.#status.textContent = 'Starting Postgres…';
		try {
			const db = await database();
			const schema = await db.prepareSchema(this.#setupSql());
			this.#status.textContent = 'Running…';
			this.#render(await db.runQuery(sql, schema));
		} catch (err) {
			const e = err as { message?: string; hint?: string };
			this.#showError(`Setup failed: ${e.message ?? err}`, e.hint);
			this.#status.textContent = '';
		} finally {
			this.#running = false;
			this.#run.disabled = false;
		}
	}

	#resetQuery() {
		this.#editor.value = this.#initial;
		this.#paint();
		this.#reset.hidden = true;
		this.#output.replaceChildren();
		this.#status.textContent = '';
		this.#editor.focus();
	}

	#paint() {
		const sql = this.#editor.value;
		// A <pre> drops a final newline that a textarea still shows as an empty
		// line; pad it so the caret on that line isn't below the highlight.
		this.#highlight.innerHTML = highlight(sql) + (sql.endsWith('\n') ? ' ' : '');
	}

	#render(result: RunResult) {
		const ms = `${Math.max(1, Math.round(result.elapsed))} ms`;
		if (!result.ok) {
			this.#showError(result.message, result.hint);
			this.#status.textContent = ms;
			return;
		}

		if (!result.columns.length) {
			this.#showMessage(`Done. ${plural(result.rowCount, 'row')} affected (rolled back after the run).`);
			this.#status.textContent = ms;
			return;
		}

		const table = document.createElement('table');
		const head = table.createTHead().insertRow();
		const first = result.rows[0] ?? [];
		result.columns.forEach((name, i) => {
			const th = document.createElement('th');
			th.textContent = name;
			if (isNumeric(first[i])) th.className = 'num';
			head.append(th);
		});
		const body = table.createTBody();
		for (const row of result.rows.slice(0, ROW_LIMIT)) {
			const tr = body.insertRow();
			for (const value of row) {
				const td = tr.insertCell();
				td.textContent = formatCell(value);
				if (value === null || value === undefined) td.className = 'null';
				else if (isNumeric(value)) td.className = 'num';
			}
		}
		this.#output.replaceChildren(table);

		const shown = result.rows.length > ROW_LIMIT ? `first ${ROW_LIMIT} of ` : '';
		this.#status.textContent = `${shown}${plural(result.rows.length, 'row')} · ${ms}`;
	}

	#showMessage(text: string) {
		const div = document.createElement('div');
		div.className = 'message';
		div.textContent = text;
		this.#output.replaceChildren(div);
	}

	#showError(message: string, hint?: string) {
		const div = document.createElement('div');
		div.className = 'error';
		div.setAttribute('role', 'alert');
		div.textContent = message;
		if (hint) {
			const h = document.createElement('div');
			h.className = 'hint';
			h.textContent = `Hint: ${hint}`;
			div.append(h);
		}
		this.#output.replaceChildren(div);
	}
}

if (!customElements.get('seaquel-sql')) customElements.define('seaquel-sql', SeaquelSql);
