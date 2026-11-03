import test from "node:test";
import assert from "node:assert/strict";
import { MockServer } from "../src/mock-server.mjs";

const now = new Date("2026-11-02T12:00:00Z");

test("server filters unauthorized fields at projection boundary", () => {
  const server = new MockServer({ now: () => now });
  server.ingest({ id: "x", title: "Safe", allowedViewers: ["v1"], secret: "bad", rawUrl: "private" });
  const proj = server.getProjection("v1");
  assert.equal(proj.length, 1);
  assert.equal(JSON.stringify(proj[0]).includes("secret"), false);
});

test("server revocation hides records completely", () => {
  const server = new MockServer({ now: () => now });
  server.ingest({ id: "y", title: "Revoked", allowedViewers: ["v1"] });
  server.revoke("y");
  assert.equal(server.getProjection("v1").length, 0);
});

test("server expiry marks record stale and clears actions", () => {
  const server = new MockServer({ now: () => now });
  server.ingest({ id: "z", title: "Expired", allowedViewers: ["v1"], validUntil: "2020-01-01", nextAction: "Do this", dueAt: "2020-01-01" });
  const proj = server.getProjection("v1");
  assert.equal(proj[0].status, "stale");
  assert.equal(proj[0].nextAction, "");
  assert.equal(proj[0].dueAt, null);
});

test("server layout save detects optimistic concurrency conflicts", () => {
  const server = new MockServer({ now: () => now });
  const res1 = server.saveLayout("v1", { mode: "equal" }, { expectedToken: "v0" });
  assert.equal(res1.success, true);
  const res2 = server.saveLayout("v1", { mode: "mosaic" }, { expectedToken: "v0" });
  assert.equal(res2.success, false);
  assert.equal(res2.error, "CONFLICT");
});

test("server maintains synthetic activity history", () => {
  const server = new MockServer({ now: () => now });
  server.ingest({ id: "a", title: "A", allowedViewers: ["v1"] });
  server.revoke("a");
  server.saveLayout("v1", { mode: "equal" }, { expectedToken: "v0" });
  const history = server.getHistory();
  assert.equal(history.length, 3);
  assert.equal(history[0].action, "ingest");
  assert.equal(history[1].action, "revoke");
  assert.equal(history[2].action, "save_layout");
});
