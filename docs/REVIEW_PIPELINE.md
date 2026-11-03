# Five-stage development and review pipeline

This is an **experimental free-model comparison**. It cannot read or change any existing private product. Use only this public, sanitized sandbox and fictional fixtures.

| Stage | Owner/AI | Output | Gate |
| --- | --- | --- | --- |
| 0 — Seed | Repository maintainer | Public starter, tests, instructions | No real data or copied private code |
| 1 — Build | Qwen | Tested feature branches / draft PRs, or explicit unsaved patches if no GitHub write tool | No billing, real data, deploy or merge |
| 2 — Audit | Grok | Independent detailed Markdown report against exact saved commit | Verified evidence, no private files |
| 3 — Adjudicate | ChatGPT | Re-read exact public head, reproduce what tools permit, verify and challenge Grok's findings; prioritized accept/fix/reject report | No automatic transfer to private product |
| 4 — Adopt | Private implementation owner | Selected reviewed code adapted on a **separate private branch**, with tests and authorization | Real permissions/source/cost/release rules remain entirely private |

## How to run
1. Copy the [Qwen build prompt](../prompts/QWEN_BUILD.md) into Qwen. It links to the exact starter branch. If the chatbot has no GitHub write capability, the expected output is a patch, **not** an invented commit. To actually commit, use a separately connected no-cost code development environment; do not pay for an API merely to do this experiment.
2. Wait for actual code artifacts or unsaved patches to be supplied; verify saved PR branch and SHA. Only then copy the [Grok audit prompt](../prompts/GROK_AUDIT.md), filling in the **actual Qwen PR link**. Grok should work read-only against that exact revision and report any inaccessible files.
3. Provide ChatGPT the Grok report plus the GitHub PR URL (or patch if nothing was saved). ChatGPT independently inspects and reconciles the audit; an AI audit by itself is not evidence of correctness.
4. Give the final review and selected component references to the private implementation owner. They decide what to adapt, rebuild or reject; no repository link or model response constitutes deployment approval.

## Handoff requirements
Qwen must state actual write capability, exact URLs, SHA, features, tests executed, known gaps and cost/data/access status.
Grok must state actual files/commits inspected, reproduced tests and documented findings, with unverified items identified.
ChatGPT must differentiate true defects, speculative concerns and portability; confirm current public source, check security and provide exact selected code references.
The implementation owner then evaluates the *private* system's current head, rules, existing work, user approval, real source protections and deployment requirements **without placing any private details into this public repo**.

## Public data policy
Never write private repo identifiers, school/student records, source keys, exact production endpoints, schedules, names, emails, screenshots, raw conversations or confidential workflows here. Generic product capabilities and fictional examples only. Review all GitHub issue bodies, diffs, comments and generated logs before publishing.

## No automatic execution
These prompt files do **not** start Qwen, Grok, ChatGPT or the implementation owner automatically. Qwen chat access to GitHub is read-only unless it has a verified write-capable tool. GitHub Actions in this repo run simple checks, **not** a hosted AI agent. No paid API, recurring Qwen service or background audit is authorized.

## Acceptance
The experiment succeeds if Qwen produces verifiable useful code, Grok finds independent issues, ChatGPT reconciles them, and the implementation owner receives a clear reviewed *code-only* selection. The actual private product remains unchanged until separately authorized and verified.
