/** Strips the indentation authors pick up from nesting SQL inside HTML. */
export function dedent(text: string): string {
	const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
	const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)![0].length);
	const cut = indents.length ? Math.min(...indents) : 0;
	return lines.map((l) => l.slice(cut)).join('\n');
}
