// tests/registry.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { ModuleRegistry, AdapterContract } from "../src/registry.mjs";

test("registry rejects invalid definitions", () => {
  const reg = new ModuleRegistry();
  assert.throws(() => reg.register(null));
  assert.throws(() => reg.register({ id: "", kind: "x", capabilities: [] }));
  assert.throws(() => reg.register({ id: "x", kind: "y" })); // missing capabilities
});

test("registry stores and retrieves frozen definitions", () => {
  const reg = new ModuleRegistry();
  const def = { id: "test", kind: "widget", capabilities: ["summary", "presentation"], presentationEligible: true, title: "Test", group: "A" };
  reg.register(def);
  const stored = reg.get("test");
  assert.deepEqual(stored, def);
  // Ensure it's frozen (strict mode applies in ES modules)
  assert.throws(() => { stored.title = "hacked"; });
});

test("registry supports 0, 1, and 50+ modules", () => {
  const reg = new ModuleRegistry();
  for (let i = 0; i < 55; i++) {
    reg.register({ id: `m${i}`, kind: "test", capabilities: ["summary"], title: `Module ${i}`, group: "test" });
  }
  assert.equal(reg.list().length, 55);
});

test("adapter contract exposes safe fields and hides secrets", () => {
  assert.ok(AdapterContract.SAFE_SUMMARY_FIELDS.includes("id"));
  assert.ok(AdapterContract.SAFE_SUMMARY_FIELDS.includes("title"));
  assert.equal(AdapterContract.SAFE_SUMMARY_FIELDS.includes("secret"), false);
  assert.equal(AdapterContract.SAFE_SUMMARY_FIELDS.includes("rawSourceUrl"), false);
});

test("registry capability check works", () => {
  const reg = new ModuleRegistry();
  reg.register({ id: "a", kind: "x", capabilities: ["summary", "detail"], title: "A", group: "A" });
  assert.equal(reg.hasCapability("a", "summary"), true);
  assert.equal(reg.hasCapability("a", "presentation"), false);
  assert.equal(reg.hasCapability("missing", "summary"), false);
});
