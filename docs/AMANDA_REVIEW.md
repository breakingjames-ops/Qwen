# Reviewer handoff — code only

This public sandbox is for independent experimentation. Nothing here grants access to or permission to modify an existing private application.

## On each proposed pull request
1. Verify it only changes the public sandbox; inspect the complete diff and Git history for identity/credential/source leakage.
2. Reproduce the demo with **fictional** data; run `npm run check && npm test`.
3. Evaluate portability, code quality, accessibility, mobile/TV layout, edge cases and dependency footprint.
4. Treat UI persona switches and local preferences as **mock-only**; check that no security is claimed from synthetic tests.
5. Compare desired behavior to the real system's latest private rules **outside this public repository**. Do not paste private specifications or operational notes into public issues.
6. Decide separately whether to adapt selected **code only** to a private branch, using real authorization, protected environments and independent tests.
7. Do not auto-merge, auto-deploy, create paid services, move source-of-truth data, or publish live source content.

## Review verdict format
- **Accept for adaptation / revise / reject**
- Scope and feature demonstrated
- Changed files and tests observed
- Privacy/security limitations
- Integration dependencies and risk
- Private adaptation tasks (kept in the private checkpoint, not public issues)

Any new live source, publication, authentication, billing or production change requires separate owner approval.
