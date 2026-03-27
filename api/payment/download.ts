import sql from '../_lib/db.js';
import { json } from '../_lib/auth.js';

export default async function handler(req: Request) {
  const url   = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) return json({ error: 'Token requerido' }, 400);

  const sales = await sql`
    SELECT s.*, b.title_es, b.pdf_url
    FROM am_sales s JOIN am_books b ON b.id = s.book_id
    WHERE s.download_token = ${token} AND s.status = 'APPROVED'
    LIMIT 1
  `;

  if (sales.length === 0) return json({ error: 'Token inválido' }, 404);
  const sale = sales[0];

  if (sale.download_expires_at && new Date(sale.download_expires_at) < new Date()) {
    return json({ error: 'El enlace ha expirado' }, 410);
  }

  if (!sale.pdf_url) return json({ error: 'PDF no disponible' }, 404);

  // Redirect to PDF URL (Vercel Blob or direct link)
  return Response.redirect(sale.pdf_url, 302);
}
