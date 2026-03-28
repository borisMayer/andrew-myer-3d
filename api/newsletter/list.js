import { verifyToken } from '../_lib/auth.js';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const subscribers = await sql`SELECT email, created_at FROM am_newsletter ORDER BY created_at DESC`;
    return res.status(200).json({ subscribers });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
