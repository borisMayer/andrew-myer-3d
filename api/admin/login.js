import sql, { initTables } from '../_lib/db.js';
import { signToken, json } from '../_lib/auth.js';
import { verifyPassword } from '../_lib/crypto.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    await initTables();
    const { email, password } = await req.json();
    if (!email || !password) return json({ error: 'Faltan credenciales' }, 400);
    const rows = await sql`SELECT * FROM am_admin WHERE email = ${email} LIMIT 1`;
    if (rows.length === 0) return json({ error: 'Credenciales inválidas' }, 401);
    const valid = await verifyPassword(password, rows[0].password_hash);
    if (!valid) return json({ error: 'Credenciales inválidas' }, 401);
    const token = await signToken({ sub: rows[0].id, email: rows[0].email, role: 'admin' });
    return json({ ok: true, token });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
