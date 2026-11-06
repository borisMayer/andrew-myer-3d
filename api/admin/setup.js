import sql, { initTables } from '../_lib/db.js';
import { hashPassword } from '../_lib/crypto.js';
import { timingSafeEqual } from 'node:crypto';

function constantTimeMatch(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string' || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }
  if (!process.env.SETUP_KEY || process.env.SETUP_KEY.length < 24) {
    return res.status(503).json({ error: 'Configuración inicial deshabilitada. Configura SETUP_KEY de al menos 24 caracteres en Vercel.' });
  }
  const supplied = req.headers['x-setup-key'];
  if (!constantTimeMatch(supplied, process.env.SETUP_KEY)) {
    return res.status(403).json({ error: 'Clave de configuración incorrecta' });
  }
  const { email, password } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254 ||
      typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return res.status(400).json({ error: 'Introduce un email válido y una contraseña de 12 a 128 caracteres.' });
  }
  try {
    await initTables();
    const passwordHash = await hashPassword(password);
    const result = await sql`
      INSERT INTO am_admin (email, password_hash)
      SELECT ${normalizedEmail}, ${passwordHash}
      WHERE NOT EXISTS (SELECT 1 FROM am_admin)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    if (!result.length) {
      return res.status(409).json({ error: 'Ya existe un administrador. La configuración inicial está cerrada.' });
    }
    return res.status(201).json({ ok: true, message: 'Administrador inicial creado. Retira SETUP_KEY de Vercel después de comprobar el acceso.' });
  } catch (error) {
    console.error('Admin bootstrap failed:', error instanceof Error ? error.name : 'unknown');
    return res.status(500).json({ error: 'No se pudo completar la configuración inicial. Revisa la conexión a Neon.' });
  }
}
