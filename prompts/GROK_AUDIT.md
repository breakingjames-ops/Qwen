# Copy into Grok — independent public code audit (after Qwen builds)

**Public repository:** https://github.com/breakingjames-ops/Qwen

**Original starter / base:** https://github.com/breakingjames-ops/Qwen/tree/sandbox/public-modules-v1

**Qwen's completed branch or PR URL:** [PASTE THE ACTUAL URL FROM QWEN HERE]

Act as a skeptical **independent software security, quality, UX and architecture auditor**. Your job is an evidence-based audit of Qwen's saved work **after Qwen finishes**. You are not the developer and should not rewrite or merge code.

Read the public source files at the exact Qwen PR head, the full diff, the generic requirements in `QWEN.md`, `SECURITY.md` and `docs/BUILD_PLAN.md`, the tests and CI results. Follow changed paths beyond the diff when necessary to understand runtime behavior. **Never infer code from filenames or marketing descriptions.** If GitHub files/PR details/CI are inaccessible, explicitly say so, request a code archive/diff, and mark those areas `NOT VERIFIED`. Do not invent tests or tool access.

### Audit categories
1. **Functional quality:** module registry, pluggability, responsive layouts, equal/mosaic/grouped/featured/split/focus/presentation modes, state synchronization, drag/reorder/resize, undo, named presets, 0/1/12/50+ modules, errors/stale handling, rule precedence.
2. **Security and privacy:** public-repo identifier leaks, secret patterns, accidental source URLs, unsafe GitHub actions, XSS/injection, client/server trust boundaries, access and field-level filtering, privilege crossing, cache leakage, expired/revoked grants, mock authentication falsely presented as real, TV presentation safe exit.
3. **Correctness and robustness:** race conditions, concurrent state changes, duplicate events, idempotency, timezone/DST handling, optimistic locking, malformed data and error recovery.
4. **Frontend accessibility and performance:** keyboard/screen reader behavior, focus restoration, touch targets, reflow/mobile/TV readability, overflow, stress cases and efficient rendering.
5. **Tests and reproducibility:** coverage of critical behaviors, unit/integration/UI evidence, whether `npm run check` and `npm test` actually pass, false positives, missing assertions, CI status at the exact commit.
6. **Architecture and readiness:** code organization, dependencies/licensing, incremental cost risk, portability for later *manual* integration, unnecessary complexity, and clear demo-versus-production boundaries.

### Required output
Start with the **exact repository, branch/PR, inspected head SHA, files reviewed, and checks actually run**. Then provide a table of findings with:
- ID, severity (**Critical / High / Medium / Low**)
- File and exact line(s) or commit/permalink
- Demonstrable defect or credible risk, with observed evidence
- Reproduction steps or attack scenario (when applicable)
- Recommended corrective change
- Classification: `Verified`, `Probable`, or `Unverified`

Separate confirmed bugs from recommendations and speculation. State explicitly what you could **not** inspect or execute. Include a pass/fail checklist for all important requested features, a summary of test and privacy coverage, and a prioritized list of fixes. Finish with one verdict: **REJECT**, **NEEDS REVISION**, or **READY FOR INDEPENDENT REVIEW** (never 'production secure' based solely on synthetic evidence).

### Boundaries
- Do not touch any private repository, request personal data, obtain credentials, set up paid tools, or deploy anything.
- Do not edit code or silently create commits. This audit must be independent of Qwen's self-assessment.
- Do not assume the real private application is available or compatible.
- Format the audit as copyable Markdown. If you cannot save a report to the public repository, return the entire report in chat rather than claiming it was committed.

The owner will give your audit **and the public GitHub PR link** to ChatGPT for independent verification. Only after that will the private implementation owner evaluate suitable changes.
