import sql from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

function getBookId(req) {
  // Try req.query first (works in some Vercel configs)
  if (req.query && req.query.id) return req.query.id;
  // Fallback: extract from URL path
  const url = req.url || '';
  const parts = url.split('?')[0].split('/');
  return parts[parts.length - 1];
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const id = getBookId(req);
  
  if (!id || id === '[id]') {
    return res.status(400).json({ error: 'Book ID requerido' });
  }

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

  // Auth required for mutations
  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  if (req.method === 'PUT') {
    const b = req.body;
    try {
      const existing = await sql`SELECT * FROM am_books WHERE id = ${id} LIMIT 1`;
      if (!existing.length) return res.status(404).json({ error: 'Not found' });
      const ex = existing[0];
      const rows = await sql`
        UPDATE am_books SET
          slug           = ${b.slug           !== undefined ? b.slug           : ex.slug},
          title_es       = ${b.title_es       !== undefined ? b.title_es       : ex.title_es},
          title_en       = ${b.title_en       !== undefined ? b.title_en       : ex.title_en},
          subtitle_es    = ${b.subtitle_es    !== undefined ? b.subtitle_es    : ex.subtitle_es},
          subtitle_en    = ${b.subtitle_en    !== undefined ? b.subtitle_en    : ex.subtitle_en},
          description_es = ${b.description_es !== undefined ? b.description_es : ex.description_es},
          description_en = ${b.description_en !== undefined ? b.description_en : ex.description_en},
          cover_url      = ${b.cover_url      !== undefined ? b.cover_url      : ex.cover_url},
          pdf_url        = ${b.pdf_url        !== undefined ? b.pdf_url        : ex.pdf_url},
          isbn           = ${b.isbn           !== undefined ? b.isbn           : ex.isbn},
          year           = ${b.year           !== undefined ? b.year           : ex.year},
          is_published   = ${b.is_published   !== undefined ? b.is_published   : ex.is_published},
          sort_order     = ${b.sort_order     !== undefined ? b.sort_order     : ex.sort_order}
        WHERE id = ${id} RETURNING *
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
