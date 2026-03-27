import sql, { initTables } from '../_lib/db.js';
import { requireAdmin, json } from '../_lib/auth.js';

export default async function handler(req: Request) {
  await initTables();

  // GET — public catalog
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const onlyPublished = url.searchParams.get('published') !== 'false';

    const books = onlyPublished
      ? await sql`SELECT b.*, json_agg(p.*) FILTER (WHERE p.id IS NOT NULL) as prices
                  FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id AND p.is_active = true
                  WHERE b.is_published = true GROUP BY b.id ORDER BY b.sort_order, b.created_at`
      : await sql`SELECT b.*, json_agg(p.*) FILTER (WHERE p.id IS NOT NULL) as prices
                  FROM am_books b LEFT JOIN am_prices p ON p.book_id = b.id
                  GROUP BY b.id ORDER BY b.sort_order, b.created_at`;

    return json({ books });
  }

  // POST — create book (admin only)
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  if (req.method === 'POST') {
    const body = await req.json();
    const rows = await sql`
      INSERT INTO am_books (slug, title_es, title_en, subtitle_es, subtitle_en,
        description_es, description_en, cover_url, pdf_url, isbn, year, is_published, sort_order)
      VALUES (${body.slug}, ${body.title_es}, ${body.title_en},
        ${body.subtitle_es ?? null}, ${body.subtitle_en ?? null},
        ${body.description_es ?? ''}, ${body.description_en ?? ''},
        ${body.cover_url ?? null}, ${body.pdf_url ?? null},
        ${body.isbn ?? null}, ${body.year ?? null},
        ${body.is_published ?? false}, ${body.sort_order ?? 0})
      RETURNING *
    `;
    return json({ book: rows[0] }, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
}
