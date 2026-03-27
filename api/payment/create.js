import sql from '../_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { book_id, currency, buyer_email, buyer_name, locale = 'es' } = req.body;
  if (!book_id || !currency || !buyer_email) return res.status(400).json({ error: 'Faltan campos' });

  try {
    const books = await sql`
      SELECT b.id, b.title_es, b.title_en, p.amount, p.currency
      FROM am_books b JOIN am_prices p ON p.book_id=b.id AND p.currency=${currency} AND p.is_active=true
      WHERE b.id=${book_id} AND b.is_published=true LIMIT 1
    `;
    if (!books.length) return res.status(404).json({ error: 'Libro o precio no disponible' });
    const book = books[0];

    const sales = await sql`
      INSERT INTO am_sales (book_id, buyer_email, buyer_name, amount, currency, status)
      VALUES (${book_id}, ${buyer_email}, ${buyer_name||null}, ${book.amount}, ${currency}, 'PENDING')
      RETURNING id
    `;
    const saleId = sales[0].id;
    const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';
    const title = locale === 'en' ? book.title_en : book.title_es;

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${process.env.MP_ACCESS_TOKEN}` },
      body: JSON.stringify({
        items: [{ id: book.id, title, quantity: 1, unit_price: Number(book.amount), currency_id: currency }],
        payer: { email: buyer_email, name: buyer_name },
        back_urls: { success:`${APP_URL}/pago/exito?sale=${saleId}`, failure:`${APP_URL}/pago/error`, pending:`${APP_URL}/pago/exito?sale=${saleId}` },
        auto_return: 'approved',
        external_reference: saleId,
      }),
    });
    const pref = await mpRes.json();
    if (!mpRes.ok) return res.status(500).json({ error: 'Error MP: ' + (pref.message || 'unknown') });
    await sql`UPDATE am_sales SET mp_preference_id=${pref.id} WHERE id=${saleId}`;
    return res.status(200).json({ checkout_url: pref.init_point, sale_id: saleId });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
