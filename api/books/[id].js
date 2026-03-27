import sql from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT b.*, COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as prices
        FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id
        WHERE b.id = ${id} GROUP BY b.id LIMIT 1
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ book: rows[0] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  if (req.method === 'PUT') {
    const b = req.body;
    try {
      const rows = await sql`
        UPDATE am_books SET slug=${b.slug}, title_es=${b.title_es}, title_en=${b.title_en||''},
          subtitle_es=${b.subtitle_es||null}, subtitle_en=${b.subtitle_en||null},
          description_es=${b.description_es||''}, description_en=${b.description_en||''},
          cover_url=${b.cover_url||null}, pdf_url=${b.pdf_url||null},
          isbn=${b.isbn||null}, year=${b.year||null},
          is_published=${b.is_published||false}, sort_order=${b.sort_order||0}
        WHERE id=${id} RETURNING *
      `;
      return res.status(200).json({ book: rows[0] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM am_books WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
