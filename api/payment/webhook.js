import { neon } from '@neondatabase/serverless';

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const sql = neon(process.env.DATABASE_URL);
  const { type, data } = req.body || {};

  if (type !== 'payment' || !data?.id) return res.status(200).json({ received: true });

  try {
    // Fetch payment from MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    if (!mpRes.ok) return res.status(200).json({ error: 'mp fetch failed' });

    const payment = await mpRes.json();
    const saleId = payment.external_reference;
    const status = payment.status === 'approved' ? 'APPROVED'
                 : payment.status === 'rejected' ? 'REJECTED' : 'PENDING';

    if (!saleId) return res.status(200).json({ ok: true });

    if (status === 'APPROVED') {
      const token = generateToken();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await sql`
        UPDATE am_sales SET
          status = 'APPROVED',
          mp_payment_id = ${String(data.id)},
          download_token = ${token},
          download_expires_at = ${expires.toISOString()}
        WHERE id = ${saleId}
      `;

      // Get sale + book info to send email
      const rows = await sql`
        SELECT s.buyer_email, s.buyer_name, b.title_es, b.pdf_url
        FROM am_sales s JOIN am_books b ON b.id = s.book_id
        WHERE s.id = ${saleId}
      `;

      if (rows.length > 0 && process.env.RESEND_API_KEY) {
        const { buyer_email, buyer_name, title_es, pdf_url } = rows[0];
        const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';
        const downloadUrl = `${APP_URL}/api/payment/download?token=${token}`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Andrew Myer <onboarding@resend.dev>',
            to: [buyer_email],
            reply_to: 'contacto@andrewmyer.com',
            subject: `Tu compra: ${title_es}`,
            html: `
              <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;background:#09080d;color:#ddd;padding:2rem;border-radius:4px">
                <h2 style="color:#c9a227;font-weight:400;margin-bottom:0.5rem">¡Gracias por tu compra!</h2>
                <p style="color:rgba(200,195,185,0.8);margin-bottom:1.5rem;font-size:0.9rem">
                  ${buyer_name ? `Hola ${buyer_name},` : 'Hola,'} tu pago fue aprobado.
                </p>
                <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-left:3px solid #c9a227;border-radius:3px;padding:1.25rem;margin-bottom:1.5rem">
                  <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(180,155,90,0.6);margin-bottom:0.4rem">Libro adquirido</p>
                  <p style="font-size:1.1rem;color:#e8e2d5;margin:0">${title_es}</p>
                </div>
                <a href="${downloadUrl}" style="display:inline-block;padding:0.9rem 2rem;background:rgba(180,155,90,0.2);border:1px solid rgba(180,155,90,0.5);border-radius:3px;color:#c9a227;text-decoration:none;font-size:0.9rem;margin-bottom:1.5rem">
                  📄 Descargar PDF
                </a>
                <p style="font-size:0.8rem;color:rgba(140,135,125,0.6)">
                  El enlace es válido por 30 días. Si tienes problemas, responde este correo.
                </p>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:1.5rem 0">
                <p style="font-size:0.75rem;color:rgba(120,115,105,0.5)">Andrew Myer — andrewmyer.com</p>
              </div>
            `,
          }),
        }).catch(e => console.error('Email send error:', e));
      }

    } else {
      await sql`UPDATE am_sales SET status = ${status}, mp_payment_id = ${String(data.id)} WHERE id = ${saleId}`;
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('[webhook]', e.message);
    return res.status(200).json({ error: e.message }); // Always 200 to MP
  }
}
