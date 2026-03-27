import sql from '../_lib/db.js';
import { requireAdmin, json } from '../_lib/auth.js';

export default async function handler(req) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  if (req.method === 'POST') {
    const body = await req.json();
    const rows = await sql`
      INSERT INTO am_prices (book_id, currency, amount, is_active)
      VALUES (${body.book_id}, ${body.currency}, ${body.amount}, ${body.is_active !== false})
      ON CONFLICT (book_id, currency) DO UPDATE SET amount=${body.amount}, is_active=${body.is_active !== false}
      RETURNING *
    `;
    return json({ price: rows[0] });
  }

  if (req.method === 'DELETE') {
    const { book_id, currency } = await req.json();
    await sql`DELETE FROM am_prices WHERE book_id=${book_id} AND currency=${currency}`;
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
