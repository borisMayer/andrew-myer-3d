import sql, { initTables } from '../_lib/db.js';
import { hashPassword } from '../_lib/crypto.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    await initTables();
    const { email, password, masterKey } = req.body;
    
    // Simple hardcoded check - no env var dependency
    if (masterKey !== 'ANDREW_MYER_SETUP_2024') {
      return res.status(403).json({ error: 'Clave maestra incorrecta' });
    }
    
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    
    const passwordHash = await hashPassword(password);
    await sql`
      INSERT INTO am_admin (email, password_hash)
      VALUES (${email}, ${passwordHash})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
    `;
    return res.status(200).json({ ok: true, message: 'Admin creado correctamente' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
