import net from 'node:net';

const LOOPBACK_ADDRESSES = new Set([
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1',
]);

export function isLoopbackAddress(address) {
  return LOOPBACK_ADDRESSES.has(String(address || '').trim());
}

export function clientIp(req) {
  const remoteAddress = String(req?.socket?.remoteAddress || '').trim();

  // nginx is configured on the same host and overwrites X-Real-IP with
  // $remote_addr. Only trust that header when the TCP peer itself is local;
  // direct clients cannot spoof the rate-limit identity through headers.
  if (isLoopbackAddress(remoteAddress)) {
    const header = req?.headers?.['x-real-ip'];
    if (typeof header === 'string') {
      const candidate = header.trim();
      if (candidate && !candidate.includes(',') && net.isIP(candidate)) {
        return candidate;
      }
    }
  }

  return remoteAddress || 'unknown';
}
