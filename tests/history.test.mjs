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

test("restoring a smaller history keeps the selected layout and its remaining neighbors", () => {
  for (const selected of [0, 1, 2, 3, 4]) {
    const storage = {
      data: null,
      getItem() { return this.data; },
      setItem(_key, value) { this.data = value; },
    };
    const original = new LayoutStateManager({ maxHistory: 5, storage });
    for (let step = 0; step < 5; step++) original.push("viewer", { step });
    for (let step = 4; step > selected; step--) original.undo("viewer");

    const restored = new LayoutStateManager({ maxHistory: 3, storage });
    assert.equal(restored.getState("viewer").layout.step, selected);
    const start = Math.min(2, selected);
    for (let step = selected - 1; step >= start; step--) {
      assert.equal(restored.undo("viewer").layout.step, step);
    }
    assert.equal(restored.undo("viewer"), null);
    for (let step = start + 1; step < start + 3; step++) {
      assert.equal(restored.redo("viewer").layout.step, step);
    }
    assert.equal(restored.redo("viewer"), null);
  }
});

test("a one-entry restored history retains the selection independently for each viewer", () => {
  const storage = {
    data: null,
    getItem() { return this.data; },
    setItem(_key, value) { this.data = value; },
  };
  const original = new LayoutStateManager({ storage });
  for (const viewer of ["one", "two"]) {
    original.push(viewer, { step: 0 });
    original.push(viewer, { step: 1 });
  }
  original.undo("one");
  const restored = new LayoutStateManager({ maxHistory: 1, storage });
  assert.equal(restored.getState("one").layout.step, 0);
  assert.equal(restored.getState("two").layout.step, 1);
  assert.equal(restored.undo("one"), null);
  assert.equal(restored.redo("one"), null);
  restored.push("one", { step: 9 });
  const reloaded = new LayoutStateManager({ maxHistory: 1, storage });
  assert.equal(reloaded.getState("one").layout.step, 9);
  assert.equal(reloaded.getState("two").layout.step, 1);
});
