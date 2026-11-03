import test from "node:test";
import assert from "node:assert/strict";
import { LayoutStateManager } from "../src/history.mjs";

test("state manager supports undo/redo and reset", () => {
  const mgr = new LayoutStateManager();
  mgr.push("v1", { mode: "equal" });
  mgr.push("v1", { mode: "mosaic" });
  assert.equal(mgr.undo("v1").layout.mode, "equal");
  assert.equal(mgr.redo("v1").layout.mode, "mosaic");
  mgr.reset("v1");
  assert.equal(mgr.getState("v1"), null);
});

test("state manager branches correctly on new push after undo", () => {
  const mgr = new LayoutStateManager();
  mgr.push("v1", { mode: "a" });
  mgr.push("v1", { mode: "b" });
  mgr.push("v1", { mode: "c" });
  mgr.undo("v1");
  mgr.push("v1", { mode: "d" });
  assert.equal(mgr.redo("v1"), null);
  assert.equal(mgr.getState("v1").layout.mode, "d");
});

test("state manager enforces max history size", () => {
  const mgr = new LayoutStateManager({ maxHistory: 3 });
  for (let i = 0; i < 5; i++) mgr.push("v1", { step: i });
  assert.equal(mgr.getState("v1").layout.step, 4);
  mgr.undo("v1"); // 3
  mgr.undo("v1"); // 2
  assert.equal(mgr.undo("v1"), null); // Cannot go to 1
});
