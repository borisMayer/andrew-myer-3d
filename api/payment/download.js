import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const token = req.query?.token;
  if (!token) return res.status(400).json({ error: 'Token requerido' });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT s.download_expires_at, b.title_es, b.pdf_url
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      WHERE s.download_token = ${token} AND s.status = 'APPROVED'
      LIMIT 1
    `;

    if (!rows.length) return res.status(404).json({ error: 'Enlace inválido o expirado' });
    const sale = rows[0];

    if (sale.download_expires_at && new Date(sale.download_expires_at) < new Date()) {
      return res.status(410).json({ error: 'El enlace de descarga ha expirado' });
    }

    if (!sale.pdf_url) return res.status(404).json({ error: 'PDF no disponible' });

    // Redirect to the PDF
    res.redirect(302, sale.pdf_url);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
