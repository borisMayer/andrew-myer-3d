import { SignJWT, jwtVerify } from 'jose';

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32 || secret === 'fallback-secret-change-me') {
    throw new Error('ADMIN_SECRET must be configured with at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function requireAdmin(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return json({ error: 'No autorizado' }, 401);
  try {
    await verifyToken(token);
    return { ok: true };
  } catch {
    return json({ error: 'Token inválido' }, 401);
  }
}
