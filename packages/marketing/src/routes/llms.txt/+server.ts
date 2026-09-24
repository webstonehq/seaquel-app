import type { RequestHandler } from "./$types";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getChangelogEntries } from "$lib/changelog";
import { getBlogEntries } from "$lib/blog";
import { getLessons } from "$lib/learn-sql";
import { getSqlErrors } from "$lib/sql-errors";
import { getAlternatives, getComparisons } from "$lib/competitors";

// https://llmstxt.org — a markdown index of the site for LLMs and AI tools.
export const prerender = true;

const ORIGIN = "https://seaquel.app";
const CHANGELOG_LIMIT = 10;

const PAGES: Array<{ path: string; title: string; description: string }> = [
  {
    path: "/features",
    title: "Features",
    description:
      "Visual query builder, ERD viewer, schema browser, dashboards, staged edits and an optional AI assistant.",
  },
  {
    path: "/pricing",
    title: "Pricing",
    description:
      "Free and open source for personal use. Individual and Business licenses cover commercial use.",
  },
  {
    path: "/download",
    title: "Download",
    description:
      "Free for macOS (Apple Silicon & Intel), Windows and Linux, fully functional without an account or license.",
  },
  {
    path: "/metrics",
    title: "Public metrics",
    description: "Download stats, GitHub activity, release cadence and platform breakdown.",
  },
];

type Link = { title: string; url: string; description?: string };

function section(heading: string, links: Link[]): string {
  if (links.length === 0) return "";
  const lines = links.map(({ title, url, description }) =>
    description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`,
  );
  return `## ${heading}\n\n${lines.join("\n")}\n`;
}

function attr(html: string, pattern: RegExp): string | undefined {
  return html.match(pattern)?.[1]?.trim();
}

/** Docs are a separate static build; read titles from its sitemap and pages at prerender time. */
function getDocsPages(): Link[] {
  const root = join(process.cwd(), "static", "docs");
  const sitemap = join(root, "sitemap-0.xml");
  if (!existsSync(sitemap)) return [];

  const locs = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const links: Link[] = [];
  for (const loc of locs) {
    const path = new URL(loc).pathname.replace(/^\/docs\/?/, "");
    if (!path) continue;
    const file = join(root, path, "index.html");
    if (!existsSync(file)) continue;
    const html = readFileSync(file, "utf8");
    const title = attr(html, /<title>([^<]+)<\/title>/)?.replace(/\s*\|\s*Seaquel Docs$/, "");
    if (!title) continue;
    links.push({
      title,
      url: loc,
      description: attr(html, /<meta name="description" content="([^"]*)"/),
    });
  }
  return links;
}

export const GET: RequestHandler = async () => {
  const lessons = await getLessons();
  const sqlErrors = await getSqlErrors();
  const blog = await getBlogEntries();
  const changelog = await getChangelogEntries();
  const comparisons = await getComparisons();
  const alternatives = await getAlternatives();

  const body = [
    "# Seaquel\n",
    "> A fast, offline-first SQL client for Postgres, MySQL, MariaDB, SQLite, SQL Server and DuckDB. " +
      "Browse schemas, visualize queries, and add AI assistance only when you want it. " +
      "Available for macOS, Windows and Linux, free and open source for personal use.\n",
    "The site also hosts a free interactive SQL course (Learn SQL) and a reference of common SQL error messages with fixes, both runnable in the browser.\n",
    section(
      "Product",
      PAGES.map((p) => ({ ...p, url: `${ORIGIN}${p.path}` })),
    ),
    section(
      "Learn SQL",
      lessons.map((l) => ({
        title: l.title,
        url: `${ORIGIN}/learn-sql/${l.slug}`,
        description: l.description,
      })),
    ),
    section(
      "SQL errors",
      sqlErrors.map((e) => ({
        title: e.title,
        url: `${ORIGIN}/sql-errors/${e.slug}`,
        description: e.description,
      })),
    ),
    section("Docs", getDocsPages()),
    section(
      "Comparisons",
      [
        ...comparisons.map((c) => ({
          title: `Seaquel vs ${c.name}`,
          url: `${ORIGIN}/compare/${c.slug}`,
          description: c.description,
        })),
        ...alternatives.map((c) => ({
          title: c.altTitle ?? `${c.name} alternatives`,
          url: `${ORIGIN}/alternatives/${c.slug}`,
          description: c.altDescription ?? c.description,
        })),
      ],
    ),
    section(
      "Blog",
      blog.map((b) => ({
        title: b.title,
        url: `${ORIGIN}/blog/${b.slug}`,
        description: b.description,
      })),
    ),
    section(
      "Optional",
      [
        ...changelog.slice(0, CHANGELOG_LIMIT).map((c) => ({
          title: `Changelog: ${c.title}`,
          url: `${ORIGIN}/changelog/${c.slug}`,
          description: c.date,
        })),
        { title: "Full changelog", url: `${ORIGIN}/changelog` },
        { title: "Privacy policy", url: `${ORIGIN}/privacy` },
        { title: "Terms", url: `${ORIGIN}/terms` },
      ],
    ),
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
