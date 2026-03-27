import sql from '../_lib/db.js';
import { requireAdmin, json } from '../_lib/auth.js';

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id  = url.pathname.split('/').pop()!;

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT b.*, json_agg(p.*) FILTER (WHERE p.id IS NOT NULL) as prices
      FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id
      WHERE b.id = ${id} GROUP BY b.id LIMIT 1
    `;
    if (rows.length === 0) return json({ error: 'Not found' }, 404);
    return json({ book: rows[0] });
  }

  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  if (req.method === 'PUT') {
    const body = await req.json();
    const rows = await sql`
      UPDATE am_books SET
        slug = ${body.slug}, title_es = ${body.title_es}, title_en = ${body.title_en},
        subtitle_es = ${body.subtitle_es ?? null}, subtitle_en = ${body.subtitle_en ?? null},
        description_es = ${body.description_es ?? ''}, description_en = ${body.description_en ?? ''},
        cover_url = ${body.cover_url ?? null}, pdf_url = ${body.pdf_url ?? null},
        isbn = ${body.isbn ?? null}, year = ${body.year ?? null},
        is_published = ${body.is_published ?? false}, sort_order = ${body.sort_order ?? 0}
      WHERE id = ${id} RETURNING *
    `;
    return json({ book: rows[0] });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM am_books WHERE id = ${id}`;
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
