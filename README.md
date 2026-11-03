# Modular Home Dashboard — Public Development Sandbox

A **generic, synthetic-data** experiment for a modular household/project dashboard. This is a clean-room prototype, not a copy or fork of any private application.

**Status:** experimental only. No deployed service, genuine family data, source credentials, private URLs, live integrations or production permissions. This repository contains no private project history.

## Try the prototype

1. Clone this repository.
2. Run `npm test` and `npm run check` (Node.js 22+; no npm install necessary).
3. Open `demo/index.html` in a browser. It uses ES modules, so some browsers require a local static server: `python -m http.server 8000`, then open `http://localhost:8000/demo/`.
4. Switch **simulated** designers; toggle equal/mosaic/grouped/split modes; resize/reorder/hide cards; open focus and a mock adult presentation; reset the layout.
5. All settings are local-device demo preferences. No identity verification, persistence service, or private-data security is implemented.

## Qwen's assignment

Read [QWEN.md](QWEN.md) and [the build plan](docs/BUILD_PLAN.md). Continue implementation on a separate branch in this public repo. Supply tests, screenshots and a pull request. Do not add external services, API keys, production integrations, or subscriptions.

Qwen's web chatbot does **not automatically gain GitHub write access** just because a repository is public. For autonomous commits, use Qwen Code in a development workspace with a separately verified **free** model provider. Otherwise, ask the web chatbot for a patch and have an authorized developer apply it. Do not set up any paid API or billable workflow.

## Intended eventual capabilities

- Plug-in module contracts; equal, mosaic, grouped, featured and split layouts
- User-specific responsive presets, layout editing and rollback
- Detail/focus and explicitly entered adult presentation
- Source adapters with strict server-side authorization and freshness
- Deterministic rules, Needs Attention, idempotent events and audit receipts
- Accessibility, offline/error states, tests and safe migration boundaries

This repo's existing prototype implements **only synthetic UI and pure model utilities**. Live authorization, secure synchronization and integrations are future work, not implied by an on-screen switch.

## Review path

Qwen proposes public-repo PRs → independent code/security review → [review handoff](docs/AMANDA_REVIEW.md) → authorized owners adapt selected **code only** into the separate private application. No automatic cross-repo transfer, merge, deployment or data sharing.

See [SECURITY.md](SECURITY.md) before contributing. This experiment must remain 100% free; if the only execution path becomes paid, stop rather than proceeding.
