// src/mock-server.mjs
// Pure mock server policy and snapshot filtering.
// Ensures unauthorized fields never reach a simulated client.
import { AdapterContract } from "./registry.mjs";

export class MockServer {
  constructor({ now = () => new Date() } = {}) {
    this._now = now;
    this._store = new Map(); // id -> raw record
    this._grants = new Map(); // viewerId -> Set<moduleId>
    this._revocations = new Set(); // moduleId
    this._concurrencyTokens = new Map(); // id -> token
    this._history = []; // Synthetic activity history
  }

  ingest(record, concurrencyToken = "v1") {
    if (!record || !record.id) throw new Error("Invalid record");
    this._store.set(record.id, { ...record });
    this._concurrencyTokens.set(record.id, concurrencyToken);

    if (Array.isArray(record.allowedViewers)) {
      for (const viewer of record.allowedViewers) {
        if (!this._grants.has(viewer)) this._grants.set(viewer, new Set());
        this._grants.get(viewer).add(record.id);
      }
    }
    this._addHistory("ingest", record.id, { concurrencyToken });
    return this;
  }

  revoke(moduleId) {
    if (!this._store.has(moduleId)) return false;
    this._revocations.add(moduleId);
    this._addHistory("revoke", moduleId);
    return true;
  }

  getProjection(viewerId, { now } = {}) {
    const instant = Number(new Date(now || this._now()));
    const grants = this._grants.get(viewerId) || new Set();
    const projections = [];

    for (const id of grants) {
      if (this._revocations.has(id)) continue;
      const raw = this._store.get(id);
      if (!raw) continue;

      // Field-level filtering (fail closed)
      const safe = Object.fromEntries(
        AdapterContract.SAFE_SUMMARY_FIELDS.filter(f => Object.hasOwn(raw, f)).map(f => [f, raw[f]])
      );

      if (typeof safe.id !== "string" || typeof safe.title !== "string") continue;

      // Expiry check
      if (safe.validUntil && Number(new Date(safe.validUntil)) <= instant) {
        safe.summary = "Source expired; verification required.";
        safe.nextAction = "";
        safe.status = "stale";
        safe.dueAt = null;
      }

      projections.push(safe);
    }

    return projections;
  }

  saveLayout(viewerId, layout, { expectedToken } = {}) {
    const currentToken = this._concurrencyTokens.get(`layout:${viewerId}`) || "v0";
    if (expectedToken && expectedToken !== currentToken) {
      this._addHistory("conflict", viewerId, { expectedToken, currentToken });
      return { success: false, error: "CONFLICT", currentToken };
    }
    const nextToken = "v" + (parseInt(currentToken.slice(1)) + 1);
    this._concurrencyTokens.set(`layout:${viewerId}`, nextToken);
    this._addHistory("save_layout", viewerId, { token: nextToken });
    return { success: true, viewerId, layout, savedAt: this._now(), concurrencyToken: nextToken };
  }

  _addHistory(action, target, meta = {}) {
    this._history.push({ action, target, meta, at: this._now() });
  }

  getHistory() {
    return [...this._history];
  }
}
