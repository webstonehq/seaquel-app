import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, code_highlighter } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const copyIcon = `<svg class="code-copy-idle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const checkIcon = `<svg class="code-copy-done" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

// The <seaquel-sql> embed snippets in blog posts carry SQL in two places Prism
// reads as something else: <script type="text/sql"> (highlighted as
// JavaScript) and the <pre> with the starting query (plain text). mdsvex keeps
// its Prism instance on globalThis; teach its HTML grammar about both.
let sqlScriptsTaught = false;
async function teachSqlScripts() {
  if (sqlScriptsTaught) return;
  await code_highlighter("", "sql"); // loads Prism and its SQL grammar
  const Prism = globalThis.Prism;
  Prism.languages.insertBefore("markup", "script", {
    // Listed first so it claims the <pre> before sql-script splits the text.
    "sql-pre": {
      pattern:
        /(<seaquel-sql\b[^>]*>\s*(?:<script\b[\s\S]*?<\/script>\s*)?<pre\b[^>]*>)[\s\S]*?(?=<\/pre>)/i,
      lookbehind: true,
      greedy: true,
      inside: Prism.languages.sql,
    },
    "sql-script": {
      pattern: /(<script\b[^>]*\btype\s*=\s*["']text\/sql["'][^>]*>)[\s\S]*?(?=<\/script>)/i,
      lookbehind: true,
      greedy: true,
      inside: Prism.languages.sql,
    },
  });
  sqlScriptsTaught = true;
}

// Wraps every fenced code block in markdown with a copy button. Clicks are
// handled by a single delegated listener in the root layout.
//
// SQL blocks in Learn SQL lessons become runnable <seaquel-sql> widgets
// instead, unless the fence says ```sql static (fragments, other dialects).
// The highlighted <pre> stays inside: the widget reads its query from it,
// and it's what readers and crawlers see before the widget loads.
async function highlighter(code, lang, meta, filename) {
  if (lang === "html") await teachSqlScripts();
  const html = await code_highlighter(code, lang);
  if (lang === "sql" && filename?.includes("/content/learn-sql/") && !/\bstatic\b/.test(meta ?? "")) {
    return `<seaquel-sql>${html}</seaquel-sql>`;
  }
  return `<div class="code-block"><button type="button" class="code-copy" data-code-copy aria-label="Copy code" title="Copy code">${copyIcon}${checkIcon}</button>${html}</div>`;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  kit: {
    adapter: adapter({ platformProxy: { persist: { path: "../metrics-collector/.wrangler/state/v3" } } }),
    alias: { $modules: "./src/modules" },
  },
  preprocess: [vitePreprocess(), mdsvex({ extensions: [".md"], highlight: { highlighter }, rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] })],
};

export default config;
