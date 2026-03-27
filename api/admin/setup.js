import sql, { initTables } from '../_lib/db.js';
import { json } from '../_lib/auth.js';
import { hashPassword } from '../_lib/crypto.js';

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  const setupKey = req.headers.get('x-setup-key');
  if (!setupKey || setupKey !== process.env.SETUP_KEY) {
    return json({ error: 'Clave de setup incorrecta' }, 403);
  }
  try {
    await initTables();
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return json({ error: 'Email y contraseña requeridos' }, 400);
    const passwordHash = await hashPassword(password);
    await sql`
      INSERT INTO am_admin (email, password_hash)
      VALUES (${email}, ${passwordHash})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
    `;
    return json({ ok: true, message: 'Admin creado correctamente' });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
