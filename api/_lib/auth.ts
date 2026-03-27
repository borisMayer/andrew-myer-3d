import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET ?? 'change-me-in-production');
const ALG = 'HS256';

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload;
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'No autorizado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function requireAdmin(req: Request): Promise<{ ok: true } | Response> {
  const auth = req.headers.get('authorization') ?? '';
  const cookie = req.headers.get('cookie') ?? '';
  const tokenFromCookie = cookie.split(';').find(c => c.trim().startsWith('am_admin='))?.split('=')[1];
  const token = auth.replace('Bearer ', '') || tokenFromCookie;
  if (!token) return unauthorized();
  try {
    await verifyToken(token);
    return { ok: true };
  } catch {
    return unauthorized();
  }
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function cors(res: Response, origin: string | null) {
  const allowed = ['https://andrewmyer.com','https://www.andrewmyer.com','http://localhost:5173'];
  if (origin && allowed.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return res;
}
