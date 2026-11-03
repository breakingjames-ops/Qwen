import test from "node:test";
import assert from "node:assert/strict";
import { RulesEngine } from "../src/rules.mjs";

test("rules engine evaluates deterministically with precedence", () => {
  const engine = new RulesEngine();
  engine.addRule({ id: "r1", moduleId: "a", action: "pin", priority: 1 });
  engine.addRule({ id: "r2", moduleId: "b", action: "hide", priority: 10 });
  engine.addRule({ id: "r3", moduleId: "a", action: "feature", priority: 1 });

  const cards = [{ id: "a", status: "verified" }, { id: "b", status: "stale" }];
  const res = engine.evaluate(cards);
  assert.equal(res.actions.length, 3);
  assert.equal(res.actions[0].id, "r2"); // highest priority
  assert.equal(res.actions[1].id, "r1"); // same priority, alphabetical ID
  assert.equal(res.actions[2].id, "r3");
});

test("rules engine respects conditional matching", () => {
  const engine = new RulesEngine();
  engine.addRule({ id: "r-weekend", moduleId: "a", action: "pin", when: { weekday: "Saturday" } });
  engine.addRule({ id: "r-stale", moduleId: "b", action: "hide", when: { status: "stale" } });

  const cards = [{ id: "a", status: "verified" }, { id: "b", status: "stale" }];

  const res1 = engine.evaluate(cards, { weekday: "Monday" });
  assert.equal(res1.actions.length, 1);
  assert.equal(res1.actions[0].id, "r-stale");

  const res2 = engine.evaluate(cards, { weekday: "Saturday" });
  assert.equal(res2.actions.length, 2);
});

test("rules engine handles missing modules gracefully", () => {
  const engine = new RulesEngine();
  engine.addRule({ id: "r1", moduleId: "missing", action: "pin" });
  const res = engine.evaluate([{ id: "a" }]);
  assert.equal(res.actions.length, 0);
  assert.equal(res.trace.length, 1);
  assert.equal(res.trace[0].matches, false);
});
