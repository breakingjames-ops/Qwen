# Qwen Batch 2 review checkpoint

**Source:** Qwen web chatbot original Batch 2, received November 2, 2026 Pacific. **No Qwen GitHub write access.** Added here to a dedicated draft branch layered over original Batch 1 because `src/mock-server.mjs` imports `src/registry.mjs`. The prior base is `6abce2565de19a3eaf2cbf100f21e758aa61986d`. **No private repo integration.**

## Scope
- New pure mock server projection, revocation and version-token methods
- Rule ordering and matching engine
- Local undo/redo layout history
- Eleven supplied unit tests (5 server, 3 rules, 3 history)

## Review findings (static code review; CI results must be checked independently)
1. **High — stale access grants on re-ingest.** `ingest` adds viewer grants but never removes grants from an earlier record with the same id. A viewer removed from `allowedViewers` can still receive the updated record through `getProjection`. Needs a regression test and deny-by-default replacement.
2. **High — mutability of safe field allowlist inherited from Batch 1.** `AdapterContract.SAFE_SUMMARY_FIELDS` is mutable; `push` can make mock projection return an unauthorized property. Fix shared immutable field contract first, with explicit privacy tests.
3. **Medium — layout save does not persist the layout.** `saveLayout` returns the supplied layout but only stores a concurrency token; no subsequent read or historical retrieval is implemented. Feature description overstates saved layout.
4. **Medium — concurrency can be bypassed.** Omitted or falsy `expectedToken` skips conflict validation; `saveLayout` also lacks viewer identity/authorization enforcement. This is a mock, not secure storage.
5. **Medium — mutations leak through returned references.** The layout and history APIs retain/return object references rather than immutable deep clones; a caller can change previous state, undo/redo entries and returned history indirectly.
6. **Medium — invalid rule actions and arbitrary `when` keys are accepted.** A misspelled action or predicate can evaluate as a match. Priority sorting alone is not permission/freshness precedence; a stale card can be offered for pin/feature.
7. **Low — duplicate rule IDs have no collision policy; `maxHistory <= 0` is not validated.** Additional edge-case tests needed.
8. **Scope gap:** the standalone rule engine is not wired into the demo or mock policy pipeline; no cross-layer proof or responsive visual verification.

**Do not merge this draft until Batch 1 and Batch 2 are corrected and the complete suite passes.** This preserves Qwen's experimental submission without confusing it with accepted working application code.
