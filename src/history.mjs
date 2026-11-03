// src/history.mjs
// Prospective synthetic activity history and revisioned local layout state.

export class LayoutStateManager {
  constructor({ maxHistory = 50 } = {}) {
    this._maxHistory = maxHistory;
    this._stacks = new Map(); // viewerId -> { history: [], index: -1 }
  }

  getState(viewerId) {
    const state = this._stacks.get(viewerId);
    if (!state || state.index < 0) return null;
    return state.history[state.index];
  }

  push(viewerId, layout, { concurrencyToken } = {}) {
    if (!this._stacks.has(viewerId)) {
      this._stacks.set(viewerId, { history: [], index: -1 });
    }
    const state = this._stacks.get(viewerId);

    // Truncate future history if we are branching after undo
    state.history = state.history.slice(0, state.index + 1);
    state.history.push({ layout, token: concurrencyToken, at: new Date() });

    if (state.history.length > this._maxHistory) {
      state.history.shift();
    }
    state.index = state.history.length - 1;
    return state.history[state.index];
  }

  undo(viewerId) {
    const state = this._stacks.get(viewerId);
    if (!state || state.index <= 0) return null;
    state.index--;
    return state.history[state.index];
  }

  redo(viewerId) {
    const state = this._stacks.get(viewerId);
    if (!state || state.index >= state.history.length - 1) return null;
    state.index++;
    return state.history[state.index];
  }

  reset(viewerId) {
    this._stacks.delete(viewerId);
  }
}
