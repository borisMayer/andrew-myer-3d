import { neon } from '@neondatabase/serverless';

async function sendEmail(to, name, title, downloadUrl, apiKey) {
  if (!apiKey) { console.log('[webhook] no RESEND key'); return; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Andrew Myer <contacto@andrewmyer.com>',
      to: [to],
      reply_to: 'contacto@andrewmyer.com',
      subject: `📄 Tu libro: ${title}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#09080d;color:#ddd;padding:2rem;border-radius:4px">
        <h2 style="color:#c9a227;font-weight:400">¡Pago aprobado!</h2>
        <p style="color:rgba(180,175,165,0.75);line-height:1.7">${name ? `Hola ${name},` : 'Hola,'} tu compra fue exitosa.</p>
        <div style="background:rgba(180,155,90,0.08);border-left:3px solid #c9a227;padding:1rem;margin:1rem 0">
          <p style="font-size:0.8rem;color:rgba(180,155,90,0.6);margin-bottom:4px;font-family:monospace;letter-spacing:0.1em">LIBRO</p>
          <p style="color:#e8e2d5;font-size:1rem;margin:0">${title}</p>
        </div>
        <a href="${downloadUrl}" style="display:inline-block;padding:0.9rem 2rem;background:rgba(180,155,90,0.2);border:1px solid rgba(180,155,90,0.5);border-radius:3px;color:#c9a227;text-decoration:none;margin:1rem 0">
          📄 Descargar PDF ahora
        </a>
        <p style="font-size:0.8rem;color:rgba(140,135,125,0.6)">Enlace válido por 30 días. Responde este correo si necesitas ayuda.</p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:1.5rem 0">
        <p style="font-size:0.75rem;color:rgba(120,115,105,0.5);font-family:monospace">andrewmyer.com</p>
      </div>`,
    }),
  });
  const d = await r.json();
  console.log('[webhook] email result:', r.status, d.id || d.error || '');
}

function makeToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-signature, x-request-id');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') return res.status(200).json({ status: 'webhook active', ts: Date.now() });
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  // Log everything MP sends
  console.log('[webhook] body:', JSON.stringify(req.body));
  console.log('[webhook] query:', JSON.stringify(req.query));

  const body = req.body || {};
  const query = req.query || {};

  // MP sends in multiple formats — handle all
  const topic = body.type || body.topic || query.topic || query.type;
  const paymentId = body.data?.id || body.id || query.id || query['data.id'];
  const action = body.action || '';

  console.log('[webhook] topic:', topic, 'paymentId:', paymentId, 'action:', action);

  // Accept payment notifications in any format
  const isPayment = topic === 'payment' || action.includes('payment') || paymentId;
  if (!isPayment) {
    console.log('[webhook] not a payment notification, skipping');
    return res.status(200).json({ received: true, skipped: true });
  }

  if (!paymentId) {
    console.log('[webhook] no payment ID found');
    return res.status(200).json({ received: true, no_id: true });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';

    // Fetch from MP API
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    console.log('[webhook] MP API status:', mpRes.status);

    if (!mpRes.ok) {
      const err = await mpRes.text();
      console.error('[webhook] MP fetch error:', err);
      return res.status(200).json({ error: 'mp_fetch_failed', status: mpRes.status });
    }

    const payment = await mpRes.json();
    console.log('[webhook] payment.status:', payment.status, 'external_ref:', payment.external_reference);

    const saleId = payment.external_reference;
    const mpStatus = payment.status;

    if (!saleId) return res.status(200).json({ ok: true, no_ref: true });

    if (mpStatus === 'approved') {
      const token = makeToken();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await sql`
        UPDATE am_sales SET
          status = 'APPROVED',
          mp_payment_id = ${String(paymentId)},
          download_token = ${token},
          download_expires_at = ${expires.toISOString()}
        WHERE id = ${saleId}
      `;

      const rows = await sql`
        SELECT s.buyer_email, s.buyer_name, b.title_es, b.pdf_url
        FROM am_sales s JOIN am_books b ON b.id = s.book_id
        WHERE s.id = ${saleId} LIMIT 1
      `;

      if (rows.length > 0) {
        const { buyer_email, buyer_name, title_es } = rows[0];
        const dlUrl = `${APP_URL}/api/payment/download?token=${token}`;
        console.log('[webhook] approved, sending email to', buyer_email);
        await sendEmail(buyer_email, buyer_name, title_es, dlUrl, process.env.RESEND_API_KEY);
      }

    } else if (['rejected','cancelled','refunded'].includes(mpStatus)) {
      await sql`UPDATE am_sales SET status='REJECTED', mp_payment_id=${String(paymentId)} WHERE id=${saleId}`;
      console.log('[webhook] sale rejected');
    } else {
      await sql`UPDATE am_sales SET mp_payment_id=${String(paymentId)} WHERE id=${saleId}`;
      console.log('[webhook] pending status:', mpStatus);
    }

    return res.status(200).json({ received: true, status: mpStatus, sale: saleId });
  } catch (e) {
    console.error('[webhook] ERROR:', e.message, e.stack?.split('\n')[1]);
    return res.status(200).json({ error: e.message });
  }
}
