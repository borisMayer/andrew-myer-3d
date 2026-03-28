import { neon } from '@neondatabase/serverless';
import { verifyToken } from '../_lib/auth.js';

function makeToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function sendEmail(to, name, title, dlUrl, apiKey) {
  if (!apiKey) return;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Andrew Myer <${fromEmail}>`,
      to: [to],
      reply_to: 'bmayer.rojel@gmail.com',
      subject: `📄 Tu libro: ${title}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#09080d;color:#ddd;padding:2rem">
        <h2 style="color:#c9a227;font-weight:400">¡Tu compra fue procesada!</h2>
        <p>${name ? `Hola ${name},` : 'Hola,'} tu pago fue confirmado.</p>
        <div style="background:rgba(180,155,90,0.08);border-left:3px solid #c9a227;padding:1rem;margin:1rem 0">
          <p style="color:#e8e2d5">${title}</p>
        </div>
        <a href="${dlUrl}" style="display:inline-block;padding:.9rem 2rem;background:rgba(180,155,90,0.2);border:1px solid rgba(180,155,90,0.5);border-radius:3px;color:#c9a227;text-decoration:none;margin:1rem 0">
          📄 Descargar PDF
        </a>
        <p style="font-size:.8rem;color:rgba(140,135,125,.6)">Enlace válido 30 días.</p>
      </div>`,
    }),
  }).catch(e => console.error('[email]', e.message));
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  // Auth
  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  const sql = neon(process.env.DATABASE_URL);

  // GET — list all sales
  if (req.method === 'GET') {
    try {
      const sales = await sql`
        SELECT s.*, b.title_es
        FROM am_sales s JOIN am_books b ON b.id = s.book_id
        ORDER BY s.created_at DESC LIMIT 100
      `;
      return res.status(200).json({ sales });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // POST — recover PENDING sales by querying MP directly
  if (req.method === 'POST') {
    const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';

    const pending = await sql`
      SELECT s.id, s.buyer_email, s.buyer_name, b.title_es
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      WHERE s.status = 'PENDING'
      ORDER BY s.created_at DESC LIMIT 20
    `;

    if (!pending.length) return res.status(200).json({ ok: true, message: 'Sin ventas PENDING', recovered: 0 });

    const results = [];
    for (const sale of pending) {
      const r = { id: sale.id, email: sale.buyer_email, book: sale.title_es };
      try {
        // Search MP by external_reference = saleId
        const mpRes = await fetch(
          `https://api.mercadopago.com/v1/payments/search?external_reference=${sale.id}&sort=date_created&criteria=desc&limit=1`,
          { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
        );
        const mpData = await mpRes.json();
        const payment = (mpData.results || [])[0];

        if (!payment) { r.status = 'NOT_FOUND_IN_MP'; results.push(r); continue; }

        r.mp_status = payment.status;
        r.mp_id = payment.id;

        if (payment.status === 'approved') {
          const token = makeToken();
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await sql`UPDATE am_sales SET status='APPROVED', mp_payment_id=${String(payment.id)}, download_token=${token}, download_expires_at=${expires.toISOString()} WHERE id=${sale.id}`;
          const dlUrl = `${APP_URL}/api/payment/download?token=${token}`;
          await sendEmail(sale.buyer_email, sale.buyer_name, sale.title_es, dlUrl, process.env.RESEND_API_KEY);
          r.status = 'RECOVERED_APPROVED';
          r.download_url = dlUrl;
        } else if (['rejected','cancelled'].includes(payment.status)) {
          await sql`UPDATE am_sales SET status='REJECTED', mp_payment_id=${String(payment.id)} WHERE id=${sale.id}`;
          r.status = 'RECOVERED_REJECTED';
        } else {
          r.status = 'STILL_PENDING';
        }
      } catch(e) { r.status = 'ERROR'; r.error = e.message; }
      results.push(r);
    }

    const recovered = results.filter(r => r.status === 'RECOVERED_APPROVED').length;
    return res.status(200).json({ ok: true, recovered, total: pending.length, results });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
