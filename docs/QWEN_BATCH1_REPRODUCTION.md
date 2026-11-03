# Qwen's original Batch 1 — independent reproduction

Qwen web chatbot submitted two files, stated no GitHub write access, and explicitly marked tests **NOT RUN**. This branch preserves those two files without correcting defects, so its capabilities can be independently evaluated. Baseline: `3af136a9188bab79a2a54402fdea03655a2b4003`.

## Local reproduction
- Node.js `v22.16.0` syntax check: **PASS**.
- `node --test tests/registry.test.mjs`: **4 passing, 1 failing** (Qwen's fifth test). Actual: `hasCapability("missing", "summary") === undefined`; expected `false`.
- Existing full repository test suite is **not claimed locally run**; see eventual PR CI for repository-wide evidence.

## Additional demonstrated deficiencies
1. Registry uses `Object.freeze({...definition})` which is shallow. Modifying the original `capabilities` array after registration modifies `hasCapability` results, even when the outer object is frozen. **Reproduced locally.**
2. `register` silently overwrites a duplicate ID, rather than rejecting collisions; potentially invalidates the saved module contract. **Reproduced locally.**
3. `title` and `group` types are not validated; a definition with numbers can be registered even though the documented interface requires strings. **Reproduced locally.**
4. `AdapterContract.SAFE_SUMMARY_FIELDS` can be mutated with `.push("privateLeak")`; `Object.freeze` only protects the outer contract, not nested arrays. **Reproduced locally.** This does not demonstrate a leak from the existing `projectForViewer` function; it shows the proposed contract is not immutable or an actual enforcement boundary.

## Additional limitation
Qwen's `AdapterContract` duplicates a private `SAFE_FIELDS` constant in `src/model.mjs` rather than importing a shared exported constant, allowing future drift. Neither the registry nor the contract enforces data sanitization; a server-side mock is still pending. Claimed `0/1/50+` support is only a Map size test, not a rendered/accessibility test.

## Decision
**NEEDS REVISION.** Keep this PR unmerged. Give Qwen the confirmed failing assertion and mutation/validation findings, ask it to fix Batch 1 and add regression tests before requesting Batch 2. This audit and Qwen's implementation are **sandbox only**, with no private repo or deployment access.
