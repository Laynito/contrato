import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ContaneoCreditClient, CreditServiceError } from '../src/contaneo-credit-client.js';
import { Store } from '../src/store.js';

function response(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test('credit client fails closed when unconfigured', async () => {
  const client = new ContaneoCreditClient({ baseUrl: '', token: '' });
  await assert.rejects(() => client.consume('account', crypto.randomUUID()), (error) => {
    assert.equal(error instanceof CreditServiceError, true);
    assert.equal(error.code, 'CREDIT_SERVICE_NOT_CONFIGURED');
    return true;
  });
});

test('credit client sends stable minimal DTO and dedicated scope', async () => {
  let captured;
  const client = new ContaneoCreditClient({
    baseUrl: 'https://contaneo.internal/',
    token: 'x'.repeat(48),
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return response(200, { status: 'consumed', entry_id: 'ledger-entry', balance: 4 });
    },
  });
  const contractId = crypto.randomUUID();
  await client.consume('account-1', contractId);
  assert.equal(captured.options.headers['X-Contrato-Scope'], 'contract.finalize');
  assert.deepEqual(JSON.parse(captured.options.body), {
    action: 'consume', account_id: 'account-1', contract_id: contractId, operation_version: 1,
  });
  assert.equal(captured.options.body.includes('curp'), false);
  assert.equal(captured.options.body.includes('rfc'), false);
});

test('store finalization protocol is retry-safe and requires consumed credit', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'contrato-credit-'));
  const store = new Store(path.join(dir, 'data.json'));
  const user = store.createUser({ email: 'credit@example.com', name: 'A', passwordHash: 'x' });
  const evaluation = { status: 'COMPLETO', finalizable: true };
  const contract = store.saveContract(user.id, { worker: {}, employer: {} }, evaluation);
  const key = `contract-finalize:v1:${contract.id}`;

  store.prepareFinalization(user.id, contract.id, key);
  assert.throws(() => store.finalizeWithCredit(user.id, contract.id, { sha256: 'x' }, key), /CREDIT_NOT_CONSUMED/);
  store.markCreditConsumed(user.id, contract.id, key, 'ledger-entry-1');
  const finalized = store.finalizeWithCredit(user.id, contract.id, { sha256: 'x' }, key);
  const retry = store.finalizeWithCredit(user.id, contract.id, { sha256: 'x' }, key);
  assert.equal(finalized.finalizedAt, retry.finalizedAt);
  assert.equal(retry.finalizationOperation.state, 'finalized');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('store records an idempotent compensation state before retry', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'contrato-reversal-'));
  const store = new Store(path.join(dir, 'data.json'));
  const user = store.createUser({ email: 'reverse@example.com', name: 'A', passwordHash: 'x' });
  const contract = store.saveContract(user.id, {}, { status: 'COMPLETO', finalizable: true });
  const key = `contract-finalize:v1:${contract.id}`;
  store.prepareFinalization(user.id, contract.id, key);
  store.markCreditConsumed(user.id, contract.id, key, 'ledger-entry-1');
  const reversed = store.markCreditReversed(user.id, contract.id, key);
  assert.equal(reversed.finalizationOperation.state, 'credit_reversed');
  assert.throws(
    () => store.prepareFinalization(user.id, contract.id, key),
    /FINALIZATION_REVERSED_REVIEW_REQUIRED/,
  );
  fs.rmSync(dir, { recursive: true, force: true });
});
