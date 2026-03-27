import sql from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  if (req.method === 'POST') {
    const { book_id, currency, amount, is_active } = req.body;
    try {
      const rows = await sql`
        INSERT INTO am_prices (book_id, currency, amount, is_active)
        VALUES (${book_id}, ${currency}, ${amount}, ${is_active !== false})
        ON CONFLICT (book_id, currency) DO UPDATE SET amount=${amount}, is_active=${is_active !== false}
        RETURNING *
      `;
      return res.status(200).json({ price: rows[0] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    const { book_id, currency } = req.body;
    try {
      await sql`DELETE FROM am_prices WHERE book_id=${book_id} AND currency=${currency}`;
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
