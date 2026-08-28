import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Store } from './store.js';
import { evaluateContract } from './rules.js';
import { RULES_VERSION, TEMPLATE_VERSION } from './legal.js';
import { clearSessionCookie, hashPassword, newSessionId, parseCookies, sessionCookie, signedSessionValue, verifyPassword, verifySignedSessionValue } from './auth.js';
import { makePdf, snapshotFor } from './pdf.js';
import { clientIp } from './network.js';
import { requireControlPlane, summarizeContract } from './internal-api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3080);
const host = process.env.HOST || '127.0.0.1';
const dataFile = process.env.DATA_FILE || path.join(root, 'var', 'data.json');
const publicOrigin = process.env.PUBLIC_ORIGIN || '';
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? '' : crypto.randomBytes(48).toString('hex'));
const controlPlaneToken = process.env.CONTANEO_INTERNAL_TOKEN || '';
if (isProduction && sessionSecret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters in production');
if (isProduction && !publicOrigin) throw new Error('PUBLIC_ORIGIN is required in production');

const store = new Store(dataFile);
const authRate = new Map();
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function securityHeaders(extra = {}) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'Cache-Control': 'no-store',
    ...extra,
  };
}

function sendJson(res, status, data, headers = {}) {
  const body = Buffer.from(JSON.stringify(data));
  res.writeHead(status, securityHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': body.length, ...headers }));
  res.end(body);
}

function sendText(res, status, text, contentType = 'text/plain; charset=utf-8', headers = {}) {
  const body = Buffer.from(text);
  res.writeHead(status, securityHeaders({ 'Content-Type': contentType, 'Content-Length': body.length, ...headers }));
  res.end(body);
}

async function readJson(req) {
  const max = 1024 * 1024;
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > max) throw Object.assign(new Error('BODY_TOO_LARGE'), { status: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('INVALID_JSON'), { status: 400 }); }
}

function rateLimit(req) {
  const key = clientIp(req);
  const now = Date.now();
  const item = authRate.get(key) || { start: now, count: 0 };
  if (now - item.start > 10 * 60 * 1000) { item.start = now; item.count = 0; }
  item.count += 1;
  authRate.set(key, item);
  return item.count <= 30;
}

function enforceOrigin(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return true;
  if (!publicOrigin) return true;
  return req.headers.origin === publicOrigin;
}

function currentAuth(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionId = verifySignedSessionValue(cookies.session, sessionSecret);
  if (!sessionId) return null;
  const session = store.getSession(sessionId);
  if (!session) return null;
  const user = store.getUser(session.userId);
  return user ? { session, user } : null;
}

function requireAuth(req, res) {
  const auth = currentAuth(req);
  if (!auth) { sendJson(res, 401, { error: 'AUTH_REQUIRED' }); return null; }
  return auth;
}

function sanitizeContractForResponse(contract) {
  if (!contract) return null;
  return {
    id: contract.id,
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
    finalizedAt: contract.finalizedAt,
    payload: contract.payload,
    evaluation: contract.evaluation,
    snapshot: contract.snapshot ? {
      generatedAt: contract.snapshot.generatedAt,
      rulesVersion: contract.snapshot.rulesVersion,
      templateVersion: contract.snapshot.templateVersion,
      sha256: contract.snapshot.sha256,
    } : null,
  };
}

