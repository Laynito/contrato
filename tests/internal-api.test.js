import test from 'node:test';
import assert from 'node:assert/strict';
import { requireControlPlane, summarizeContract } from '../src/internal-api.js';

function fakeResponse() {
  return { status: null, body: null };
}

function fakeSendJson(res, status, body) {
  res.status = status;
  res.body = body;
}

test('control-plane endpoint fails closed when token is not configured', () => {
  const res = fakeResponse();
  const ok = requireControlPlane({ headers: {} }, res, fakeSendJson, '');
  assert.equal(ok, false);
  assert.equal(res.status, 503);
  assert.equal(res.body.error, 'CONTROL_PLANE_NOT_CONFIGURED');
});

test('control-plane endpoint requires bearer token and explicit read scope', () => {
  const token = 'x'.repeat(48);
  const denied = fakeResponse();
  assert.equal(requireControlPlane({ headers: { authorization: `Bearer ${token}` } }, denied, fakeSendJson, token), false);
  assert.equal(denied.status, 401);

  const allowed = fakeResponse();
  assert.equal(requireControlPlane({ headers: { authorization: `Bearer ${token}`, 'x-contaneo-scope': 'control-plane.read' } }, allowed, fakeSendJson, token), true);
  assert.equal(allowed.status, null);
});

test('contract summary excludes worker and account PII', () => {
  const summary = summarizeContract({
    id: 'contract-1',
    userId: 'account-1',
    createdAt: '2026-08-27T00:00:00.000Z',
    updatedAt: '2026-08-27T01:00:00.000Z',
    finalizedAt: null,
    payload: {
      worker: { name: 'PERSONA SENSIBLE', curp: 'CURP-SENSIBLE', rfc: 'RFC-SENSIBLE', phone: '555' },
      employer: { address: 'DOMICILIO SENSIBLE' },
    },
    evaluation: { status: 'REQUIERE_REVISION', reviews: [{ code: 'LEGAL_REVIEW_REQUIRED', detail: 'detalle sensible' }] },
    snapshot: { rulesVersion: 'MX-LFT-2026.2', templateVersion: 'CONTRATO-V1.0', sha256: 'abc123', renderedText: 'texto completo sensible' },
  });

  assert.deepEqual(summary, {
    id: 'contract-1',
    accountId: 'account-1',
    status: 'review_required',
    createdAt: '2026-08-27T00:00:00.000Z',
    updatedAt: '2026-08-27T01:00:00.000Z',
    finalizedAt: null,
    rulesVersion: 'MX-LFT-2026.2',
    templateVersion: 'CONTRATO-V1.0',
    snapshotSha256: 'abc123',
    reviewReason: 'LEGAL_REVIEW_REQUIRED',
  });
  assert.equal(JSON.stringify(summary).includes('PERSONA SENSIBLE'), false);
  assert.equal(JSON.stringify(summary).includes('CURP-SENSIBLE'), false);
  assert.equal(JSON.stringify(summary).includes('DOMICILIO SENSIBLE'), false);
  assert.equal(JSON.stringify(summary).includes('texto completo sensible'), false);
});
