import { describe, expect, it } from 'vitest';
import { gradeChallenge } from './index';

// Grading compares result sets, not query text, so these tests pin the
// behaviour that matters: a differently-written correct answer passes, and the
// type quirks PGlite introduces (NUMERIC and BIGINT come back as strings)
// don't produce false negatives.

const CUSTOMERS_WITHOUT_ORDERS = `
  SELECT c.first_name, c.last_name
  FROM demo.customers c
  LEFT JOIN demo.orders o ON o.customer_id = c.id
  WHERE o.id IS NULL
`;

describe('gradeChallenge', () => {
	it('accepts a different formulation of the same answer', async () => {
		const viaNotExists = `
			SELECT c.first_name, c.last_name
			FROM demo.customers c
			WHERE NOT EXISTS (SELECT 1 FROM demo.orders o WHERE o.customer_id = c.id)
		`;
		const grade = await gradeChallenge(viaNotExists, { solution: CUSTOMERS_WITHOUT_ORDERS });
		expect(grade.status).toBe('correct');
	});

	it('ignores row order by default', async () => {
		const reversed = `${CUSTOMERS_WITHOUT_ORDERS} ORDER BY c.first_name DESC`;
		const grade = await gradeChallenge(reversed, { solution: CUSTOMERS_WITHOUT_ORDERS });
		expect(grade.status).toBe('correct');
	});

	it('enforces row order when the challenge is ordered', async () => {
		const ascending = `SELECT name FROM demo.products ORDER BY price ASC`;
		const descending = `SELECT name FROM demo.products ORDER BY price DESC`;
		const grade = await gradeChallenge(ascending, { solution: descending, ordered: true });
		expect(grade.status).toBe('wrong');
		if (grade.status === 'wrong') expect(grade.reason).toMatch(/order/i);
	});

	it('matches NUMERIC results despite PGlite returning them as strings', async () => {
		// AVG(price) comes back as the string "55.2400000000000000"; the literal
		// is a number. Normalisation has to bridge that.
		const grade = await gradeChallenge(`SELECT ROUND(AVG(price), 2) FROM demo.products`, {
			solution: `SELECT 55.24::numeric`
		});
		expect(grade.status).toBe('correct');
	});

	it('reports a column-count mismatch', async () => {
		const grade = await gradeChallenge(`SELECT first_name, last_name FROM demo.customers`, {
			solution: `SELECT first_name FROM demo.customers`
		});
		expect(grade.status).toBe('wrong');
		if (grade.status === 'wrong') expect(grade.reason).toMatch(/column/i);
	});

	it('reports a row-count mismatch', async () => {
		const grade = await gradeChallenge(`SELECT name FROM demo.products`, {
			solution: `SELECT name FROM demo.products WHERE price > 50`
		});
		expect(grade.status).toBe('wrong');
		if (grade.status === 'wrong') expect(grade.reason).toMatch(/row/i);
	});

	it('reports right shape but wrong values', async () => {
		const grade = await gradeChallenge(`SELECT name FROM demo.products ORDER BY price LIMIT 3`, {
			solution: `SELECT name FROM demo.products ORDER BY price DESC LIMIT 3`
		});
		expect(grade.status).toBe('wrong');
		if (grade.status === 'wrong') expect(grade.reason).toMatch(/values differ/i);
	});

	it('surfaces the Postgres error for invalid SQL', async () => {
		const grade = await gradeChallenge(`SELECT nope FROM demo.customers`, {
			solution: `SELECT first_name FROM demo.customers`
		});
		expect(grade.status).toBe('error');
		if (grade.status === 'error') expect(grade.message).toMatch(/nope/);
	});

	it('rejects an empty submission without touching the database', async () => {
		const grade = await gradeChallenge('   ', { solution: `SELECT 1` });
		expect(grade.status).toBe('error');
	});

	it('does not let one attempt leak into the next', async () => {
		await gradeChallenge(`DELETE FROM demo.order_items`, { solution: `SELECT 1` });
		const grade = await gradeChallenge(`SELECT COUNT(*) FROM demo.order_items`, {
			solution: `SELECT 17::bigint`
		});
		expect(grade.status).toBe('correct');
	});
});
