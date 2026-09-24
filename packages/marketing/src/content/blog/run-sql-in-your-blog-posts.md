---
title: "Put a Run Button on the SQL in Your Blog Posts"
date: "2026-09-23"
description: "A free embed that turns the SQL in your blog posts into real Postgres queries readers can edit and run without leaving the page."
author: "Mike Nikles"
authorRole: "Founder"
category: "Launch"
ogHeadline: "Let your readers run the SQL."
ogTagline: "A free embed for SQL blog posts."
---

<script>
	import { onMount } from 'svelte';

	onMount(() => {
		import('../../embed/seaquel-sql');
	});
</script>

Many SQL tutorial I've read have the same shape. Here's a query, here's the result, now imagine what happens when you change the `WHERE` clause.

Why imagine it though?. I open a terminal, start a database, copy the schema out of the post (if the author included one), and by the time it's all running I've forgotten what I was trying to learn.

So I built a small thing for people who write about SQL. It looks like this:

<seaquel-sql>
<pre>
SELECT p.name, sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 5
</pre>
</seaquel-sql>

Hit **Run**. Then change `LIMIT 5` to `LIMIT 3`, or `DESC` to `ASC`, and run it again. That's real Postgres running in your browser tab. There's no server behind it, no account, and nothing to install.

It's free, and you can put it in your own posts.

## Adding it to a post

You need one script tag per page and one `<seaquel-sql>` element per example:

```html
<script type="module" src="https://seaquel.app/embed/seaquel-sql.js"></script>

<seaquel-sql>
  <pre>SELECT * FROM customers WHERE country = 'CA'</pre>
  <a href="https://seaquel.app">Powered by Seaquel</a>
</seaquel-sql>
```

The `<pre>` holds the starting query. If the script doesn't load, or your platform strips it out, readers still see the query as plain text, so the post never breaks.

Without any setup, queries run against a small sample shop with `customers`, `products`, `orders` and `order_items`. It's the same data behind [Learn SQL](/learn-sql), in case you want to point readers somewhere to keep practicing.

## Bring your own tables

Most posts need their own data. Put the schema and rows in a `<script type="text/sql">` inside the element. Readers don't see it, but it runs before their first query.

```html
<seaquel-sql>
  <script type="text/sql">
    CREATE TABLE books (id int PRIMARY KEY, title text, author text, published int);
    CREATE TABLE reviews (id int PRIMARY KEY, book_id int REFERENCES books(id), stars int);
    INSERT INTO books VALUES
      (1, 'The Pragmatic Programmer', 'Hunt, Thomas', 1999),
      (2, 'Designing Data-Intensive Applications', 'Kleppmann', 2017),
      (3, 'SQL Antipatterns', 'Karwin', 2010),
      (4, 'Database Internals', 'Petrov', 2019),
      (5, 'The Art of PostgreSQL', 'Fontaine', 2017);
    INSERT INTO reviews VALUES
      (1, 1, 5), (2, 1, 4), (3, 2, 5), (4, 2, 5), (5, 2, 4), (6, 3, 3);
  </script>
  <pre>
    SELECT b.title
    FROM books b
    LEFT JOIN reviews r ON r.book_id = b.id
    WHERE r.id IS NULL
  </pre>
  <a href="https://seaquel.app">Powered by Seaquel</a>
</seaquel-sql>
```

This gives you the books nobody has reviewed yet:

<seaquel-sql>
<script type="text/sql">
CREATE TABLE books (id int PRIMARY KEY, title text, author text, published int);
CREATE TABLE reviews (id int PRIMARY KEY, book_id int REFERENCES books(id), stars int);
INSERT INTO books VALUES
  (1, 'The Pragmatic Programmer', 'Hunt, Thomas', 1999),
  (2, 'Designing Data-Intensive Applications', 'Kleppmann', 2017),
  (3, 'SQL Antipatterns', 'Karwin', 2010),
  (4, 'Database Internals', 'Petrov', 2019),
  (5, 'The Art of PostgreSQL', 'Fontaine', 2017);
INSERT INTO reviews VALUES
  (1, 1, 5), (2, 1, 4), (3, 2, 5), (4, 2, 5), (5, 2, 4), (6, 3, 3);
</script>
<pre>
SELECT b.title
FROM books b
LEFT JOIN reviews r ON r.book_id = b.id
WHERE r.id IS NULL
</pre>
</seaquel-sql>

## Several examples, one dataset

A tutorial usually runs a handful of queries over the same tables. Instead of repeating the setup in every example, give it an `id` and point each widget at it:

