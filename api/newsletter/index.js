export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS am_newsletter (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert subscriber (ignore duplicates)
    await sql`
      INSERT INTO am_newsletter (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;

    // Notify admin via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Sitio Andrew Myer <onboarding@resend.dev>',
          to: ['bmayer.rojel@gmail.com'],
          subject: `Nuevo suscriptor — ${email}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;background:#09080d;color:#ddd;padding:1.5rem;border-radius:4px;">
              <h3 style="color:#c9a227;font-weight:400;margin-bottom:1rem;">Nuevo suscriptor al newsletter</h3>
              <p style="margin:0;font-size:1rem;">${email}</p>
              <p style="margin-top:1rem;font-size:12px;color:rgba(160,155,145,0.5);">andrewmyer.com — ${new Date().toLocaleDateString('es-CL')}</p>
            </div>
          `,
          text: `Nuevo suscriptor: ${email}`,
        }),
      }).catch(() => {}); // Don't fail if email notification fails
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
