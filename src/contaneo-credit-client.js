const FINALIZATION_SCOPE = 'contract.finalize';

export class CreditServiceError extends Error {
  constructor(code, status = 503) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export class ContaneoCreditClient {
  constructor({ baseUrl, token, fetchImpl = globalThis.fetch }) {
    this.baseUrl = String(baseUrl || '').replace(/\/$/, '');
    this.token = String(token || '');
    this.fetchImpl = fetchImpl;
  }

  consume(accountId, contractId) {
    return this.#operate('consume', accountId, contractId);
  }

  reverse(accountId, contractId) {
    return this.#operate('reverse', accountId, contractId);
  }

  async #operate(action, accountId, contractId) {
    if (!this.baseUrl || this.token.length < 32 || typeof this.fetchImpl !== 'function') {
      throw new CreditServiceError('CREDIT_SERVICE_NOT_CONFIGURED', 503);
    }

    let response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/api/internal/contrato/finalization-credit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'X-Contrato-Scope': FINALIZATION_SCOPE,
        },
        body: JSON.stringify({
          action,
          account_id: accountId,
          contract_id: contractId,
          operation_version: 1,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new CreditServiceError('CREDIT_SERVICE_UNAVAILABLE', 503);
    }

    let body = {};
    try { body = await response.json(); } catch { /* fail closed below */ }

    if (!response.ok) {
      const code = typeof body.error === 'string' ? body.error : 'CREDIT_SERVICE_REJECTED';
      throw new CreditServiceError(code, response.status >= 400 && response.status < 500 ? response.status : 503);
    }

    if (!body.entry_id || body.status !== (action === 'consume' ? 'consumed' : 'reversed')) {
      throw new CreditServiceError('INVALID_CREDIT_SERVICE_RESPONSE', 503);
    }

    return body;
  }
}
