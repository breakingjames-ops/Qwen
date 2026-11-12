# Qwen Batches 1–3 — reviewed integration candidate

This branch is an **independently revised candidate**, not Qwen's unchanged submission. Qwen's original Batch 1 and Batch 2 submissions remain in draft PR #3 and PR #4.

## Changes
- Validated, duplicate-safe module registry with deeply frozen capability and safe field arrays
- Mock server replaces grants on re-ingest, isolates output by permitted fields, rejects absent/stale layout tokens and stores/retrieves layout snapshots
- Deterministic mock rules with condition/action validation and safe stale behavior (hide permitted, pin/feature withheld)
- Revisioned local layout history with immutable snapshots and optional demonstration-only storage adapter
- Basic UI integration with mock server, layouts, undo/redo, optional Fullscreen API and existing responsive CSS
- Tests for regressions and expanded `npm run check`

## UI reliability follow-up

The browser candidate builds on public review head `d997e5302f3ae19b272b0e776215ca1a0c607fb3`; the original submissions and existing draft stack remain separate.

- Each simulated viewer now starts with an explicit initial history entry. Undo can recover the very first edit, including the first edit after reset. Reset still discards earlier history.
- Reloading saved history with a smaller history limit retains the selected layout and adjusts undo/redo positions to the retained window. A history limit of one still preserves each simulated viewer's own selection. Two regression cases reproduced incorrect restored layouts before this correction.
- A blocked browser-storage getter falls back to an in-memory demo and explains its limited persistence. Existing read/write failures remain nonfatal.
- Rebuilt card controls retain keyboard focus. Focus view returns to its actual opener; icon controls have descriptive accessible names.
- The mock presentation moves focus to its exit control, makes the background inert, and returns to the presentation button after explicit exit, Escape or a native fullscreen exit. This is UI behavior, not authentication.

## Pure projection freshness follow-up

The exported `projectForViewer` helper now returns no records when its comparison time is invalid and marks malformed, explicitly supplied expiry values as stale, clearing action details. Two regressions reproduced the prior behavior: malformed expiry preserved a verified action, and an invalid comparison time bypassed expiry. An additional boundary case preserves exact-expiry withholding and the existing optional-expiry contract. This matches the mock server's existing malformed-date behavior for the documented string timestamps; the browser demo already calls the mock server.

## Browser verification route

The existing CI runs `scripts/check_demo_browser.py` against a local server containing only this repository's fictional fixtures. It uses the runner's installed Chromium browser and a separate virtual environment pinned to `playwright==1.62.0`; no browser installer, model call, secret, real source or deployment is added. The public-data scan also covers the Python script.

The browser gate checks five layout modes at desktop, tablet and mobile widths; initial/reset undo, redo, reload, separate viewer history, reorder/resize, hide/restore/empty state, focus return, presentation entry/exit, and unavailable storage. It blocks page requests outside its own loopback origin and fails on page errors or horizontal overflow. Synthetic screenshots and a machine-readable result are retained by the existing CI for seven days.

To reproduce, use an existing Chromium installation and a separate Python environment with Playwright 1.62.0, then run `python scripts/check_demo_browser.py` from this repository. Set `QWEN_BROWSER_EXECUTABLE` only if Chrome/Chromium is not on PATH; `QWEN_BROWSER_ARTIFACT_DIR` optionally selects the output folder. Keep generated output outside the repository. The script requires browser launch and local-loopback permission; a blocked environment is a failed/unavailable check, not a pass.

Use the implementing PR's exact saved head and hosted result before claiming browser verification. The earlier Node-only CI receipt does not cover these browser checks.

## Known limits / not production approval
- This is an in-memory fake server, **not real authentication, secure server persistence, or protected database**.
- User-switching is a visible mock only. The DOM cannot confer real access rights.
- Browser storage is untrusted and may fail. No real family information or credentials belong here.
- Hosted Chromium assertions and screenshots do not establish acceptance on a physical TV, other browser engines or a real screen reader. A full WCAG audit and a rendered 50-plus-module stress test remain open.
- Client history and mock server state are intentionally distinct; on page reload, server token restarts while client layout history remains. Follow-up UX work should reconcile stale demo state.
- No private repository is read or modified; no paid API, deployment, merge or recurring AI task.
- Check exact-head CI results and inspect saved PR before claiming test success. Independent Grok/Antigravity review still pending.
