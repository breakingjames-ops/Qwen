# Public sandbox product and implementation plan

## Goal
Create a reusable, original dashboard module architecture from **abstract feature requirements**, using only fictional data. The separate private application, its identity/provider configuration and its deployment pipeline are deliberately unknown to this project.

## Module contract
- Stable `id`, `kind`, `title`, group, template, allowed viewer subjects, permitted capabilities and presentation eligibility
- Versioned safe summary, next action, optional deadline, verification timestamp, expiry and explicit state (verified/stale/unknown/revoked/canceled)
- Full detail must require the same field-level authorization as summary; never derive permissions from UI layout
- Modules render summary at minimum; optional detail, focus, split and adult presentation renderer capabilities
- Outage: show unavailable, do not fabricate that no tasks exist
- No arbitrary user-authored JavaScript as rules

## Presentation modes
- Equal: same-size dashboard tiles
- Mosaic: selected cards 1×1 / 2×1 / 2×2
- Grouped: grouped by user-selected category without losing card identity
- Featured: chosen big card + rail
- Split: two independent modules in one workspace
- Focus: single detailed module with preserved return context
- TV presentation: separately initiated **mock** adult-only view; real deployment needs verified adult session, revocation and logout/cache testing

## Data model (future, mock-only here)
- `ModuleDefinition`, `SafeProjection`, `ViewerGrant`, `LayoutProfile`, `PresentationRule`, `ActionReceipt`, `PublicationReceipt`
- One original source owner per fact; projection snapshots never rewrite upstream data
- Every projection carries provenance category (not raw private pointer), last verified, expiry, tombstone/version and allowed fields
- Layout profiles are per viewer and device. Revisioned writes must detect conflicts and enable rollback
- Synthetic test actions are not proof of actual completed chores, paid expenses, calendar commitments or provider events

## Security acceptance
- Withhold unauthorized data at mock server boundary, not by hiding DOM
- No false data in HTML, bundle, logs, caches or mock API for an unauthorized subject
- Separate owner A / owner B grants; revoked, expired, missing permissions fail closed
- An audience change cannot expand access without explicit grant
- An adult mock TV view cannot be opened by child/unauthenticated sessions; any real TV path later requires proper auth and complete exit/logout behavior
- No direct source IDs, URLs, tokens or classified source details in client projections
- Test duplicated saves, retries and conflicts rather than marking them successful blindly

## Prioritized engineering batches
A. Pure module registry + schema validation + tests
B. Responsive accessible module grid + layout editor + undo
C. Focus, split, featured and explicit presentation mock
D. Deterministic rules and conflict trace
E. Mock server identity and projection filtering + security tests
F. Local demo state revision and audit trail
G. Synthetic adapter/plugin SDK with module authoring docs
H. Error/stale/offline state acceptance and accessibility verification
I. Reviewer-ready integration package with security and data-flow mapping

## Stop conditions
Any task requiring real family/child/private data, secret/provider access, a private repository, charged model/API credits, production deployment, or external source permission must stop. Implement an independent fictional alternative and record the blocker in the PR.

## Definition of done for each PR
Functional code + automated tests + reproducible local commands + public-data scan + no new paid service/deploy + declared gaps + independent review. No automatic merge.
