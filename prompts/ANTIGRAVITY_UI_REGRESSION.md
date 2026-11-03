# Paste into Google Antigravity — UI and accessibility regression review (READ-ONLY)

Source: https://github.com/breakingjames-ops/Qwen
Target branch or PR: [PASTE LINK]

Only review the public synthetic dashboard. Do not edit, commit, deploy, access real accounts, or install paid tools.

Inspect the actual running **local** demo if you have an accessible browser/runtime; otherwise read the source and clearly label visual checks **NOT VISUALLY VERIFIED**. Do not fabricate screenshots.

Check:
- At small phone (375px), tablet/desktop (1280px), widescreen (1920px): no unintended horizontal overflow, clipped text or inaccessible cards.
- Equal, mosaic, grouped, split, focus and mock presentation views: switch without losing accessible visible content, controls or focus.
- Keyboard: Tab navigation, Enter/Space for controls, focus indicators, escape/back behavior and focus restoration.
- Per-viewer preferences, mock role switching, 0/1/12/50+ modules, empty/stale/error states and deterministic layout.
- Contrast, accessible labels, reading order, reduced-motion behavior and touch target usability.
- Confirm presentation and mock persona controls are explicitly labeled **simulated / not secure**.

Run `npm run check` and `npm test` if available, and state actual results. Report defects by severity, with exact file/line or observed screenshot, reproduction steps and proposed tests. Distinguish observed visual failures from plausible risks. No code changes and no GitHub writes.
