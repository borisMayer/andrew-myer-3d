import sql from '../_lib/db.js';
import { json } from '../_lib/auth.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const { book_id, currency, buyer_email, buyer_name, locale = 'es' } = await req.json();
  if (!book_id || !currency || !buyer_email) return json({ error: 'Faltan campos' }, 400);

  const books = await sql`
    SELECT b.id, b.title_es, b.title_en, p.amount, p.currency
    FROM am_books b
    JOIN am_prices p ON p.book_id=b.id AND p.currency=${currency} AND p.is_active=true
    WHERE b.id=${book_id} AND b.is_published=true LIMIT 1
  `;
  if (!books.length) return json({ error: 'Libro o precio no disponible' }, 404);
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
      back_urls: {
        success: `${APP_URL}/pago/exito?sale=${saleId}`,
        failure: `${APP_URL}/pago/error?sale=${saleId}`,
        pending: `${APP_URL}/pago/exito?sale=${saleId}`,
      },
      auto_return: 'approved',
      notification_url: `${APP_URL}/api/payment/webhook`,
      external_reference: saleId,
    }),
  });

  const pref = await mpRes.json();
  if (!mpRes.ok) return json({ error: 'Error MP: ' + (pref.message || 'unknown') }, 500);
  await sql`UPDATE am_sales SET mp_preference_id=${pref.id} WHERE id=${saleId}`;
  return json({ checkout_url: pref.init_point, sale_id: saleId });
}
