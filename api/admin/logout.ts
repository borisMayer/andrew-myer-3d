import { json } from '../_lib/auth.js';
export default async function handler() {
  const res = json({ ok: true });
  res.headers.set('Set-Cookie', 'am_admin=; Path=/; HttpOnly; Max-Age=0');
  return res;
}
