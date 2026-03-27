import sql from '../_lib/db.js';
import { requireAdmin, json } from '../_lib/auth.js';

export default async function handler(req) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const sales = await sql`
      SELECT s.*, b.title_es
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      ORDER BY s.created_at DESC LIMIT 100
    `;
    return json({ sales });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
