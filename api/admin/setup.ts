import sql, { initTables } from '../_lib/db.js';
import { json } from '../_lib/auth.js';
import { hashPassword } from '../_lib/crypto.js';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  const setupKey = req.headers.get('x-setup-key');
  if (setupKey !== process.env.SETUP_KEY) return json({ error: 'Forbidden' }, 403);

  try {
    await initTables();
    const { email, password } = await req.json();
    if (!email || !password) return json({ error: 'Email y contraseña requeridos' }, 400);
    
    const passwordHash = await hashPassword(password);
    await sql`
      INSERT INTO am_admin (email, password_hash)
      VALUES (${email}, ${passwordHash})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
    `;
    return json({ ok: true });
  } catch (e: any) {
    console.error('[setup]', e);
    return json({ error: 'Error: ' + e.message }, 500);
  }
}
