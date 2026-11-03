# Copy into Qwen — build the entire public sandbox

**Public project (synthetic data only):**
https://github.com/breakingjames-ops/Qwen/tree/sandbox/public-modules-v1

**Starter pull request:**
https://github.com/breakingjames-ops/Qwen/pull/1

You are the **development agent**, not the auditor. Your job is to turn this public modular dashboard sandbox into the most complete, polished, flexible, maintainable working implementation possible, using only free tools and fictional data.

### Read before writing
Open the exact **sandbox/public-modules-v1** branch, not just the repository's default branch. Read `QWEN.md`, `SECURITY.md`, `docs/BUILD_PLAN.md`, `docs/REVIEW_PIPELINE.md`, `src/model.mjs`, `src/fixtures.mjs`, `demo/`, and `tests/`. Inspect the code before selecting improvements. If you cannot actually open the repository or read a file, say what is unavailable; do not invent its contents.

### What to build
Implement as much of the generic module platform as feasible **now**, in coherent batches:
1. A verified module registry and documented adapter/plugin interfaces, with a safe summary/detail contract.
2. Highly responsive accessible dashboard with equal-size cards, a freely resizable mosaic, grouped view, featured module with sidebar, two-module split view, and single-module focus.
3. Editing: reorder, resize, pin/hide, save named presets, switch layouts and device sizes, undo/reset, keyboard and touch support. Keep visible content accessible.
4. A deliberate full-window 16:9 **mock presentation** mode and fail-safe mock exit. Label it unambiguously as non-secure; do not imply a persona switch authenticates anyone.
5. Deterministic declarative rules for visibility/priority, with traceable precedence (permission → freshness → owner overrides → rules → defaults), time-zone and conflict handling.
6. Pure mock server policy and snapshot filtering so unauthorized fields never reach a simulated client; revocation, expiry, error states and optimistic-concurrency tests. This is not a live authentication system.
7. Prospective synthetic activity history, revisioned local layout state, idempotency, conflict messages, tests and example adapters. Distinguish simulated data from verified real-world activity.
8. Polish and accessibility: phone, desktop, large TV layouts, contrast, keyboard focus, large readable text, screen-reader labels, empty/stale/error states, graceful 0/1/12/50+ module handling.
9. Reproducible docs, diagrams when useful, local preview instructions, migration-neutral interfaces, and clear reviewer handoff.

Prefer quality and tested completeness over enormous unreviewable code dumps. Build the next coherent feature immediately, then continue through the backlog while you have execution access. Avoid unnecessary re-architecting or outside dependencies.

### Non-negotiable boundaries
- **$0 incremental spend.** No paid Qwen/OpenRouter/model API, subscriptions, trials, provider usage, credit card, new services, deployment or scheduled background jobs. If a required option costs money, skip it.
- This is a **public** repository. Include **no real personal identifiers**, children, calendars, location, student/school/IEP records, medical/finance data, secrets, URLs or snippets from private projects. Never seek access to any private repository or real source.
- Do not fork, copy or publish the private app's code, documents or history. Use only the generic public starter and original code you write.
- Do not auto-merge or deploy. Keep changes in feature branches/PRs for later independent review.
- Do not disguise client-only filtering or mock viewer toggles as security. A true secured production app is explicitly outside scope.
- CI must remain offline/free, without model API calls, write tokens or secrets.
- Do not claim a test passed unless actually executed. Verify the actual saved GitHub URL before claiming a commit/PR exists.

### GitHub write capability test and deliverables
First determine whether **this Qwen session actually has GitHub write permissions**. Being able to read a public GitHub URL is not equivalent to having access to write commits. If you have a working development environment and GitHub authorization, branch from `sandbox/public-modules-v1`, implement and test changes, and open **one PR per logical feature** with its exact source branch, commit SHA, test commands/results and limitations. Repeat for the next batch, without merging.

If this is the Qwen **web chatbot with no write access**, do not pretend to change GitHub. Instead, produce a precise code patch (file-by-file or unified diff) against the specific starter commit, plus tests and commands that a human or connected coding tool can apply. Give the smallest self-contained batch first, then further batches as allowed.

### Finish report
Return:
- Branch/commit/PR URLs **only if actually saved**; otherwise state `NOT COMMITTED`.
- Features truly working, changes and file paths.
- Tests run with exact pass/fail results (or `NOT RUN`).
- Known defects and security caveats.
- Remaining build backlog, prioritized.
- Explicit confirmation whether there was **any spend, private repo access, external data or deployment** (must be none).

Once your code is ready, **stop before merge**. A separate Grok audit and independent ChatGPT review will follow. The private product's implementation owner will decide whether any reviewed code is adapted.
