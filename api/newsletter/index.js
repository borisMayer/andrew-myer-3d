import { neon } from '@neondatabase/serverless';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const sql = neon(process.env.DATABASE_URL);

  // GET — list subscribers (admin only)
  if (req.method === 'GET') {
    try {
      const auth = req.headers['authorization'] || '';
      await verifyToken(auth.replace('Bearer ', '').trim());
      const subscribers = await sql`SELECT email, created_at FROM am_newsletter ORDER BY created_at DESC`;
      return res.status(200).json({ subscribers });
    } catch {
      return res.status(401).json({ error: 'No autorizado' });
    }
  }

  // POST — subscribe
  if (req.method === 'POST') {
    const { email } = req.body || {};
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email inválido' });
    try {
      await sql`CREATE TABLE IF NOT EXISTS am_newsletter (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
      await sql`INSERT INTO am_newsletter (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`;
      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Andrew Myer <contacto@andrewmyer.com>',
            to: ['bmayer.rojel@gmail.com'],
            subject: `Nuevo suscriptor — ${email}`,
            text: `Nuevo suscriptor: ${email}`,
          }),
        }).catch(() => {});
      }
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