const staticFiles = new Map([
  ['/', ['public/index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['public/app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['public/style.css', 'text/css; charset=utf-8']],
]);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (!enforceOrigin(req)) return sendJson(res, 403, { error: 'ORIGIN_REJECTED' });

    if (req.method === 'GET' && url.pathname === '/health') {
      return sendJson(res, 200, { ok: true, service: 'contrato-mx', rulesVersion: RULES_VERSION, templateVersion: TEMPLATE_VERSION, time: new Date().toISOString() });
    }

    if (req.method === 'GET' && url.pathname === '/internal/control-plane/contracts') {
      if (!requireControlPlane(req, res, sendJson, controlPlaneToken)) return;
      const contracts = store.listContractsForControlPlane().map(summarizeContract);
      return sendJson(res, 200, {
        service: 'contrato-mx',
        rulesVersion: RULES_VERSION,
        templateVersion: TEMPLATE_VERSION,
        contracts,
      });
    }

    if (req.method === 'GET' && url.pathname === '/internal/control-plane/summary') {
      if (!requireControlPlane(req, res, sendJson, controlPlaneToken)) return;
      const contracts = store.listContractsForControlPlane().map(summarizeContract);
      const counts = contracts.reduce((acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
        return acc;
      }, {});
      return sendJson(res, 200, {
        service: 'contrato-mx',
        rulesVersion: RULES_VERSION,
        templateVersion: TEMPLATE_VERSION,
        totalContracts: contracts.length,
        counts,
      });
    }

    if (req.method === 'GET' && staticFiles.has(url.pathname)) {
      const [relative, type] = staticFiles.get(url.pathname);
      return sendText(res, 200, fs.readFileSync(path.join(root, relative), 'utf8'), type);
    }

    if (req.method === 'GET' && url.pathname === '/aviso-privacidad') {
      return sendText(res, 200, fs.readFileSync(path.join(root, 'public', 'privacy.html'), 'utf8'), 'text/html; charset=utf-8');
    }

    if (req.method === 'POST' && url.pathname === '/api/register') {
      if (!rateLimit(req)) return sendJson(res, 429, { error: 'RATE_LIMITED' });
      const body = await readJson(req);
      const email = String(body.email || '').trim().toLowerCase();
      const name = String(body.name || '').trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || name.length < 2) return sendJson(res, 422, { error: 'INVALID_ACCOUNT_DATA' });
      try {
        const user = store.createUser({ email, name, passwordHash: hashPassword(String(body.password || '')) });
        return sendJson(res, 201, { user });
      } catch (error) {
        if (error.message === 'EMAIL_EXISTS') return sendJson(res, 409, { error: 'EMAIL_EXISTS' });
        if (error.message === 'PASSWORD_TOO_SHORT') return sendJson(res, 422, { error: 'PASSWORD_TOO_SHORT', minimum: 10 });
        throw error;
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/login') {
      if (!rateLimit(req)) return sendJson(res, 429, { error: 'RATE_LIMITED' });
      const body = await readJson(req);
      const user = store.findUserByEmail(body.email || '');
      if (!user || !verifyPassword(String(body.password || ''), user.passwordHash)) return sendJson(res, 401, { error: 'INVALID_CREDENTIALS' });
      const id = newSessionId();
      store.createSession({ id, userId: user.id, expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000).toISOString() });
      return sendJson(res, 200, { user: store.publicUser(user) }, { 'Set-Cookie': sessionCookie(signedSessionValue(id, sessionSecret), { secure: isProduction, maxAge: SESSION_SECONDS }) });
    }

    if (req.method === 'POST' && url.pathname === '/api/logout') {
      const auth = currentAuth(req);
      if (auth) store.deleteSession(auth.session.id);
      return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie({ secure: isProduction }) });
    }

    if (req.method === 'GET' && url.pathname === '/api/me') {
      const auth = requireAuth(req, res); if (!auth) return;
      return sendJson(res, 200, { user: store.publicUser(auth.user) });
    }

    if (req.method === 'GET' && url.pathname === '/api/contracts') {
      const auth = requireAuth(req, res); if (!auth) return;
      return sendJson(res, 200, { contracts: store.listContracts(auth.user.id) });
    }

    if (req.method === 'POST' && url.pathname === '/api/contracts') {
      const auth = requireAuth(req, res); if (!auth) return;
      const payload = await readJson(req);
      const evaluation = evaluateContract(payload);
      const contract = store.saveContract(auth.user.id, payload, evaluation);
      return sendJson(res, 200, { contract: sanitizeContractForResponse(contract) });
    }

    const contractMatch = url.pathname.match(/^\/api\/contracts\/([0-9a-f-]+)$/i);
    if (req.method === 'GET' && contractMatch) {
      const auth = requireAuth(req, res); if (!auth) return;
      const contract = store.getContract(auth.user.id, contractMatch[1]);
      if (!contract) return sendJson(res, 404, { error: 'CONTRACT_NOT_FOUND' });
      return sendJson(res, 200, { contract: sanitizeContractForResponse(contract) });
    }

    const finalizeMatch = url.pathname.match(/^\/api\/contracts\/([0-9a-f-]+)\/finalize$/i);
    if (req.method === 'POST' && finalizeMatch) {
      const auth = requireAuth(req, res); if (!auth) return;
      const contract = store.getContract(auth.user.id, finalizeMatch[1]);
      if (!contract) return sendJson(res, 404, { error: 'CONTRACT_NOT_FOUND' });
      const evaluation = evaluateContract(contract.payload);
      if (!evaluation.finalizable) return sendJson(res, 422, { error: 'CONTRACT_NOT_FINALIZABLE', evaluation });
      const snapshot = snapshotFor(contract.payload, evaluation);
      const finalized = store.finalizeContract(auth.user.id, contract.id, snapshot);
      return sendJson(res, 200, { contract: sanitizeContractForResponse(finalized), pdfUrl: `/api/contracts/${contract.id}/pdf` });
    }

    const pdfMatch = url.pathname.match(/^\/api\/contracts\/([0-9a-f-]+)\/pdf$/i);
    if (req.method === 'GET' && pdfMatch) {
      const auth = requireAuth(req, res); if (!auth) return;
      const contract = store.getContract(auth.user.id, pdfMatch[1]);
      if (!contract) return sendJson(res, 404, { error: 'CONTRACT_NOT_FOUND' });
      if (!contract.snapshot?.renderedText) return sendJson(res, 409, { error: 'CONTRACT_NOT_FINALIZED' });
      const pdf = makePdf(contract.snapshot.renderedText);
      res.writeHead(200, securityHeaders({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length, 'Content-Disposition': `attachment; filename="contrato-${contract.id}.pdf"` }));
      return res.end(pdf);
    }

    return sendJson(res, 404, { error: 'NOT_FOUND' });
  } catch (error) {
    const known = ['CONTRACT_FINALIZED', 'CONTRACT_NOT_FOUND'];
    if (known.includes(error.message)) return sendJson(res, error.message === 'CONTRACT_NOT_FOUND' ? 404 : 409, { error: error.message });
    const status = error.status || 500;
    if (status >= 500) console.error(JSON.stringify({ level: 'error', event: 'request_failed', method: req.method, path: url.pathname, error: error.message }));
    return sendJson(res, status, { error: status >= 500 ? 'INTERNAL_ERROR' : error.message });
  }
});

server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;

server.listen(port, host, () => {
  console.log(JSON.stringify({ level: 'info', event: 'server_started', host, port, production: isProduction, rulesVersion: RULES_VERSION, templateVersion: TEMPLATE_VERSION }));
});