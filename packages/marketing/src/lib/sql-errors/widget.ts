/**
 * Markup for the broken/fixed <seaquel-sql> widget on /sql-errors pages, shared
 * by the guides and the code pages. The <pre>s are the widget's tabs and what
 * crawlers and no-JS readers see.
 */

function escapeHtml(text: string): string {
	return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function sqlErrorWidget({
	broken,
	fixed,
	setup
}: {
	broken: string;
	fixed: string;
	setup?: string;
}): string {
	// The widget reads the setup as script text, so it goes in unescaped; the
	// tests keep closing script tags out of every setup.
	const setupTag = setup ? `<script type="text/sql">${setup}</` + `script>` : '';
	return (
		`<seaquel-sql>${setupTag}` +
		`<pre title="Broken query" data-result="error">${escapeHtml(broken)}</pre>` +
		`<pre title="Fixed query" data-result="ok">${escapeHtml(fixed)}</pre>` +
		`</seaquel-sql>`
	);
}
