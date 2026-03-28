import { neon } from '@neondatabase/serverless';

async function sendDownloadEmail(buyerEmail, buyerName, titleEs, downloadUrl, resendKey) {
  if (!resendKey) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Andrew Myer <onboarding@resend.dev>',
      to: [buyerEmail],
      reply_to: 'contacto@andrewmyer.com',
      subject: `📄 Tu libro: ${titleEs} — Descarga disponible`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#09080d;color:#ddd;padding:2rem;border-radius:4px">
          <div style="border-bottom:1px solid rgba(180,155,90,0.3);padding-bottom:1rem;margin-bottom:1.5rem">
            <h1 style="color:#c9a227;font-weight:400;font-size:1.4rem;margin:0">Andrew Myer</h1>
            <p style="color:rgba(160,155,145,0.6);font-size:0.8rem;margin:4px 0 0;font-family:monospace;letter-spacing:0.1em">ANDREWMYER.COM</p>
          </div>
          <h2 style="color:rgba(235,228,215,0.95);font-weight:400;font-size:1.2rem;margin-bottom:0.5rem">
            ¡Gracias por tu compra!
          </h2>
          <p style="color:rgba(180,175,165,0.75);margin-bottom:1.5rem;line-height:1.7">
            ${buyerName ? `Hola ${buyerName},` : 'Hola,'} tu pago fue aprobado. Tu libro está listo para descargar.
          </p>
          <div style="background:rgba(180,155,90,0.08);border:1px solid rgba(180,155,90,0.2);border-left:3px solid #c9a227;border-radius:3px;padding:1rem;margin-bottom:1.5rem">
            <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(180,155,90,0.6);margin-bottom:4px">Libro adquirido</p>
            <p style="font-size:1rem;color:#e8e2d5;margin:0;font-weight:500">${titleEs}</p>
          </div>
          <a href="${downloadUrl}" style="display:inline-block;padding:0.9rem 2rem;background:rgba(180,155,90,0.2);border:1px solid rgba(180,155,90,0.5);border-radius:3px;color:#c9a227;text-decoration:none;font-size:0.9rem;font-weight:500;margin-bottom:1.5rem">
            📄 Descargar PDF ahora
          </a>
          <p style="font-size:0.8rem;color:rgba(140,135,125,0.6);line-height:1.6">
            Este enlace es válido por <strong>30 días</strong>.<br>
            Si tienes algún problema, responde este correo y te ayudaremos.
          </p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:1.5rem 0">
          <p style="font-size:0.75rem;color:rgba(120,115,105,0.5);font-family:monospace">
            andrewmyer.com · Teología · Filosofía · Psicología
          </p>
        </div>
      `,
    }),
  }).catch(e => console.error('[email error]', e.message));
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export default async function handler(req, res) {
  // Always return 200 to MP immediately
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') return res.status(200).json({ status: 'webhook active' });
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  console.log('[webhook] received:', JSON.stringify(req.body));

  const { type, data, action } = req.body || {};

  // MP sends different formats
  const paymentId = data?.id || req.query?.id;
  const topic = type || req.query?.topic;

  if (topic !== 'payment' && action !== 'payment.updated' && action !== 'payment.created') {
    return res.status(200).json({ received: true, skipped: true });
  }

  if (!paymentId) return res.status(200).json({ received: true, no_id: true });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';

    // Fetch payment from MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) {
      console.error('[webhook] MP fetch failed:', mpRes.status);
      return res.status(200).json({ error: 'mp fetch failed' });
    }

    const payment = await mpRes.json();
    console.log('[webhook] payment status:', payment.status, 'ref:', payment.external_reference);

    const saleId = payment.external_reference;
    if (!saleId) return res.status(200).json({ ok: true, no_ref: true });

    const mpStatus = payment.status;

    if (mpStatus === 'approved') {
      const token = generateToken();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await sql`
        UPDATE am_sales SET
          status = 'APPROVED',
          mp_payment_id = ${String(paymentId)},
          download_token = ${token},
          download_expires_at = ${expires.toISOString()}
        WHERE id = ${saleId}
      `;

      // Get sale details for email
      const rows = await sql`
        SELECT s.buyer_email, s.buyer_name, b.title_es, b.pdf_url
        FROM am_sales s JOIN am_books b ON b.id = s.book_id
        WHERE s.id = ${saleId}
        LIMIT 1
      `;

      if (rows.length > 0) {
        const { buyer_email, buyer_name, title_es, pdf_url } = rows[0];
        const downloadUrl = `${APP_URL}/api/payment/download?token=${token}`;
        await sendDownloadEmail(buyer_email, buyer_name, title_es, downloadUrl, process.env.RESEND_API_KEY);
        console.log('[webhook] approved, email sent to', buyer_email);
      }

    } else if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
      await sql`UPDATE am_sales SET status = 'REJECTED', mp_payment_id = ${String(paymentId)} WHERE id = ${saleId}`;
      console.log('[webhook] rejected/cancelled');
    } else {
      await sql`UPDATE am_sales SET mp_payment_id = ${String(paymentId)} WHERE id = ${saleId}`;
      console.log('[webhook] status:', mpStatus);
    }

    return res.status(200).json({ received: true, status: mpStatus });
  } catch (e) {
    console.error('[webhook error]', e.message);
    return res.status(200).json({ error: e.message });
  }
}
