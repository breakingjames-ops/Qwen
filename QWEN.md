# Qwen — autonomous development brief (public sandbox)

**Mission:** Build as much high-quality, testable **generic modular dashboard software** as possible in this repo, for later independent review and optional adaptation into a separate private product. You do not have access to that product.

## Rules of engagement

1. All repo contents and test data must be **fictional and unidentifiable**. Never request or reconstruct private repositories, real identities, household information, school/student records, medical/financial facts, calendars, location, URLs, webhook endpoints, keys, tokens, secrets or screenshots from the actual system.
2. No remote API, new paid service, install requiring payment, trial, credit card, recurring AI job, deploy or provisioned infrastructure. No model calls within CI. Use free/open-source tools and offline tests.
3. Never assume the simulated browser persona switch is authentication. Build and test production-intended access policy in a **server-side** mock interface before calling anything secure; separate test-only mock identity from actual security and label clearly.
4. Do not change or touch any private repository. No auto merge or deploy. Use a branch, tests, and PR for each coherent feature. Do not require a reviewer to understand raw AI chat to reproduce the work.
5. Run `npm run check && npm test`, include specific evidence and known limitations, and preserve accessibility. No claim of security or deployed functionality from synthetic tests.
6. No direct copying from private source code, specifications, datasets or design assets. The architecture here is intentionally generic.
7. Keep the experience modular, responsive and friendly to a 16:9 TV **without altering any existing real TV display**.
8. Prefer incremental code, documentation of public contracts and meaningful tests over big rewrites. No placeholder pretending to be integrated with a live data source.

## Your first prompt

> Read QWEN.md, docs/BUILD_PLAN.md, SECURITY.md, src/model.mjs and tests. Independently improve this generic synthetic-data modular dashboard. Implement the next highest-priority **self-contained** feature with robust tests, no paid dependencies, no data access and no deployment. Create a feature branch and PR with exact changes, test results and integration caveats. Repeat on subsequent issues, preserving existing features. Where repository writing is unavailable, generate an exact unified diff and instructions rather than claiming a PR exists.

## Build priorities (continue sequentially as practical)

1. **Core architecture:** typed/validated module registry, capabilities, accessible render contracts; cover 0, 1, 12 and 50+ modules.
2. **Layout editor:** add/removal, reorder, resize, pin, hide, undo/reset, device-specific presets, equal/mosaic/grouped/featured/split modes; stable responsive packing.
3. **Simulation UX:** attractive and functional focus detail, adult-only presentation prototype with clear mock warning, keyboard navigation, responsive accessible UI, error/empty/expiry states.
4. **Rule evaluator:** deterministic declarative conditional logic; explicit precedence security → freshness → owner overrides → rules → defaults, conflict trace, no arbitrary executable rules.
5. **Server abstraction:** independent local mock API with identity checked server-side *in tests*, allowlists, grants, revocation, stale/expired snapshots, optimistic concurrency and audit; do not claim this equals real authentication.
6. **State/history:** in-memory or local development store for layouts and mock action receipts; idempotent saves, revisions, rollback, conflict messages, prospective events only.
7. **Test matrix:** access separation, withheld details/metadata, 0–50+ layouts, timezone boundaries, DST, revoked grants, source conflicts, cross-device preference changes, UI keyboard/screen reader paths and error states.
8. **Integration kit:** pure generic adapter interfaces and an example **fictional** connector; output a code-only migration checklist for reviewer. No actual provider credentials or private paths.

Use issues/PRs to document results and the next task. Code quality and evidence matter more than volume. If progress requires a secret, real source, provider billing, or permissions outside this repo, stop that part and choose the next independent sandbox task.
