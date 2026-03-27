import sql from '../_lib/db.js';
import { json } from '../_lib/auth.js';
import { createHmac } from 'crypto';

const SECRET = process.env.MP_WEBHOOK_SECRET ?? '';

function generateDownloadToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ ok: true });

  const rawBody = await req.text();
  let payload: any;
  try { payload = JSON.parse(rawBody); } catch { return json({ error: 'Invalid JSON' }, 400); }

  if (payload.type !== 'payment') return json({ received: true });

  const paymentId = payload.data?.id;
  if (!paymentId) return json({ error: 'Missing payment ID' }, 400);

  // Fetch payment from MP
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  if (!mpRes.ok) return json({ error: 'MP fetch failed' }, 500);

  const payment = await mpRes.json();
  const saleId = payment.external_reference;
  const status = payment.status === 'approved' ? 'APPROVED' : payment.status === 'rejected' ? 'REJECTED' : 'PENDING';

  if (status === 'APPROVED') {
    const token = generateDownloadToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await sql`
      UPDATE am_sales
      SET status = 'APPROVED', mp_payment_id = ${String(paymentId)},
          download_token = ${token}, download_expires_at = ${expires.toISOString()}
      WHERE id = ${saleId}
    `;
    // TODO: send email with download link
  } else {
    await sql`UPDATE am_sales SET status = ${status} WHERE id = ${saleId}`;
  }

  return json({ received: true });
}
