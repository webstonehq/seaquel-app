/**
 * End-of-lesson challenges, graded by comparing the learner's result set to
 * `solution` (see $lib/sandbox). Grading on rows rather than query text means
 * any correct formulation passes, so `solution` only has to be *a* right
 * answer, not the only one.
 *
 * These live here rather than in lesson frontmatter because they're SQL that
 * has to keep working: `challenges.test.ts` executes every solution against
 * the seeded database on each run.
 */

export interface Challenge {
	/** Stable across edits — progress is recorded against it. */
	id: string;
	prompt: string;
	/** Shown on request, before the answer. */
	hint: string;
	/** Pre-filled in the editor. Leave the shape, remove the thinking. */
	starter?: string;
	solution: string;
	/** Set when the prompt asks for a specific order. */
	ordered?: boolean;
	/** Shown once solved. */
	explanation: string;
}

export const CHALLENGES: Record<string, Challenge[]> = {
	intro: [
		{
			id: 'intro-uk-customer',
			prompt: 'Return the first and last name of every customer in the UK.',
			hint: "The country column holds two-letter codes, and text values need single quotes.",
			starter: 'SELECT first_name, last_name\nFROM demo.customers\nWHERE ...;',
			solution: `SELECT first_name, last_name FROM demo.customers WHERE country = 'UK'`,
			explanation: 'One row: David Brown. Single quotes are for values, double quotes for identifiers.'
		},
		{
			id: 'intro-cheap-products',
			prompt: 'Return the name and price of every product that costs less than 20.',
			hint: 'Three products are under 20. No quotes around numbers.',
			solution: `SELECT name, price FROM demo.products WHERE price < 20`,
			explanation: 'Mouse Pad XL at 19.99, Cable Organizer at 12.99 and the USB Flash Drive at 14.99.'
		}
	],

	select: [
		{
			id: 'select-full-name',
			prompt:
				'Return one column called full_name holding each customer\'s first and last name separated by a space.',
			hint: 'Postgres concatenates text with ||, and AS renames the result.',
			starter: "SELECT ... AS full_name\nFROM demo.customers;",
			solution: `SELECT first_name || ' ' || last_name AS full_name FROM demo.customers`,
			explanation:
				'Ten rows. The alias only affects the output; it does not exist while WHERE is running.'
		},
		{
			id: 'select-distinct-category',
			prompt: 'Return each product category exactly once.',
			hint: 'DISTINCT applies to the whole selected row, so select only the one column.',
			solution: `SELECT DISTINCT category FROM demo.products`,
			explanation: 'Three rows: Electronics, Accessories and Storage.'
		},
		{
			id: 'select-sale-price',
			prompt:
				'Return each product name alongside its price reduced by 10 percent, in a column called sale_price.',
			hint: 'You can compute new columns in the select list. price * 0.9 gets you there.',
			solution: `SELECT name, price * 0.9 AS sale_price FROM demo.products`,
			explanation: 'Twelve rows. The select list is not limited to columns that already exist.'
		}
	],

	where: [
		{
			id: 'where-unshipped',
			prompt: 'Return the id and status of every order that has not shipped yet.',
			hint: 'shipped_at is NULL for those. Remember that = NULL never matches anything.',
			solution: `SELECT id, status FROM demo.orders WHERE shipped_at IS NULL`,
			explanation: 'Five rows. IS NULL is the only way to test for null; = NULL is always unknown.'
		},
		{
			id: 'where-precedence',
			prompt:
				'Return products that are in the Electronics or Storage category AND cost less than 50.',
			hint: 'AND binds tighter than OR, so the two category tests need brackets around them.',
			solution: `SELECT name, category, price FROM demo.products WHERE (category = 'Electronics' OR category = 'Storage') AND price < 50`,
			explanation:
				'Three rows: Wireless Mouse, USB-C Hub and USB Flash Drive. Without the brackets every Electronics product comes back regardless of price.'
		},
		{
			id: 'where-usb',
			prompt: 'Return the name of every product whose name contains "USB".',
			hint: '% matches any run of characters, and LIKE is case sensitive in Postgres.',
			solution: `SELECT name FROM demo.products WHERE name LIKE '%USB%'`,
			explanation: 'Two rows: USB-C Hub and USB Flash Drive 64GB.'
		}
	],

	'order-by': [
		{
			id: 'order-by-inventory-value',
			prompt:
				'Return each product name with its price multiplied by stock_quantity as inventory_value, most valuable first.',
			hint: 'ORDER BY runs after SELECT, so you can sort by the alias you just defined.',
			ordered: true,
			solution: `SELECT name, price * stock_quantity AS inventory_value FROM demo.products ORDER BY inventory_value DESC`,
			explanation:
				'USB-C Hub tops the list at 9,998. Aliases work in ORDER BY but not in WHERE, because ORDER BY runs later.'
		},
		{
			id: 'order-by-three-cheapest',
			prompt: 'Return the three cheapest products, name and price, cheapest first.',
			hint: 'LIMIT without ORDER BY gives arbitrary rows, so you need both.',
			ordered: true,
			solution: `SELECT name, price FROM demo.products ORDER BY price ASC LIMIT 3`,
			explanation: 'Cable Organizer, USB Flash Drive, Mouse Pad XL.'
		}
	],

	aggregates: [
		{
			id: 'aggregates-count-vs-column',
			prompt:
				'Return two columns in one row: the total number of orders, and the number of orders that have actually shipped.',
			hint: 'COUNT(*) counts rows; COUNT(column) skips nulls. shipped_at is null until an order ships.',
			solution: `SELECT COUNT(*) AS total, COUNT(shipped_at) AS shipped FROM demo.orders`,
			explanation: '10 and 5. That gap between COUNT(*) and COUNT(column) is entirely about nulls.'
		},
		{
			id: 'aggregates-distinct-customers',
			prompt: 'How many distinct customers have placed at least one order? Return a single number.',
			hint: 'Two customers ordered twice, so this is smaller than the order count.',
			solution: `SELECT COUNT(DISTINCT customer_id) FROM demo.orders`,
			explanation: 'Eight. Ten orders, but Alice and Bob account for two each.'
		},
		{
			id: 'aggregates-completed-revenue',
			prompt:
				'Return the number of completed orders and the sum of their total_amount, as order_count and revenue.',
			hint: 'WHERE runs before aggregation, so filter first and aggregate what survives.',
			solution: `SELECT COUNT(*) AS order_count, SUM(total_amount) AS revenue FROM demo.orders WHERE status = 'completed'`,
			explanation: 'Four orders totalling 444.93.'
		}
	],

	'group-by': [
		{
			id: 'group-by-per-category',
			prompt: 'Return each category with the number of products in it.',
			hint: 'Every column in the select list must be aggregated or grouped.',
			solution: `SELECT category, COUNT(*) AS product_count FROM demo.products GROUP BY category`,
			explanation: 'Electronics 5, Accessories 5, Storage 2.'
		},
		{
			id: 'group-by-status',
			prompt:
				'Return each order status with how many orders have it and how many of those have shipped.',
			hint: 'COUNT(*) and COUNT(shipped_at) can sit side by side in the same grouped query.',
			solution: `SELECT status, COUNT(*) AS orders, COUNT(shipped_at) AS shipped FROM demo.orders GROUP BY status`,
			explanation:
				'Four rows. pending has 3 orders and 0 shipped; completed has 4 and 4.'
		},
		{
			id: 'group-by-lifetime-value',
			prompt:
				'Return every customer\'s first name with how many orders they have placed, including the two who have never ordered (they should show 0).',
			hint: 'LEFT JOIN keeps the customers with no orders, but COUNT(*) would count their null row as 1.',
			solution: `SELECT c.first_name, COUNT(o.id) AS order_count FROM demo.customers c LEFT JOIN demo.orders o ON o.customer_id = c.id GROUP BY c.id, c.first_name`,
			explanation:
				'Ten rows. COUNT(o.id) skips the nulls a LEFT JOIN produces, so Iris and Jack correctly show 0 rather than 1.'
		}
	],

	having: [
		{
			id: 'having-big-categories',
			prompt: 'Return the categories that contain more than three products, with their counts.',
			hint: 'You cannot filter on COUNT(*) in WHERE, because WHERE runs before the grouping.',
			solution: `SELECT category, COUNT(*) AS product_count FROM demo.products GROUP BY category HAVING COUNT(*) > 3`,
			explanation: 'Electronics and Accessories, five each. Storage has two and is dropped.'
		},
		{
			id: 'having-repeat-customers',
			prompt: 'Return the customer_id of every customer who has placed more than one order.',
			hint: 'Group by the customer, then filter the groups.',
			solution: `SELECT customer_id FROM demo.orders GROUP BY customer_id HAVING COUNT(*) > 1`,
			explanation: 'Customers 1 and 2, Alice and Bob.'
		}
	],

	joins: [
		{
			id: 'joins-orders-with-names',
			prompt:
				"Return each order's id alongside the first and last name of the customer who placed it.",
			hint: 'Both tables have an id column, so alias the tables and qualify every column.',
			solution: `SELECT o.id, c.first_name, c.last_name FROM demo.orders o JOIN demo.customers c ON c.id = o.customer_id`,
			explanation: 'Ten rows, one per order.'
		},
		{
			id: 'joins-never-ordered',
			prompt: 'Return the first and last name of every customer who has never placed an order.',
			hint: 'LEFT JOIN everything, then keep only the rows where the right side came back null.',
			solution: `SELECT c.first_name, c.last_name FROM demo.customers c LEFT JOIN demo.orders o ON o.customer_id = c.id WHERE o.id IS NULL`,
			explanation:
				'Iris Taylor and Jack Anderson. An inner join structurally cannot answer this question.'
		},
		{
			id: 'joins-line-item-detail',
			prompt:
				'Return the product name, quantity and unit_price for every line item, joined through orders from customers.',
			hint: 'Four tables chained: customers, orders, order_items, products.',
			solution: `SELECT p.name, oi.quantity, oi.unit_price FROM demo.customers c JOIN demo.orders o ON o.customer_id = c.id JOIN demo.order_items oi ON oi.order_id = o.id JOIN demo.products p ON p.id = oi.product_id`,
			explanation: 'Seventeen rows, one per line item.'
		}
	],

	subqueries: [
		{
			id: 'subqueries-above-average',
			prompt: 'Return the name and price of every product priced above the average product price.',
			hint: 'A scalar subquery returns one row and one column, and can sit on the right of a comparison.',
			solution: `SELECT name, price FROM demo.products WHERE price > (SELECT AVG(price) FROM demo.products)`,
			explanation:
				'Five products clear the 55.24 average. You cannot write WHERE price > AVG(price) directly; aggregates are not allowed in WHERE.'
		},
		{
			id: 'subqueries-not-exists',
			prompt:
				'Return the first name of every customer with no orders, using NOT EXISTS rather than a join.',
			hint: 'NOT EXISTS takes a correlated subquery that references the outer table.',
			solution: `SELECT c.first_name FROM demo.customers c WHERE NOT EXISTS (SELECT 1 FROM demo.orders o WHERE o.customer_id = c.id)`,
			explanation:
				'Iris and Jack. NOT EXISTS is the null-safe alternative to NOT IN, which returns nothing at all if the subquery yields a null.'
		},
		{
			id: 'subqueries-completed-buyers',
			prompt: 'Return the first name of every customer who has at least one completed order.',
			hint: 'IN accepts a column of values from a subquery.',
			solution: `SELECT first_name FROM demo.customers WHERE id IN (SELECT customer_id FROM demo.orders WHERE status = 'completed')`,
			explanation: 'Alice, Bob and Carol.'
		}
	],

	cte: [
		{
			id: 'cte-category-revenue',
			prompt:
				'Using a CTE, return each product category with the total revenue of its line items as revenue.',
			hint: 'Build the line-level rows in the CTE, then aggregate them in the final SELECT.',
			solution: `WITH lines AS (SELECT p.category, oi.quantity * oi.unit_price AS line_value FROM demo.order_items oi JOIN demo.products p ON p.id = oi.product_id) SELECT category, SUM(line_value) AS revenue FROM lines GROUP BY category`,
			explanation:
				'Three rows. The CTE is a named step you can inspect on its own, which is what makes it easier to debug than a nested subquery.'
		},
		{
			id: 'cte-customer-totals',
			prompt:
				'Using a CTE, return customer_id and total_spent for customers who have spent more than 150.',
			hint: 'Aggregate in the CTE, filter in the outer query — that also sidesteps the alias rules.',
			solution: `WITH totals AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM demo.orders GROUP BY customer_id) SELECT customer_id, total_spent FROM totals WHERE total_spent > 150`,
			explanation:
				'Four customers. Filtering outside the CTE lets you use WHERE on an aggregate alias, which HAVING would otherwise force you to repeat.'
		}
	],

	window: [
		{
			id: 'window-category-average',
			prompt:
				'Return every product with its name, price, and the average price of its category as category_avg, without collapsing the rows.',
			hint: 'PARTITION BY groups rows for the calculation while leaving them in the output.',
			solution: `SELECT name, price, AVG(price) OVER (PARTITION BY category) AS category_avg FROM demo.products`,
			explanation:
				'Twelve rows in, twelve out. GROUP BY would have given you three rows and lost the names.'
		},
		{
			id: 'window-top-per-category',
			prompt: 'Return the single most expensive product in each category: name, category and price.',
			hint: 'Rank inside a CTE, then filter on the rank. You cannot filter a window function in WHERE.',
			solution: `WITH ranked AS (SELECT name, category, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn FROM demo.products) SELECT name, category, price FROM ranked WHERE rn = 1`,
			explanation:
				'Headphones, Laptop Stand and External SSD. Postgres has no QUALIFY, so the CTE is the way to do this.'
		},
		{
			id: 'window-running-total',
			prompt:
				'Return each order id, its total_amount, and a running total of total_amount ordered by created_at.',
			hint: 'Adding ORDER BY inside OVER changes an aggregate into a running one.',
			ordered: true,
			solution: `SELECT id, total_amount, SUM(total_amount) OVER (ORDER BY created_at) AS running_total FROM demo.orders ORDER BY created_at`,
			explanation:
				'Climbs to 1,289.81 on the last row. Without ORDER BY inside OVER, every row would show the grand total instead.'
		}
	]
};

export function getChallenges(slug: string): Challenge[] {
	return CHALLENGES[slug] ?? [];
}

export const TOTAL_CHALLENGES = Object.values(CHALLENGES).reduce(
	(sum, list) => sum + list.length,
	0
);
