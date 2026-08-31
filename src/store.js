import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export class Store {
  constructor(filePath) {
    this.filePath = filePath;
    fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
    this.data = this.#load();
  }

  #load() {
    if (!fs.existsSync(this.filePath)) return { users: [], sessions: [], contracts: [] };
    const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      contracts: Array.isArray(parsed.contracts) ? parsed.contracts : [],
    };
  }

  #persist() {
    const tmp = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(this.data, null, 2)}\n`, { mode: 0o600 });
    fs.renameSync(tmp, this.filePath);
  }

  createUser({ email, name, passwordHash }) {
    const normalized = email.trim().toLowerCase();
    if (this.data.users.some((u) => u.email === normalized)) throw new Error('EMAIL_EXISTS');
    const user = { id: crypto.randomUUID(), email: normalized, name: name.trim(), passwordHash, createdAt: new Date().toISOString() };
    this.data.users.push(user);
    this.#persist();
    return this.publicUser(user);
  }

  publicUser(user) {
    return user ? { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } : null;
  }

  findUserByEmail(email) {
    return this.data.users.find((u) => u.email === String(email).trim().toLowerCase()) || null;
  }

  getUser(id) {
    return this.data.users.find((u) => u.id === id) || null;
  }

  createSession({ id, userId, expiresAt }) {
    this.purgeExpiredSessions(false);
    this.data.sessions.push({ id, userId, expiresAt });
    this.#persist();
  }

  getSession(id) {
    const session = this.data.sessions.find((s) => s.id === id);
    if (!session) return null;
    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.deleteSession(id);
      return null;
    }
    return session;
  }

  deleteSession(id) {
    const before = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter((s) => s.id !== id);
    if (this.data.sessions.length !== before) this.#persist();
  }

  purgeExpiredSessions(persist = true) {
    const now = Date.now();
    const before = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter((s) => Date.parse(s.expiresAt) > now);
    if (persist && before !== this.data.sessions.length) this.#persist();
  }

  saveContract(userId, payload, evaluation) {
    const now = new Date().toISOString();
    const requestedId = payload?.id;
    let existing = requestedId ? this.data.contracts.find((c) => c.id === requestedId && c.userId === userId) : null;
    if (requestedId && !existing) throw new Error('CONTRACT_NOT_FOUND');
    if (existing?.finalizedAt) throw new Error('CONTRACT_FINALIZED');

    if (!existing) {
      existing = { id: crypto.randomUUID(), userId, createdAt: now, finalizedAt: null, snapshot: null, finalizationOperation: null };
      this.data.contracts.push(existing);
    }

    existing.updatedAt = now;
    existing.payload = structuredClone(payload);
    delete existing.payload.id;
    existing.evaluation = structuredClone(evaluation);
    this.#persist();
    return structuredClone(existing);
  }

  listContracts(userId) {
    return this.data.contracts
      .filter((c) => c.userId === userId)
      .map((c) => ({ id: c.id, createdAt: c.createdAt, updatedAt: c.updatedAt, finalizedAt: c.finalizedAt, status: c.evaluation?.status, workerName: c.payload?.worker?.name || '', relationType: c.payload?.relation?.type || '' }))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  listContractsForControlPlane() {
    return this.data.contracts
      .map((contract) => structuredClone({
        id: contract.id,
        userId: contract.userId,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
        finalizedAt: contract.finalizedAt,
        evaluation: contract.evaluation || null,
        snapshot: contract.snapshot ? {
          rulesVersion: contract.snapshot.rulesVersion || null,
          templateVersion: contract.snapshot.templateVersion || null,
          sha256: contract.snapshot.sha256 || null,
        } : null,
      }))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  getContract(userId, id) {
    const contract = this.data.contracts.find((c) => c.id === id && c.userId === userId);
    return contract ? structuredClone(contract) : null;
  }

  finalizeContract(userId, id, snapshot) {
    const contract = this.data.contracts.find((c) => c.id === id && c.userId === userId);
    if (!contract) throw new Error('CONTRACT_NOT_FOUND');
    if (contract.finalizedAt) return structuredClone(contract);
    if (contract.evaluation?.status !== 'COMPLETO') throw new Error('CONTRACT_NOT_FINALIZABLE');
    contract.finalizedAt = new Date().toISOString();
    contract.updatedAt = contract.finalizedAt;
    contract.snapshot = structuredClone(snapshot);
    this.#persist();
    return structuredClone(contract);
  }

  prepareFinalization(userId, id, idempotencyKey) {
    const contract = this.data.contracts.find((c) => c.id === id && c.userId === userId);
    if (!contract) throw new Error('CONTRACT_NOT_FOUND');
    if (contract.finalizedAt) return structuredClone(contract);
    if (contract.evaluation?.status !== 'COMPLETO') throw new Error('CONTRACT_NOT_FINALIZABLE');

    const existing = contract.finalizationOperation;
    if (existing && existing.idempotencyKey !== idempotencyKey) {
      throw new Error('FINALIZATION_OPERATION_CONFLICT');
    }

    contract.finalizationOperation = {
      idempotencyKey,
      state: existing?.state === 'credit_consumed' ? 'credit_consumed' : 'pending_credit',
      updatedAt: new Date().toISOString(),
    };
    this.#persist();
    return structuredClone(contract);
  }

  markCreditConsumed(userId, id, idempotencyKey, ledgerEntryId) {
    const contract = this.#operationContract(userId, id, idempotencyKey);
    if (contract.finalizedAt) return structuredClone(contract);
    contract.finalizationOperation = {
      idempotencyKey,
      state: 'credit_consumed',
      ledgerEntryId,
      updatedAt: new Date().toISOString(),
    };
    this.#persist();
    return structuredClone(contract);
  }

  finalizeWithCredit(userId, id, snapshot, idempotencyKey) {
    const contract = this.#operationContract(userId, id, idempotencyKey);
    if (contract.finalizedAt) return structuredClone(contract);
    if (contract.finalizationOperation?.state !== 'credit_consumed') throw new Error('CREDIT_NOT_CONSUMED');
    contract.finalizedAt = new Date().toISOString();
    contract.updatedAt = contract.finalizedAt;
    contract.snapshot = structuredClone(snapshot);
    contract.finalizationOperation.state = 'finalized';
    contract.finalizationOperation.updatedAt = contract.finalizedAt;
    this.#persist();
    return structuredClone(contract);
  }

  markCreditReversed(userId, id, idempotencyKey) {
    const contract = this.#operationContract(userId, id, idempotencyKey);
    if (contract.finalizedAt) throw new Error('CONTRACT_FINALIZED');
    contract.finalizationOperation = {
      idempotencyKey,
      state: 'credit_reversed',
      updatedAt: new Date().toISOString(),
    };
    this.#persist();
    return structuredClone(contract);
  }

  #operationContract(userId, id, idempotencyKey) {
    const contract = this.data.contracts.find((c) => c.id === id && c.userId === userId);
    if (!contract) throw new Error('CONTRACT_NOT_FOUND');
    if (contract.finalizationOperation?.idempotencyKey !== idempotencyKey) {
      throw new Error('FINALIZATION_OPERATION_CONFLICT');
    }
    return contract;
  }
}
