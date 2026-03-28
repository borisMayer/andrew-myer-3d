import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const saleId = req.query?.sale;
  if (!saleId) return res.status(400).json({ error: 'sale ID requerido' });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT s.status, s.download_token, s.download_expires_at, b.title_es
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      WHERE s.id = ${saleId}
      LIMIT 1
    `;
    if (!rows.length) return res.status(404).json({ error: 'Venta no encontrada' });
    const { status, download_token, download_expires_at, title_es } = rows[0];

    // Don't expose token if expired
    const expired = download_expires_at && new Date(download_expires_at) < new Date();

    return res.status(200).json({
      status,
      title_es,
      download_token: status === 'APPROVED' && !expired ? download_token : null,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
