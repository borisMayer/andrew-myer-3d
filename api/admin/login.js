import sql, { initTables } from '../_lib/db.js';
import { signToken, json } from '../_lib/auth.js';
import { verifyPassword } from '../_lib/crypto.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // DELETE = logout
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'am_admin=; Path=/; HttpOnly; Max-Age=0');
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    await initTables();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });
    const rows = await sql`SELECT * FROM am_admin WHERE email = ${email} LIMIT 1`;
    if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await verifyPassword(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = await signToken({ sub: rows[0].id, email: rows[0].email, role: 'admin' });
    return res.status(200).json({ ok: true, token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
