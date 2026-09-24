import type { RequestHandler } from "./$types";
import { getChangelogEntries } from "$lib/changelog";
import { getBlogEntries } from "$lib/blog";
import { getLessons } from "$lib/learn-sql";
import { getSqlErrors } from "$lib/sql-errors";
import { ENGINE_SLUGS, getAllCodePages } from "$lib/server/sql-error-codes";
import { getAlternatives, getComparisons } from "$lib/competitors";

export const prerender = true;

const ORIGIN = "https://seaquel.app";

const STATIC_PATHS = [
  "/",
  "/features",
  "/pricing",
  "/learn-sql",
  "/sql-errors",
  "/compare",
  "/alternatives",
  "/docs",
  "/changelog",
  "/blog",
  "/metrics",
  "/download",
  "/feedback",
  "/privacy",
  "/terms",
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: RequestHandler = async () => {
  const changelog = await getChangelogEntries();
  const blog = await getBlogEntries();
  const lessons = await getLessons();
  const sqlErrors = await getSqlErrors();
  const comparisons = await getComparisons();
  const alternatives = await getAlternatives();
  const latestChangelog = changelog[0]?.date;
  const latestBlog = blog[0]?.date;

  const urls: Array<{ loc: string; lastmod?: string }> = [];

  for (const path of STATIC_PATHS) {
    const entry: { loc: string; lastmod?: string } = { loc: `${ORIGIN}${path}` };
    if (path === "/changelog" && latestChangelog) {
      entry.lastmod = latestChangelog;
    }
    if (path === "/blog" && latestBlog) {
      entry.lastmod = latestBlog;
    }
    urls.push(entry);
  }

  for (const entry of changelog) {
    urls.push({
      loc: `${ORIGIN}/changelog/${entry.slug}`,
      lastmod: entry.date,
    });
  }

  for (const entry of blog) {
    urls.push({
      loc: `${ORIGIN}/blog/${entry.slug}`,
      lastmod: entry.date,
    });
  }

  for (const lesson of lessons) {
    urls.push({ loc: `${ORIGIN}/learn-sql/${lesson.slug}` });
  }

  for (const entry of sqlErrors) {
    urls.push({ loc: `${ORIGIN}/sql-errors/${entry.slug}` });
  }

  for (const engine of ENGINE_SLUGS) {
    urls.push({ loc: `${ORIGIN}/sql-errors/${engine}` });
  }

  // Code pages with nothing beyond the one-line message are noindex; listing
  // them here would only send crawlers to pages they're told to drop.
  for (const page of await getAllCodePages()) {
    if (page.indexable) urls.push({ loc: `${ORIGIN}/sql-errors/${page.engine}/${page.slug}` });
  }

  // Comparison pages carry the date they were last checked against the
  // vendor's own pages, which is exactly what lastmod is for.
  for (const entry of comparisons) {
    urls.push({ loc: `${ORIGIN}/compare/${entry.slug}`, lastmod: entry.verifiedOn });
  }

  for (const entry of alternatives) {
    urls.push({ loc: `${ORIGIN}/alternatives/${entry.slug}`, lastmod: entry.verifiedOn });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(({ loc, lastmod }) => {
        const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
        if (lastmod) parts.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
        return `  <url>\n${parts.join("\n")}\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
