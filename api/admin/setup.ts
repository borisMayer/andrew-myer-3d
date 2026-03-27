import { hash } from 'bcryptjs';
import sql, { initTables } from '../_lib/db.js';
import { json } from '../_lib/auth.js';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  const setupKey = req.headers.get('x-setup-key');
  if (setupKey !== process.env.SETUP_KEY) return json({ error: 'Forbidden' }, 403);

  await initTables();

  const { email, password } = await req.json();
  const passwordHash = await hash(password, 12);

  await sql`
    INSERT INTO am_admin (email, password_hash)
    VALUES (${email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
  `;
  return json({ ok: true });
}
