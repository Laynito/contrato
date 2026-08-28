import crypto from 'node:crypto';

const CONTROL_PLANE_SCOPE = 'control-plane.read';

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  if (left.length === 0 || left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function requireControlPlane(req, res, sendJson, token) {
  if (!token || token.length < 32) {
    sendJson(res, 503, { error: 'CONTROL_PLANE_NOT_CONFIGURED' });
    return false;
  }

  const authorization = String(req.headers.authorization || '');
  const supplied = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const scope = String(req.headers['x-contaneo-scope'] || '');

  if (!safeEqual(supplied, token) || scope !== CONTROL_PLANE_SCOPE) {
    sendJson(res, 401, { error: 'CONTROL_PLANE_AUTH_REQUIRED' });
    return false;
  }

  return true;
}

export function summarizeContract(contract) {
  const evaluation = contract?.evaluation || {};
  const snapshot = contract?.snapshot || null;

  return {
    id: contract.id,
    accountId: contract.userId,
    status: contract.finalizedAt ? 'finalized' : normalizeStatus(evaluation.status),
    createdAt: contract.createdAt || null,
    updatedAt: contract.updatedAt || null,
    finalizedAt: contract.finalizedAt || null,
    rulesVersion: snapshot?.rulesVersion || null,
    templateVersion: snapshot?.templateVersion || null,
    snapshotSha256: snapshot?.sha256 || null,
    reviewReason: reviewReason(evaluation),
  };
}

function normalizeStatus(status) {
  if (status === 'COMPLETO') return 'draft';
  if (status === 'BLOQUEADO') return 'blocked';
  if (status === 'REQUIERE_REVISION') return 'review_required';
  return 'incomplete';
}

function reviewReason(evaluation) {
  const blockers = Array.isArray(evaluation?.blockers) ? evaluation.blockers : [];
  const reviews = Array.isArray(evaluation?.reviews) ? evaluation.reviews : [];
  const first = blockers[0] || reviews[0] || null;

  if (typeof first === 'string') return first.slice(0, 200);
  if (first && typeof first === 'object') {
    const code = first.code || first.id || first.reason || null;
    return typeof code === 'string' ? code.slice(0, 200) : null;
  }

  return null;
}
