# Qwen Batches 1–3 — reviewed integration candidate

This branch is an **independently revised candidate**, not Qwen's unchanged submission. Qwen's original Batch 1 and Batch 2 submissions remain in draft PR #3 and PR #4.

## Changes
- Validated, duplicate-safe module registry with deeply frozen capability and safe field arrays
- Mock server replaces grants on re-ingest, isolates output by permitted fields, rejects absent/stale layout tokens and stores/retrieves layout snapshots
- Deterministic mock rules with condition/action validation and safe stale behavior (hide permitted, pin/feature withheld)
- Revisioned local layout history with immutable snapshots and optional demonstration-only storage adapter
- Basic UI integration with mock server, layouts, undo/redo, optional Fullscreen API and existing responsive CSS
- Tests for regressions and expanded `npm run check`

## Known limits / not production approval
- This is an in-memory fake server, **not real authentication, secure server persistence, or protected database**.
- User-switching is a visible mock only. The DOM cannot confer real access rights.
- Browser storage is untrusted and may fail. No real family information or credentials belong here.
- Local and visual device acceptance require actual browser testing; Node-based tests alone do not establish UI correctness or accessibility.
- Client history and mock server state are intentionally distinct; on page reload, server token restarts while client layout history remains. Follow-up UX work should reconcile stale demo state.
- No private repository is read or modified; no paid API, deployment, merge or recurring AI task.
- Check exact-head CI results and inspect saved PR before claiming test success. Independent Grok/Antigravity review still pending.
