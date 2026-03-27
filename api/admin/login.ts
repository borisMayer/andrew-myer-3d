import { compare } from 'bcryptjs';
import sql, { initTables } from '../_lib/db.js';
import { signToken, json } from '../_lib/auth.js';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  await initTables();

  const { email, password } = await req.json();
  if (!email || !password) return json({ error: 'Faltan credenciales' }, 400);

  const rows = await sql`SELECT * FROM am_admin WHERE email = ${email} LIMIT 1`;
  if (rows.length === 0) return json({ error: 'Credenciales inválidas' }, 401);

  const admin = rows[0];
  const valid = await compare(password, admin.password_hash);
  if (!valid) return json({ error: 'Credenciales inválidas' }, 401);

  const token = await signToken({ sub: admin.id, email: admin.email, role: 'admin' });

  const res = json({ ok: true, token });
  res.headers.set('Set-Cookie', `am_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
  return res;
}
