# Public-repository safety contract

Public means **anyone on the internet can read and retain all branches, issues, commits, artifacts and history**. Deleting a file does not reliably undo disclosure. Treat every contribution as permanently public.

## Permitted
- Generic product concepts, original UI components and test fixtures created for this sandbox
- Fictional labels, synthetic timestamps, standalone adapter interfaces and generic security tests
- Test-only browser preference storage, with visible warnings that it is not private or secure
- Public documentation and reproducible CI with no external AI calls

## Never commit or paste
- Names, dates, emails, addresses, children or household-specific routines from a real family
- Private-repo URLs, links, issue numbers, commits, screenshots or copied source/history
- Real school/student/IEP, medical, finance, employment or communications data
- Credentials, access tokens, cookies, private endpoint names, deployment IDs, infrastructure variables, actual OAuth configuration, or GitHub private artifacts
- Raw conversations, personal feelings, mixed-topic AI notes or source documents
- User-origin screenshots that might show sensitive identifiers

## Boundaries
- The browser role toggle is **not** real authentication and should never hold actual confidential data. LocalStorage demo settings are not secure storage.
- True privacy needs enforced identity and per-field authorization **before** data is sent to a browser. A CSS-hidden card is not authorization.
- Presentation screens must be explicit adult actions with fail-closed expiry/revocation when later integrated; current prototype is a visual simulation.
- Do not add a provider integration, scheduled poller, network service, deployment, third-party analytics or paid dependency.
- No connection to any existing private app. Adoption is a separate manual review and authorized integration.

Before every PR, inspect `git diff`, commit history, logs and generated assets for leaks. Run `npm run check` and `npm test`. If a leak is suspected, stop publication and notify the owner; don't try to fix it by a simple delete commit.
