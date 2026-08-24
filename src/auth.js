import crypto from 'node:crypto';

const KEYLEN = 64;

export function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 10) throw new Error('PASSWORD_TOO_SHORT');
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPassword(password, encoded) {
  try {
    const [scheme, salt64, hash64] = String(encoded).split('$');
    if (scheme !== 'scrypt' || !salt64 || !hash64) return false;
    const expected = Buffer.from(hash64, 'base64url');
    const actual = crypto.scryptSync(password, Buffer.from(salt64, 'base64url'), expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function newSessionId() {
  return crypto.randomBytes(32).toString('base64url');
}

function signature(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function signedSessionValue(sessionId, secret) {
  return `${sessionId}.${signature(sessionId, secret)}`;
}

export function verifySignedSessionValue(value, secret) {
  if (!value || !secret) return null;
  const pos = value.lastIndexOf('.');
  if (pos < 1) return null;
  const id = value.slice(0, pos);
  const sig = value.slice(pos + 1);
  const expected = signature(id, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return id;
}

export function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const key = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function sessionCookie(value, { secure = false, maxAge = 60 * 60 * 24 * 7 } = {}) {
  return `session=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

export function clearSessionCookie({ secure = false } = {}) {
  return `session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;
}
