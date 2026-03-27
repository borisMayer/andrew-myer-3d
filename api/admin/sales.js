import sql from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const auth = req.headers['authorization'] || '';
    const token = auth.replace('Bearer ', '').trim();
    await verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const sales = await sql`
      SELECT s.*, b.title_es
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      ORDER BY s.created_at DESC LIMIT 100
    `;
    return res.status(200).json({ sales });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
