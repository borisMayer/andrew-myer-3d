// Password hashing using Web Crypto API — compatible with all Vercel runtimes

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashArray = new Uint8Array(bits);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2,'0')).join('');
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2,'0')).join('');
  return `pbkdf2:${saltHex}:${hashHex}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    // Handle bcrypt hashes from old system (starts with $2)
    if (stored.startsWith('$2')) {
      // Can't verify bcrypt without the lib — treat as invalid, user must reset
      return false;
    }
    const [, saltHex, storedHash] = stored.split(':');
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, 256
    );
    const hashArray = new Uint8Array(bits);
    const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2,'0')).join('');
    return hashHex === storedHash;
  } catch { return false; }
}

export { hashPassword, verifyPassword };
