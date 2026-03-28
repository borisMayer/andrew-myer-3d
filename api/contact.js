export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email no configurado' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Andrew Myer <contacto@andrewmyer.com>',
        to: ['contacto@andrewmyer.com'],
        reply_to: email,
        subject: `Consulta de ${name} — andrewmyer.com`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #09080d; color: #ddd; padding: 2rem; border-radius: 4px;">
            <h2 style="color: #c9a227; font-weight: 400; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(201,162,39,0.3); padding-bottom: 0.75rem;">
              Nueva consulta — andrewmyer.com
            </h2>
            <table style="width:100%; border-collapse: collapse; margin-bottom: 1.5rem;">
              <tr>
                <td style="padding: 0.5rem 0; color: rgba(180,155,90,0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 100px;">Nombre</td>
                <td style="padding: 0.5rem 0; color: #e8e2d5;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: rgba(180,155,90,0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                <td style="padding: 0.5rem 0;"><a href="mailto:${email}" style="color: #c9a227;">${email}</a></td>
              </tr>
            </table>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(180,155,90,0.6); margin-bottom: 0.75rem;">Mensaje</p>
              <p style="line-height: 1.8; color: #ddd; white-space: pre-wrap;">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
            </div>
            <p style="font-size: 11px; color: rgba(160,155,145,0.5);">
              Responder directamente a este correo enviará la respuesta a ${email}
            </p>
          </div>
        `,
        text: `Nueva consulta de ${name} (${email})\n\n${message}`,
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.message || 'Error al enviar');
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