```html
<script type="text/sql" id="library">
  CREATE TABLE books (...);
  INSERT INTO books VALUES (...);
</script>

<seaquel-sql setup="#library">
  <pre>SELECT count(*) FROM books</pre>
</seaquel-sql>
```

Widgets that share a setup also share the tables, so the data only loads once. This one runs on the same books as the example above, and shows the average rating per title:

<div hidden>
<script type="text/sql" id="library">
CREATE TABLE books (id int PRIMARY KEY, title text, author text, published int);
CREATE TABLE reviews (id int PRIMARY KEY, book_id int REFERENCES books(id), stars int);
INSERT INTO books VALUES
  (1, 'The Pragmatic Programmer', 'Hunt, Thomas', 1999),
  (2, 'Designing Data-Intensive Applications', 'Kleppmann', 2017),
  (3, 'SQL Antipatterns', 'Karwin', 2010),
  (4, 'Database Internals', 'Petrov', 2019),
  (5, 'The Art of PostgreSQL', 'Fontaine', 2017);
INSERT INTO reviews VALUES
  (1, 1, 5), (2, 1, 4), (3, 2, 5), (4, 2, 5), (5, 2, 4), (6, 3, 3);
</script>
</div>

<seaquel-sql setup="#library">
<pre>
SELECT b.title, count(r.id) AS reviews, round(avg(r.stars), 1) AS avg_stars
FROM books b
LEFT JOIN reviews r ON r.book_id = b.id
GROUP BY b.title
ORDER BY avg_stars DESC NULLS LAST
</pre>
</seaquel-sql>

Every run happens inside a transaction that gets rolled back afterwards. Readers can `DELETE FROM books` or `DROP TABLE reviews` just to see what happens, and the next run still starts from your data. Go ahead and try it on the widget above.

## What your readers download

The script is about 6 KB gzipped, and that's all that loads with the page.

Postgres itself is [PGlite](https://pglite.dev), a WebAssembly build of the real thing. It's around 3.5 MB compressed, and it only downloads when a reader hovers over or clicks into a widget. A page with ten examples still loads it only once, and after that it comes from the browser cache. If you've written a tutorial that spans several posts, readers download it on the first one, and the rest load it from their cache.

Queries never leave the reader's tab. The script doesn't set cookies, doesn't run analytics, and doesn't send anything back to me.

## Making it match your blog

The widget follows the reader's light or dark setting. To pin one, add `theme="light"` or `theme="dark"` to the element.

Colors, corners and fonts are CSS variables you set on the element:

```css
seaquel-sql {
  --sq-accent: #6d28d9;
  --sq-accent-fg: #ffffff;
  --sq-radius: 4px;
  --sq-font: inherit;
}
```

| Variable | What it controls |
|---|---|
| `--sq-bg`, `--sq-fg` | Background and main text |
| `--sq-muted` | Label, status line and footer link |
| `--sq-subtle` | Toolbar and table header background |
| `--sq-border` | Borders and row dividers |
| `--sq-accent`, `--sq-accent-fg` | The Run button and focus ring |
| `--sq-error`, `--sq-error-bg` | Error messages |
| `--sq-keyword`, `--sq-string`, `--sq-number`, `--sq-comment`, `--sq-function`, `--sq-operator` | Syntax highlighting |
| `--sq-radius` | Corner radius |
| `--sq-font`, `--sq-mono` | UI font and code font |

Your blog's own CSS can't reach inside the widget, which is on purpose. Plenty of blog themes style every `table` or `*` on the page, and without that wall the results table would end up unreadable on many sites. The variables are the way in.

## Where it works, and where it doesn't

You need a place where you can add a script tag. That covers Hugo, Jekyll, Astro, Eleventy, Next.js, Ghost (use an HTML card) and self-hosted WordPress (use a Custom HTML block).

Medium, dev.to and Substack don't allow scripts in posts, so the widget won't run there. Thanks to the `<pre>` fallback, the query still shows up as text, which is no worse than what you have today.

One thing to watch for: MDX and some other blog engines read a bare `<` as the start of a tag, so `WHERE price < 50` can break your build. Write it as `WHERE price &amp;lt; 50` instead. The widget turns it back into `<` before running it.

## Why I'm giving it away

Mostly for the "Powered by Seaquel" link. [Seaquel](/) is the desktop SQL client I build, and people who write about SQL are exactly the people I'd like to know about it. That's the trade. The widget is free, and since it runs on your readers' machines there's nothing for me to meter, so there are no usage limits. All I ask is that you leave the link in.

If you use it, I'd love to see the post, so send it my way on [Discord](/discord). Same if it breaks on your blog. I've tested it on a handful of setups, but yours may not be one of them.
