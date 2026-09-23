import type { RequestHandler } from "./$types";
import { getChangelogEntries } from "$lib/changelog";
import { getBlogEntries } from "$lib/blog";
import { getLessons } from "$lib/learn-sql";
import { getSqlErrors } from "$lib/sql-errors";

export const prerender = true;

const ORIGIN = "https://seaquel.app";

const STATIC_PATHS = [
  "/",
  "/features",
  "/pricing",
  "/learn-sql",
  "/sql-errors",
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
