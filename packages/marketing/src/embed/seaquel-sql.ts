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
 * Several <pre>s become tabs, one query each, such as a broken query and its
 * fix. A tab is named by its `title`; `data-result="error"` or `"ok"` marks
 * what the query is meant to do, with an icon, and a failing "error" tab
 * offers to run the next one:
 *
 *   <pre title="Broken query" data-result="error">...</pre>
 *   <pre title="Fixed query" data-result="ok">...</pre>
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

// Lucide icons (ISC license), inlined since the widget has no dependencies.
const svg = (body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ICONS = {
	play: svg('<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>'),
	error: svg('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
	ok: svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
	next: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>')
};

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
		<div class="tabs" role="tablist" aria-label="Queries" hidden></div>
		<button type="button" class="reset" hidden>Reset</button>
		<button type="button" class="run">${ICONS.play}Run<kbd></kbd></button>
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

/** One query. A widget with a single <pre> has one tab and shows no tab bar. */
interface Tab {
	title: string;
	/** What the query is meant to do, when the author said. */
	expect: 'error' | 'ok' | null;
	initial: string;
	value: string;
	/** The last run's output and status, kept while another tab is showing. */
	output: Node[];
	status: string;
	button: HTMLButtonElement | null;
}

export class SeaquelSql extends HTMLElement {
	#root: ShadowRoot | null = null;
	#tabs: Tab[] = [];
	#active = 0;
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

		const pres = [...this.querySelectorAll(':scope > pre')] as HTMLPreElement[];
		this.#tabs = (pres.length ? pres : [null]).map((pre, i) => {
			const initial = dedent(pre?.textContent ?? '');
			const result = pre?.dataset.result;
			return {
				title: pre?.title || `Query ${i + 1}`,
				expect: result === 'error' || result === 'ok' ? result : null,
				initial,
				value: initial,
				output: [],
				status: '',
				button: null
			};
		});

		const root = (this.#root = this.attachShadow({ mode: 'open' }));
		root.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;

		this.#editor = root.querySelector('textarea')!;
		this.#highlight = root.querySelector('.highlight')!;
		this.#run = root.querySelector('.run')!;
		this.#reset = root.querySelector('.reset')!;
		this.#output = root.querySelector('.output')!;
		this.#status = root.querySelector('.status')!;

		if (this.#tabs.length > 1) this.#buildTabs(root);

		this.#editor.value = this.#tabs[0].value;
		this.#paint();
		root.querySelector('kbd')!.textContent = /Mac|iP(hone|ad)/.test(navigator.platform) ? '⌘↵' : 'Ctrl↵';

		const link = root.querySelector('a')!;
		const url = new URL(HOME_URL);
		url.searchParams.set('ref', `embed${location.hostname ? `-${location.hostname}` : ''}`);
		link.href = url.toString();

		this.#run.addEventListener('click', () => this.run());
		this.#reset.addEventListener('click', () => this.#resetQuery());
		this.#editor.addEventListener('input', () => {
			this.#tab.value = this.#editor.value;
			this.#reset.hidden = this.#editor.value === this.#tab.initial;
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

	get #tab(): Tab {
		return this.#tabs[this.#active];
	}

	#buildTabs(root: ShadowRoot) {
		const list = root.querySelector<HTMLDivElement>('.tabs')!;
		list.hidden = false;
		root.querySelector('.frame')!.classList.add('tabbed');

		this.#tabs.forEach((tab, i) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'tab';
			button.setAttribute('role', 'tab');
			const icon = tab.expect ? `<span class="icon icon-${tab.expect}">${ICONS[tab.expect]}</span>` : '';
			button.innerHTML = `${icon}<span class="n">${i + 1}.</span>`;
			button.append(tab.title);
			button.addEventListener('click', () => this.#select(i));
			button.addEventListener('keydown', (event) => {
				const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
				if (!step) return;
				event.preventDefault();
				const next = (i + step + this.#tabs.length) % this.#tabs.length;
				this.#select(next);
				this.#tabs[next].button?.focus();
			});
			tab.button = button;
			list.append(button);
		});
		this.#select(0);
	}

	#select(index: number) {
		this.#active = index;
		this.#tabs.forEach((tab, i) => {
			tab.button?.setAttribute('aria-selected', String(i === index));
			tab.button?.setAttribute('tabindex', i === index ? '0' : '-1');
		});
		const tab = this.#tab;
		this.#editor.value = tab.value;
		this.#editor.setAttribute('aria-label', `${tab.title} (SQL)`);
		this.#reset.hidden = tab.value === tab.initial;
		this.#paint();
		this.#showOutput();
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

	async run(index = this.#active) {
		if (this.#running) return;
		if (index !== this.#active) this.#select(index);
		const tab = this.#tab;
		const sql = tab.value.trim();
		if (!sql) {
			this.#setOutput(tab, [this.#message('Write a query first.')], '');
			return;
		}

		this.#running = true;
		this.#run.disabled = true;
		this.#status.textContent = 'Starting Postgres…';
		try {
			const db = await database();
			const schema = await db.prepareSchema(this.#setupSql());
			this.#status.textContent = 'Running…';
			this.#render(tab, await db.runQuery(sql, schema));
		} catch (err) {
			const e = err as { message?: string; hint?: string };
			this.#setOutput(tab, [this.#error(`Setup failed: ${e.message ?? err}`, e.hint)], '');
		} finally {
			this.#running = false;
			this.#run.disabled = false;
		}
	}

	#resetQuery() {
		const tab = this.#tab;
		tab.value = tab.initial;
		this.#editor.value = tab.value;
		this.#paint();
		this.#reset.hidden = true;
		this.#setOutput(tab, [], '');
		this.#editor.focus();
	}

	#paint() {
		const sql = this.#editor.value;
		// A <pre> drops a final newline that a textarea still shows as an empty
		// line; pad it so the caret on that line isn't below the highlight.
		this.#highlight.innerHTML = highlight(sql) + (sql.endsWith('\n') ? ' ' : '');
	}

	/** Stores a tab's output and shows it, if that tab is the one on screen. */
	#setOutput(tab: Tab, nodes: Node[], status: string) {
		tab.output = nodes;
		tab.status = status;
		if (tab === this.#tab) this.#showOutput();
	}

	#showOutput() {
		const tab = this.#tab;
		// Tabbed widgets are a page's main exercise, so say what Run does
		// before anything has run; a single embed keeps its quiet output.
		const idle = this.#tabs.length > 1 && !tab.output.length ? [this.#idle()] : [];
		this.#output.replaceChildren(...(tab.output.length ? tab.output : idle));
		this.#status.textContent = tab.status;
	}

	#render(tab: Tab, result: RunResult) {
		const ms = `${Math.max(1, Math.round(result.elapsed))} ms`;
		if (!result.ok) {
			const error = this.#error(result.message, result.hint);
			const next = this.#tabs[this.#tabs.indexOf(tab) + 1];
			if (tab.expect === 'error' && next) error.append(this.#nextButton(next));
			this.#setOutput(tab, [error], ms);
			return;
		}

		if (!result.columns.length) {
			const done = this.#message(`Done. ${plural(result.rowCount, 'row')} affected (rolled back after the run).`);
			this.#setOutput(tab, [done], ms);
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

		const shown = result.rows.length > ROW_LIMIT ? `first ${ROW_LIMIT} of ` : '';
		this.#setOutput(tab, [table], `${shown}${plural(result.rows.length, 'row')} · ${ms}`);
	}

	#nextButton(next: Tab): HTMLButtonElement {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'next';
		button.textContent = `Run the ${next.title.charAt(0).toLowerCase()}${next.title.slice(1)}`;
		button.insertAdjacentHTML('beforeend', ICONS.next);
		button.addEventListener('click', () => this.run(this.#tabs.indexOf(next)));
		return button;
	}

	#idle(): HTMLDivElement {
		const div = this.#message('');
		const key = /Mac|iP(hone|ad)/.test(navigator.platform) ? '⌘' : 'Ctrl';
		div.innerHTML = `Press <strong>Run</strong> (or <kbd>${key}</kbd> + <kbd>Enter</kbd>) to execute this against a real PostgreSQL database in your browser. Nothing is sent to a server.`;
		div.classList.add('idle');
		return div;
	}

	#message(text: string): HTMLDivElement {
		const div = document.createElement('div');
		div.className = 'message';
		div.textContent = text;
		return div;
	}

	#error(message: string, hint?: string): HTMLDivElement {
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
		return div;
	}
}

if (!customElements.get('seaquel-sql')) customElements.define('seaquel-sql', SeaquelSql);
