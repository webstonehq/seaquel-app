/**
 * Runnable examples for /sql-errors/postgresql/{code}: a query that fails with
 * the code and one that fixes it, shown as a pair of <seaquel-sql> widgets.
 *
 * Hand-written, unlike the generated postgresql.json beside it. Codes that a
 * guide covers are left out; their pages reuse the guide's queries.
 * sql-error-codes.test.ts runs every entry through the widget's own database
 * code and checks the SQLSTATE, so an example here can't claim an error
 * PostgreSQL doesn't raise.
 *
 * Without `setup`, queries run against the sample shop from /learn-sql
 * (customers, products, orders, order_items). With it, they run in a fresh
 * schema holding only the setup's tables. Either way each run is rolled back,
 * so a query may create what it needs.
 */

export interface CodeExample {
	/** Why the first query fails and what the fix changes. One or two sentences. */
	note: string;
	setup?: string;
	broken: string;
	fixed: string;
}

// Raw, so backslashes in LIKE patterns and bytea literals stay as written.
const sql = String.raw;

export const examples: Record<string, CodeExample> = {
	'0A000': {
		note: 'PostgreSQL reads a three-part name as database.schema.table, and one connection can only query its own database. Connect to the other database, or reach it through the postgres_fdw or dblink extension.',
		broken: sql`SELECT count(*) FROM otherdb.public.customers;`,
		fixed: sql`SELECT count(*) FROM demo.customers;`
	},

	'20000': {
		note: 'A PL/pgSQL CASE statement with no ELSE raises this when none of its WHEN branches match. A CASE expression in plain SQL returns NULL instead, so this only shows up in functions and DO blocks.',
		broken: sql`
DO $$
DECLARE
  status text := 'refunded';
BEGIN
  CASE status
    WHEN 'pending' THEN RAISE NOTICE 'waiting';
    WHEN 'shipped' THEN RAISE NOTICE 'on its way';
  END CASE;
END $$;`,
		fixed: sql`
DO $$
DECLARE
  status text := 'refunded';
BEGIN
  CASE status
    WHEN 'pending' THEN RAISE NOTICE 'waiting';
    WHEN 'shipped' THEN RAISE NOTICE 'on its way';
    ELSE RAISE NOTICE 'unhandled status: %', status;
  END CASE;
END $$;`
	},

	'2202E': {
		note: 'An array slice has to be filled completely. days[1:3] has three positions and the new array has two, so make the slice match the array.',
		setup: sql`
CREATE TABLE schedules (name text, days int[]);
INSERT INTO schedules VALUES ('office', '{1,2,3,4,5}');`,
		broken: sql`
UPDATE schedules SET days[1:3] = ARRAY[6, 7]
WHERE name = 'office'
RETURNING days;`,
		fixed: sql`
UPDATE schedules SET days[1:2] = ARRAY[6, 7]
WHERE name = 'office'
RETURNING days;`
	},

	'22021': {
		note: 'The bytes aren’t valid UTF-8: 0xe9 is é in Latin-1, but in UTF-8 it has to be followed by more bytes. Data like this usually comes from a Latin-1 or Windows-1252 file, so decode it with that encoding.',
		broken: sql`SELECT convert_from('\x436166e9'::bytea, 'UTF8');`,
		fixed: sql`SELECT convert_from('\x436166e9'::bytea, 'LATIN1');`
	},

	'22008': {
		note: 'February 2024 has 29 days. PostgreSQL rejects an impossible date instead of rolling it over into March, so compare against the first day of the next month.',
		broken: sql`
SELECT id, created_at
FROM orders
WHERE created_at < '2024-02-30';`,
		fixed: sql`
SELECT id, created_at
FROM orders
WHERE created_at < '2024-03-01';`
	},

	'22015': {
		note: 'Each field of an interval is a 32-bit integer, so it tops out at 2,147,483,647 days. A number that large is almost always a millisecond timestamp read as days; to_timestamp takes seconds.',
		broken: sql`SELECT now() + (1716800000000 || ' days')::interval;`,
		fixed: sql`SELECT to_timestamp(1716800000000 / 1000.0);`
	},

	'2201E': {
		note: 'The logarithm of zero or a negative number is undefined. nullif turns the zero into NULL, so that row gets a NULL instead of stopping the query.',
		broken: sql`SELECT x, ln(x) FROM (VALUES (1), (10), (0)) AS v(x);`,
		fixed: sql`SELECT x, ln(nullif(x, 0)) FROM (VALUES (1), (10), (0)) AS v(x);`
	},

	'22014': {
		note: 'ntile(n) splits the rows into n groups, so n has to be at least 1. When the count is computed, guard it with greatest(n, 1).',
		broken: sql`
SELECT name, price, ntile(0) OVER (ORDER BY price) AS quartile
FROM products;`,
		fixed: sql`
SELECT name, price, ntile(4) OVER (ORDER BY price) AS quartile
FROM products;`
	},

	'22016': {
		note: 'nth_value counts from 1, so the first row of the frame is nth_value(x, 1). There is no zeroth row.',
		broken: sql`
SELECT DISTINCT nth_value(name, 0) OVER (
  ORDER BY price DESC
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
) AS second_priciest
FROM products;`,
		fixed: sql`
SELECT DISTINCT nth_value(name, 2) OVER (
  ORDER BY price DESC
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
) AS second_priciest
FROM products;`
	},

	'2201F': {
		note: 'A negative number raised to a fractional power has no real result, and PostgreSQL raises an error rather than returning NaN. sqrt() of a negative number fails the same way. For cube roots, cbrt() handles negatives.',
		broken: sql`SELECT power(-8, 1.0 / 3);`,
		fixed: sql`SELECT cbrt(-8);`
	},

	'2201G': {
		note: 'width_bucket needs at least one bucket, and the low and high bounds must differ.',
		broken: sql`
SELECT name, price, width_bucket(price, 0, 100, 0) AS band
FROM products;`,
		fixed: sql`
SELECT name, price, width_bucket(price, 0, 100, 4) AS band
FROM products;`
	},

	'22007': {
		note: 'PostgreSQL parses dates and a few special words like today and yesterday, but not phrases like last week. Relative dates come from arithmetic on now().',
		broken: sql`
SELECT id, created_at
FROM orders
WHERE created_at > 'last week';`,
		fixed: sql`
SELECT id, created_at
FROM orders
WHERE created_at > now() - interval '1 week';`
	},

	'22025': {
		note: 'In a LIKE pattern a backslash escapes the next character, so a pattern can’t end with one. Double it to match a literal backslash, or choose another escape character with ESCAPE.',
		broken: sql`SELECT 'C:\' LIKE 'C:\';`,
		fixed: sql`SELECT 'C:\' LIKE 'C:\\';`
	},

	'22023': {
		note: 'A step of zero never reaches the end of the series, so PostgreSQL rejects it. The same code covers other out-of-range arguments to built-in functions.',
		broken: sql`
SELECT day::date
FROM generate_series(date '2024-01-01', date '2024-01-31', interval '0 days') AS day;`,
		fixed: sql`
SELECT day::date
FROM generate_series(date '2024-01-01', date '2024-01-31', interval '7 days') AS day;`
	},

	'22013': {
		note: 'A frame offset counts rows back or forward from the current one, so it can’t be negative. For a window over the previous row and this one, write 1 PRECEDING.',
		broken: sql`
SELECT id, price,
  avg(price) OVER (ORDER BY id ROWS BETWEEN -1 PRECEDING AND CURRENT ROW) AS moving_avg
FROM products;`,
		fixed: sql`
SELECT id, price,
  avg(price) OVER (ORDER BY id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS moving_avg
FROM products;`
	},

	'2201B': {
		note: 'The pattern opens a group with ( and never closes it. ~ reads its right side as a regular expression, so to match a literal parenthesis, escape it as \\(.',
		broken: sql`SELECT name FROM products WHERE name ~ '(Mouse|Keyboard';`,
		fixed: sql`SELECT name FROM products WHERE name ~ '(Mouse|Keyboard)';`
	},

	'2201W': {
		note: 'LIMIT can be zero or NULL but not negative. SQLite reads LIMIT -1 as “no limit”; in PostgreSQL write LIMIT ALL or leave the clause out.',
		broken: sql`SELECT name FROM products ORDER BY name LIMIT -1;`,
		fixed: sql`SELECT name FROM products ORDER BY name LIMIT ALL;`
	},

	'2201X': {
		note: 'The offset came out negative, which usually means page arithmetic like (page - 1) * size ran with page 0. Clamp it with greatest(..., 0).',
		broken: sql`
SELECT id, name FROM products
ORDER BY id
LIMIT 5 OFFSET (0 - 1) * 5;`,
		fixed: sql`
SELECT id, name FROM products
ORDER BY id
LIMIT 5 OFFSET greatest(0 - 1, 0) * 5;`
	},

	'2202H': {
		note: 'TABLESAMPLE takes the percentage of the table to sample, from 0 to 100.',
		broken: sql`SELECT name FROM products TABLESAMPLE BERNOULLI (150);`,
		fixed: sql`SELECT name FROM products TABLESAMPLE BERNOULLI (50);`
	},

	'2202G': {
		note: 'REPEATABLE takes the seed that makes the sample the same on every run, and the seed can’t be NULL. Any number works.',
		broken: sql`SELECT name FROM products TABLESAMPLE SYSTEM (50) REPEATABLE (NULL);`,
		fixed: sql`SELECT name FROM products TABLESAMPLE SYSTEM (50) REPEATABLE (42);`
	},

	'22009': {
		note: 'Real UTC offsets run from -12 to +14 hours, and PostgreSQL accepts up to ±15:59. An offset of +25 usually means the time and offset were put together wrongly.',
		broken: sql`SELECT '2024-06-01 10:00+25'::timestamptz;`,
		fixed: sql`SELECT '2024-06-01 10:00+02'::timestamptz;`
	},

	'22004': {
		note: 'sum() over no rows returns NULL, not 0, and a variable declared NOT NULL refuses it. Wrap the aggregate in coalesce.',
		broken: sql`
DO $$
DECLARE
  total numeric NOT NULL := 0;
BEGIN
  total := (SELECT sum(price) FROM products WHERE id > 1000);
END $$;`,
		fixed: sql`
DO $$
DECLARE
  total numeric NOT NULL := 0;
BEGIN
  total := (SELECT coalesce(sum(price), 0) FROM products WHERE id > 1000);
END $$;`
	},

	'22003': {
		note: 'extract(epoch ...) fits in an integer, but multiplying by 1000 goes past 2,147,483,647. Cast to bigint before the multiplication, not after it.',
		broken: sql`
SELECT id, extract(epoch FROM created_at)::int * 1000 AS created_ms
FROM orders;`,
		fixed: sql`
SELECT id, extract(epoch FROM created_at)::bigint * 1000 AS created_ms
FROM orders;`
	},

	'2200H': {
		note: 'A smallint sequence stops at 32,767, and nextval fails once it gets there. Move the sequence to integer or bigint with ALTER SEQUENCE ... AS, and widen the column it feeds.',
		broken: sql`
CREATE SEQUENCE ticket_no AS smallint START 32766;
SELECT nextval('ticket_no') FROM generate_series(1, 3);`,
		fixed: sql`
CREATE SEQUENCE ticket_no AS integer START 32766;
SELECT nextval('ticket_no') FROM generate_series(1, 3);`
	},

	'22001': {
		note: 'country is varchar(2). PostgreSQL rejects a longer value instead of cutting it short, as MySQL does outside strict mode. Store the two-letter code, or widen the column.',
		broken: sql`UPDATE customers SET country = 'USA' WHERE id = 1 RETURNING *;`,
		fixed: sql`UPDATE customers SET country = 'US' WHERE id = 1 RETURNING *;`
	},

	'22011': {
		note: 'For a value without an @, position() returns 0, so the length becomes -1. split_part returns the whole string when the separator is missing.',
		broken: sql`
SELECT substring(email FROM 1 FOR position('@' IN email) - 1) AS local_part
FROM (VALUES ('alice@example.com'), ('no-email')) AS v(email);`,
		fixed: sql`
SELECT split_part(email, '@', 1) AS local_part
FROM (VALUES ('alice@example.com'), ('no-email')) AS v(email);`
	},

	'22026': {
		note: 'A bit(4) column takes exactly four bits, and PostgreSQL won’t pad a shorter value when storing it. Write all four, or use bit varying(4).',
		setup: sql`CREATE TABLE flags (id int, bits bit(4));`,
		broken: sql`INSERT INTO flags VALUES (1, B'101') RETURNING *;`,
		fixed: sql`INSERT INTO flags VALUES (1, B'0101') RETURNING *;`
	},

	'22030': {
		note: 'Several products share a category, and json_object_agg_unique refuses repeated keys. Group first so each key appears once, with the values collected into an array.',
		broken: sql`SELECT json_object_agg_unique(category, name) FROM products;`,
		fixed: sql`
SELECT json_object_agg(category, names)
FROM (
  SELECT category, json_agg(name) AS names
  FROM products
  GROUP BY category
) AS c;`
	},

	'22033': {
		note: 'In strict mode an index past the end of the array raises an error; lax mode, the default, returns nothing. Use last to get the final element whatever the length.',
		broken: sql`SELECT jsonb_path_query('{"tags": ["sale"]}', 'strict $.tags[1]');`,
		fixed: sql`SELECT jsonb_path_query('{"tags": ["sale"]}', 'strict $.tags[last]');`
	},

	'22034': {
		note: 'JSON_VALUE returns a single scalar, and this path matches two. JSON_QUERY with WITH WRAPPER returns them all as an array. Without ERROR ON ERROR, JSON_VALUE would quietly return NULL.',
		broken: sql`SELECT JSON_VALUE(jsonb '{"tags": ["sale", "new"]}', '$.tags[*]' ERROR ON ERROR);`,
		fixed: sql`SELECT JSON_QUERY(jsonb '{"tags": ["sale", "new"]}', '$.tags[*]' WITH WRAPPER);`
	},

	'22035': {
		note: 'The document has no price, and ERROR ON EMPTY makes a missing value an error. DEFAULT ... ON EMPTY supplies a fallback instead.',
		broken: sql`SELECT JSON_VALUE(jsonb '{"name": "Mouse"}', '$.price' RETURNING numeric ERROR ON EMPTY);`,
		fixed: sql`SELECT JSON_VALUE(jsonb '{"name": "Mouse"}', '$.price' RETURNING numeric DEFAULT 0 ON EMPTY);`
	},

	'22036': {
		note: '.double() needs something that reads as a number, and "n/a" doesn’t. Filter the items first so only numeric-looking strings reach the conversion.',
		broken: sql`SELECT jsonb_path_query('{"price": "n/a"}', '$.price.double()');`,
		fixed: sql`SELECT jsonb_path_query('{"price": "n/a"}', '$.price ? (@ like_regex "^[0-9.]+$").double()');`
	},

	'22038': {
		note: 'Arithmetic in a JSON path needs a single number on each side, and $.prices[*] is two. Pull the items out with the path, then do the maths in SQL.',
		broken: sql`SELECT jsonb_path_query('{"prices": [10, 20]}', '$.prices[*] * 2');`,
		fixed: sql`SELECT jsonb_path_query('{"prices": [10, 20]}', '$.prices[*]')::numeric * 2;`
	},

	'22039': {
		note: 'tags holds a string, not an array, and strict mode won’t index into it. Lax mode treats a lone value as a one-element array, which suits data that has both shapes.',
		broken: sql`SELECT jsonb_path_query('{"tags": "sale"}', 'strict $.tags[0]');`,
		fixed: sql`SELECT jsonb_path_query('{"tags": "sale"}', 'lax $.tags[0]');`
	},

	'2203A': {
		note: 'In strict mode a missing key is an error. Lax mode, the default, returns no rows for it.',
		broken: sql`SELECT jsonb_path_query('{"name": "Mouse"}', 'strict $.price');`,
		fixed: sql`SELECT jsonb_path_query('{"name": "Mouse"}', 'lax $.price');`
	},

	'2203C': {
		note: '.* lists an object’s members, but the document is an array. Step into the array with [*] first.',
		broken: sql`SELECT jsonb_path_query('[{"sku": "A1"}]', 'strict $.*');`,
		fixed: sql`SELECT jsonb_path_query('[{"sku": "A1"}]', 'strict $[*].*');`
	},

	'2203F': {
		note: 'JSON_VALUE only returns scalars, and $.tags is an array. Point the path at one element, or use JSON_QUERY to get the array itself.',
		broken: sql`SELECT JSON_VALUE(jsonb '{"tags": ["sale"]}', '$.tags' ERROR ON ERROR);`,
		fixed: sql`SELECT JSON_VALUE(jsonb '{"tags": ["sale"]}', '$.tags[0]' ERROR ON ERROR);`
	},

	'22031': {
		note: 'Without a template, .datetime() only knows ISO-style formats. Pass the format the string uses.',
		broken: sql`SELECT jsonb_path_query('"12/31/2024"', '$.datetime()');`,
		fixed: sql`SELECT jsonb_path_query('"12/31/2024"', '$.datetime("MM/DD/YYYY")');`
	},

	'23001': {
		note: 'The foreign key says ON DELETE RESTRICT, so an author with books can’t be deleted. Delete or reassign the books first. A foreign key with the default NO ACTION reports 23503 instead.',
		setup: sql`
CREATE TABLE authors (id int PRIMARY KEY, name text);
CREATE TABLE books (
  id int PRIMARY KEY,
  author_id int REFERENCES authors ON DELETE RESTRICT,
  title text
);
INSERT INTO authors VALUES (1, 'Ursula K. Le Guin');
INSERT INTO books VALUES (1, 1, 'A Wizard of Earthsea');`,
		broken: sql`DELETE FROM authors WHERE id = 1;`,
		fixed: sql`
DELETE FROM books WHERE author_id = 1;
DELETE FROM authors WHERE id = 1 RETURNING *;`
	},

	'23502': {
		note: 'email is NOT NULL and the INSERT doesn’t give it a value, so it would be NULL. Supply one, or give the column a default.',
		broken: sql`INSERT INTO customers (id, first_name) VALUES (11, 'Kim') RETURNING *;`,
		fixed: sql`
INSERT INTO customers (id, email, first_name)
VALUES (11, 'kim@example.com', 'Kim')
RETURNING *;`
	},

	'23503': {
		note: 'There is no customer 999 for the order to point to. Deleting a customer who still has orders raises the same error from the other direction.',
		broken: sql`
INSERT INTO orders (id, customer_id, status)
VALUES (100, 999, 'pending');`,
		fixed: sql`
INSERT INTO orders (id, customer_id, status)
VALUES (100, 1, 'pending')
RETURNING *;`
	},

	'23505': {
		note: 'A product with id 1 already exists, and the primary key allows each id once. ON CONFLICT turns the insert into an update when the row is already there.',
		broken: sql`INSERT INTO products (id, name) VALUES (1, 'Webcam');`,
		fixed: sql`
INSERT INTO products (id, name) VALUES (1, 'Webcam')
ON CONFLICT (id) DO UPDATE SET name = excluded.name
RETURNING id, name;`
	},

	'23514': {
		note: 'The update would take the balance below zero, which the CHECK constraint forbids. Put the condition in the WHERE clause, and the update skips accounts that can’t afford it.',
		setup: sql`
CREATE TABLE accounts (id int PRIMARY KEY, balance numeric CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 50);`,
		broken: sql`UPDATE accounts SET balance = balance - 80 WHERE id = 1;`,
		fixed: sql`
UPDATE accounts SET balance = balance - 80
WHERE id = 1 AND balance >= 80
RETURNING *;`
	},

	'23P01': {
		note: 'The exclusion constraint rejects bookings that overlap an existing one, and 10:30–11:30 overlaps 10:00–11:00. Ranges written with [) leave out their end point, so a booking starting at 11:00 fits.',
		setup: sql`
CREATE TABLE bookings (during tsrange, EXCLUDE USING gist (during WITH &&));
INSERT INTO bookings VALUES ('[2024-06-01 10:00, 2024-06-01 11:00)');`,
		broken: sql`INSERT INTO bookings VALUES ('[2024-06-01 10:30, 2024-06-01 11:30)');`,
		fixed: sql`INSERT INTO bookings VALUES ('[2024-06-01 11:00, 2024-06-01 12:00)') RETURNING *;`
	},

	'24000': {
		note: 'WHERE CURRENT OF updates the row the cursor is on, and a freshly declared cursor isn’t on any row yet. FETCH one first.',
		broken: sql`
DECLARE c CURSOR FOR SELECT * FROM products ORDER BY id FOR UPDATE;
UPDATE products SET price = price * 0.9 WHERE CURRENT OF c;`,
		fixed: sql`
DECLARE c CURSOR FOR SELECT * FROM products ORDER BY id FOR UPDATE;
FETCH c;
UPDATE products SET price = price * 0.9 WHERE CURRENT OF c RETURNING id, name, price;`
	},

	'34000': {
		note: 'No cursor by that name is open. Cursors last only until the end of the transaction, so a cursor declared in one transaction is gone in the next.',
		broken: sql`FETCH 3 FROM product_cursor;`,
		fixed: sql`
DECLARE product_cursor CURSOR FOR SELECT id, name FROM products ORDER BY id;
FETCH 3 FROM product_cursor;`
	},

	'42P03': {
		note: 'A cursor with that name is already open in this transaction. Close it before declaring it again, or give the second one another name.',
		broken: sql`
DECLARE c CURSOR FOR SELECT name FROM products;
DECLARE c CURSOR FOR SELECT email FROM customers;`,
		fixed: sql`
DECLARE c CURSOR FOR SELECT name FROM products;
CLOSE c;
DECLARE c CURSOR FOR SELECT email FROM customers;
FETCH 3 FROM c;`
	},

	'25006': {
		note: 'The transaction is read-only. In practice that means a read replica or default_transaction_read_only = on, and the fix is to send the write to the primary. Here the transaction is simply switched back to read-write.',
		broken: sql`
SET TRANSACTION READ ONLY;
UPDATE products SET price = price * 1.1 WHERE id = 1;`,
		fixed: sql`
SET TRANSACTION READ WRITE;
UPDATE products SET price = price * 1.1 WHERE id = 1 RETURNING id, price;`
	},

	'3B001': {
		note: 'You can only roll back to a savepoint that was set earlier in the same transaction.',
		broken: sql`ROLLBACK TO SAVEPOINT before_update;`,
		fixed: sql`
SAVEPOINT before_update;
UPDATE products SET price = 0;
ROLLBACK TO SAVEPOINT before_update;
SELECT id, price FROM products ORDER BY id LIMIT 3;`
	},

	'2D000': {
		note: 'A DO block or procedure can only COMMIT when it isn’t running inside an outer transaction. This sandbox runs every query in one, as does any client that has already sent BEGIN. Let the caller commit.',
		broken: sql`
DO $$
BEGIN
  UPDATE products SET price = price * 1.1;
  COMMIT;
END $$;`,
		fixed: sql`
DO $$
BEGIN
  UPDATE products SET price = price * 1.1;
END $$;`
	},

	'2BP01': {
		note: 'orders has a foreign key to customers, so dropping customers would leave it pointing at nothing. CASCADE drops that foreign key constraint too, but not the orders table; check the list PostgreSQL prints before you use it.',
		broken: sql`DROP TABLE customers;`,
		fixed: sql`DROP TABLE customers CASCADE;`
	},

	'2F005': {
		note: 'For x of 0 or less, the function reaches its end without hitting a RETURN. Every path through a PL/pgSQL function that returns a value needs one.',
		broken: sql`
CREATE FUNCTION sign_label(x int) RETURNS text AS $$
BEGIN
  IF x > 0 THEN
    RETURN 'positive';
  END IF;
END $$ LANGUAGE plpgsql;

SELECT sign_label(-1);`,
		fixed: sql`
CREATE FUNCTION sign_label(x int) RETURNS text AS $$
BEGIN
  IF x > 0 THEN
    RETURN 'positive';
  END IF;
  RETURN 'not positive';
END $$ LANGUAGE plpgsql;

SELECT sign_label(-1);`
	},

	'3D000': {
		note: 'There is no database called shop on this server. current_database() names the one you’re connected to; a connection string pointing at the wrong database raises the same error when it connects.',
		broken: sql`SELECT pg_size_pretty(pg_database_size('shop'));`,
		fixed: sql`SELECT current_database(), pg_size_pretty(pg_database_size(current_database()));`
	},

	'3F000': {
		note: 'The sales schema doesn’t exist, and CREATE TABLE doesn’t create schemas along the way. Create it first.',
		broken: sql`CREATE TABLE sales.targets (month date, amount numeric);`,
		fixed: sql`
CREATE SCHEMA sales;
CREATE TABLE sales.targets (month date, amount numeric);
SELECT * FROM sales.targets;`
	},

	'42501': {
		note: 'The reporting role can see the schema but has no SELECT on the table. Grant the privileges it needs, and nothing more.',
		broken: sql`
CREATE ROLE reporting;
GRANT USAGE ON SCHEMA demo TO reporting;
SET LOCAL ROLE reporting;
SELECT email FROM customers;`,
		fixed: sql`
CREATE ROLE reporting;
GRANT USAGE ON SCHEMA demo TO reporting;
GRANT SELECT ON customers TO reporting;
SET LOCAL ROLE reporting;
SELECT email FROM customers;`
	},

	'42846': {
		note: 'There is no cast from a timestamp to an integer, since it isn’t clear which number you mean. extract(epoch ...) gives the seconds since 1970.',
		broken: sql`SELECT id, created_at::int FROM orders;`,
		fixed: sql`SELECT id, extract(epoch FROM created_at)::bigint AS created_epoch FROM orders;`
	},

	'42P19': {
		note: 'A recursive CTE has to start with its non-recursive part, then UNION, then the part that refers to itself. Here they’re the wrong way round.',
		broken: sql`
WITH RECURSIVE days(d) AS (
  SELECT d + 1 FROM days WHERE d < 7
  UNION ALL
  SELECT 1
)
SELECT d FROM days;`,
		fixed: sql`
WITH RECURSIVE days(d) AS (
  SELECT 1
  UNION ALL
  SELECT d + 1 FROM days WHERE d < 7
)
SELECT d FROM days;`
	},

	'42830': {
		note: 'A foreign key has to reference a primary key or unique column, and products.name is neither. Reference the product’s id.',
		broken: sql`
CREATE TABLE reviews (
  id int PRIMARY KEY,
  product_name varchar(255) REFERENCES products (name)
);`,
		fixed: sql`
CREATE TABLE reviews (
  id int PRIMARY KEY,
  product_id int REFERENCES products (id)
);
SELECT * FROM reviews;`
	},

	'42602': {
		note: 'demo. has nothing after the dot, so it isn’t a valid name. This usually comes from gluing a schema to an empty table name in code.',
		broken: sql`SELECT 'demo.'::regclass;`,
		fixed: sql`SELECT 'demo.products'::regclass;`
	},

	'42939': {
		note: 'Names starting with pg_ are reserved for PostgreSQL’s own roles, such as pg_read_all_data.',
		broken: sql`CREATE ROLE pg_reporter;`,
		fixed: sql`CREATE ROLE reporter;`
	},

	'42804': {
		note: 'WHERE needs a boolean. MySQL and SQLite treat a non-zero number as true, but PostgreSQL makes you write the comparison.',
		broken: sql`SELECT name FROM products WHERE stock_quantity;`,
		fixed: sql`SELECT name FROM products WHERE stock_quantity > 0;`
	},

	'42P18': {
		note: 'An empty ARRAY[] has no elements to take a type from. Cast it to the array type you want.',
		broken: sql`SELECT name, ARRAY[] AS tags FROM products;`,
		fixed: sql`SELECT name, ARRAY[]::text[] AS tags FROM products;`
	},

	'42P02': {
		note: '$1 is a placeholder that a driver or PREPARE fills in. Pasted into a SQL console, there is nothing to fill it with. Put the value in, or run the query through your driver.',
		broken: sql`SELECT id, name FROM products WHERE id = $1;`,
		fixed: sql`SELECT id, name FROM products WHERE id = 1;`
	},

	'42P21': {
		note: 'Each side of the comparison names a different collation with COLLATE, and PostgreSQL won’t choose between them. Name one; an explicit collation on either side decides the comparison.',
		broken: sql`SELECT name COLLATE "C" < category COLLATE "POSIX" FROM products;`,
		fixed: sql`SELECT name COLLATE "C" < category FROM products;`
	},

	'42P22': {
		note: 'The two columns were declared with different collations, and nothing in the query says which to compare with. Add COLLATE to settle it.',
		setup: sql`
CREATE TABLE labels (a text COLLATE "C", b text COLLATE "POSIX");
INSERT INTO labels VALUES ('apple', 'Banana');`,
		broken: sql`SELECT a < b FROM labels;`,
		fixed: sql`SELECT a < b COLLATE "C" FROM labels;`
	},

	'42809': {
		note: 'A plain view stores no rows, so there’s nothing to index. Index the table the view reads from, with the view’s filter as a partial index if it helps.',
		broken: sql`
CREATE VIEW us_customers AS SELECT * FROM customers WHERE country = 'US';
CREATE INDEX ON us_customers (email);`,
		fixed: sql`
CREATE VIEW us_customers AS SELECT * FROM customers WHERE country = 'US';
CREATE INDEX ON customers (email) WHERE country = 'US';
SELECT email FROM us_customers;`
	},

	'428C9': {
		note: 'A GENERATED ALWAYS identity column fills itself in and refuses supplied values. Leave the column out, or add OVERRIDING SYSTEM VALUE when you really do need a specific id, as when copying data over.',
		setup: sql`CREATE TABLE tags (id int GENERATED ALWAYS AS IDENTITY, name text);`,
		broken: sql`INSERT INTO tags (id, name) VALUES (1, 'sql');`,
		fixed: sql`INSERT INTO tags (name) VALUES ('sql') RETURNING *;`
	},

	'42704': {
		note: 'PostgreSQL has no type called double; it’s double precision. Other names from MySQL or SQL Server hit the same error, such as datetime (timestamp) and tinyint (smallint).',
		broken: sql`ALTER TABLE products ADD COLUMN weight double;`,
		fixed: sql`
ALTER TABLE products ADD COLUMN weight double precision;
SELECT name, weight FROM products LIMIT 3;`
	},

	'42701': {
		note: 'SELECT * over a join returns both tables’ id columns, and a table can’t have two columns with the same name. List the columns, and rename the ones that clash.',
		broken: sql`
CREATE TABLE order_report AS
SELECT * FROM orders o JOIN customers c ON c.id = o.customer_id;`,
		fixed: sql`
CREATE TABLE order_report AS
SELECT o.id AS order_id, c.id AS customer_id, c.email, o.total_amount
FROM orders o JOIN customers c ON c.id = o.customer_id;
SELECT * FROM order_report LIMIT 3;`
	},

	'42723': {
		note: 'A function with that name and those argument types already exists. CREATE OR REPLACE swaps in the new body.',
		broken: sql`
CREATE FUNCTION tax_rate() RETURNS numeric AS 'SELECT 0.20' LANGUAGE sql;
CREATE FUNCTION tax_rate() RETURNS numeric AS 'SELECT 0.19' LANGUAGE sql;`,
		fixed: sql`
CREATE FUNCTION tax_rate() RETURNS numeric AS 'SELECT 0.20' LANGUAGE sql;
CREATE OR REPLACE FUNCTION tax_rate() RETURNS numeric AS 'SELECT 0.19' LANGUAGE sql;
SELECT tax_rate();`
	},

	'42P06': {
		note: 'The schema is already there. IF NOT EXISTS makes a setup script safe to run twice.',
		broken: sql`CREATE SCHEMA demo;`,
		fixed: sql`CREATE SCHEMA IF NOT EXISTS demo;`
	},

	'42P07': {
		note: 'A table, view, index or sequence with that name already exists in the schema; they all share one namespace. Use IF NOT EXISTS, or pick another name.',
		broken: sql`CREATE TABLE products (id int PRIMARY KEY, name text);`,
		fixed: sql`CREATE TABLE IF NOT EXISTS products (id int PRIMARY KEY, name text);`
	},

	'42712': {
		note: 'Both tables are aliased o, so o.id could mean either one. Give each table its own alias.',
		broken: sql`
SELECT o.id, o.quantity
FROM orders o
JOIN order_items o ON o.order_id = o.id;`,
		fixed: sql`
SELECT o.id, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id;`
	},

	'42710': {
		note: 'Constraint names are unique per table, and both checks are called positive. Name each after what it checks.',
		broken: sql`
ALTER TABLE products
  ADD CONSTRAINT positive CHECK (price > 0),
  ADD CONSTRAINT positive CHECK (stock_quantity >= 0);`,
		fixed: sql`
ALTER TABLE products
  ADD CONSTRAINT price_positive CHECK (price > 0),
  ADD CONSTRAINT stock_not_negative CHECK (stock_quantity >= 0);`
	},

	'42725': {
		note: 'Both versions of discount() take an integer and a numeric, in opposite orders, and two integer literals fit either one equally well. Cast an argument so only one matches.',
		setup: sql`
CREATE FUNCTION discount(qty int, price numeric) RETURNS numeric AS 'SELECT price * 0.9' LANGUAGE sql;
CREATE FUNCTION discount(price numeric, qty int) RETURNS numeric AS 'SELECT price * 0.8' LANGUAGE sql;`,
		broken: sql`SELECT discount(3, 20);`,
		fixed: sql`SELECT discount(3, 20::numeric);`
	},

	'42P13': {
		note: 'The function is declared to return integer, but its last SELECT returns text. Change the declared type, or the query, so they agree.',
		broken: sql`
CREATE FUNCTION product_label(p_id int) RETURNS int AS $$
  SELECT name FROM products WHERE id = p_id
$$ LANGUAGE sql;`,
		fixed: sql`
CREATE FUNCTION product_label(p_id int) RETURNS text AS $$
  SELECT name FROM products WHERE id = p_id
$$ LANGUAGE sql;
SELECT product_label(1);`
	},

	'42P16': {
		note: 'products already has a primary key, and a table can only have one. To keep another column unique, add a UNIQUE constraint.',
		broken: sql`ALTER TABLE products ADD PRIMARY KEY (name);`,
		fixed: sql`ALTER TABLE products ADD UNIQUE (name);`
	},

	'42P17': {
		note: 'An index stores values once, so everything in it has to be IMMUTABLE, and now() changes all the time. Index the column itself; a range query like created_at > now() - interval \'30 days\' still uses it.',
		broken: sql`CREATE INDEX ON orders ((now() - created_at));`,
		fixed: sql`CREATE INDEX ON orders (created_at);`
	},

	'44000': {
		note: 'WITH CHECK OPTION stops changes through the view that would push a row out of it, and a customer moved to CA would no longer be a US customer. Make the change on the table.',
		broken: sql`
CREATE VIEW us_customers AS
  SELECT * FROM customers WHERE country = 'US'
  WITH CHECK OPTION;
UPDATE us_customers SET country = 'CA' WHERE id = 1;`,
		fixed: sql`
CREATE VIEW us_customers AS
  SELECT * FROM customers WHERE country = 'US'
  WITH CHECK OPTION;
UPDATE customers SET country = 'CA' WHERE id = 1 RETURNING id, country;`
	},

	'54000': {
		note: 'PostgreSQL text can’t hold the NUL character (byte 0), which tends to arrive with data from C programs or binary files. Strip it before inserting, or store the raw bytes as bytea.',
		broken: sql`SELECT 'part' || chr(0) || 'number';`,
		fixed: sql`SELECT 'part' || ' ' || 'number';`
	},

	'55000': {
		note: 'currval returns the value nextval last gave this session, so it fails until nextval has run at least once.',
		broken: sql`
CREATE SEQUENCE invoice_no;
SELECT currval('invoice_no');`,
		fixed: sql`
CREATE SEQUENCE invoice_no;
SELECT nextval('invoice_no'), currval('invoice_no');`
	},

	'55P02': {
		note: 'shared_buffers is set when the server starts. Change it in postgresql.conf, or with ALTER SYSTEM, and restart. Settings like work_mem can be changed per session.',
		broken: sql`SET shared_buffers = '1GB';`,
		fixed: sql`SET work_mem = '64MB';`
	},

	P0001: {
		note: 'P0001 is the code for RAISE EXCEPTION when no other code is given, so the message comes from your own function or trigger. Here reserve_stock refuses to reserve more than is in stock.',
		setup: sql`
CREATE FUNCTION reserve_stock(product int, qty int) RETURNS void AS $$
DECLARE
  left_in_stock int;
BEGIN
  SELECT stock_quantity INTO left_in_stock FROM demo.products WHERE id = product;
  IF qty > left_in_stock THEN
    RAISE EXCEPTION 'Only % left in stock', left_in_stock;
  END IF;
END $$ LANGUAGE plpgsql;`,
		broken: sql`SELECT reserve_stock(2, 500);`,
		fixed: sql`SELECT reserve_stock(2, 5);`
	},

	P0002: {
		note: 'SELECT INTO STRICT requires exactly one row and there’s no product 999. Without STRICT, a missing row leaves the variable NULL, and FOUND tells you what happened.',
		broken: sql`
DO $$
DECLARE
  p products;
BEGIN
  SELECT * INTO STRICT p FROM products WHERE id = 999;
END $$;`,
		fixed: sql`
DO $$
DECLARE
  p products;
BEGIN
  SELECT * INTO p FROM products WHERE id = 999;
  IF NOT FOUND THEN
    RAISE NOTICE 'no product 999';
  END IF;
END $$;`
	},

	P0003: {
		note: 'SELECT INTO STRICT requires exactly one row, and there are several Electronics products. Narrow the WHERE clause to a single row, or loop over them all.',
		broken: sql`
DO $$
DECLARE
  p products;
BEGIN
  SELECT * INTO STRICT p FROM products WHERE category = 'Electronics';
END $$;`,
		fixed: sql`
DO $$
DECLARE
  p products;
BEGIN
  SELECT * INTO STRICT p FROM products WHERE category = 'Electronics' AND id = 1;
END $$;`
	},

	P0004: {
		note: 'ASSERT raises P0004 with its message when its condition is false; here the assumption about the data was wrong. Assertions are for catching bugs, and plpgsql.check_asserts = off disables them, so don’t rely on them for validation.',
		broken: sql`
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM products) = 0, 'expected no products';
END $$;`,
		fixed: sql`
DO $$
BEGIN
  ASSERT (SELECT count(*) FROM products WHERE price < 0) = 0, 'found a negative price';
END $$;`
	},

	'0Z002': {
		note: 'GET STACKED DIAGNOSTICS reads the error being handled, so it only works inside an EXCEPTION block.',
		broken: sql`
DO $$
DECLARE
  msg text;
BEGIN
  GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
END $$;`,
		fixed: sql`
DO $$
DECLARE
  msg text;
BEGIN
  PERFORM 1 / 0;
EXCEPTION WHEN others THEN
  GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT;
  RAISE NOTICE 'caught: %', msg;
END $$;`
	}
};
