import sql, { initTables } from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  await initTables();

  if (req.method === 'GET') {
    const onlyPublished = req.query?.published !== 'false';
    try {
      const books = onlyPublished
        ? await sql`SELECT b.*, COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as prices
                    FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id AND p.is_active = true
                    WHERE b.is_published = true GROUP BY b.id ORDER BY b.sort_order, b.created_at`
        : await sql`SELECT b.*, COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as prices
                    FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id
                    GROUP BY b.id ORDER BY b.sort_order, b.created_at`;
      return res.status(200).json({ books });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  if (req.method === 'POST') {
    const b = req.body;
    try {
      const rows = await sql`
        INSERT INTO am_books (slug, title_es, title_en, subtitle_es, subtitle_en,
          description_es, description_en, cover_url, pdf_url, isbn, year, is_published, sort_order)
        VALUES (${b.slug}, ${b.title_es}, ${b.title_en||''}, ${b.subtitle_es||null}, ${b.subtitle_en||null},
          ${b.description_es||''}, ${b.description_en||''}, ${b.cover_url||null}, ${b.pdf_url||null},
          ${b.isbn||null}, ${b.year||null}, ${b.is_published||false}, ${b.sort_order||0})
        RETURNING *
      `;
      return res.status(201).json({ book: rows[0] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
