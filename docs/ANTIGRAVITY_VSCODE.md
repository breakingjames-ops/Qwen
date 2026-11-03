# Antigravity + VS Code experimental audit station

**Purpose:** Use an existing Google account's **Antigravity** allowance for safe, repeatable code review and debugging **inside this public, synthetic-only repository**. This does **not** spend GitHub Copilot or OpenAI/Codex allowance. The prompts are reusable; **none run autonomously until the user opens them in Antigravity**.

## One-time workstation setup
1. Install [Visual Studio Code](https://code.visualstudio.com/) and the official [Google Antigravity for VS Code extension](https://marketplace.visualstudio.com/items?itemName=Google.google-antigravity), published by Google.
2. Sign in to Antigravity with the Google account that has your existing eligible Antigravity entitlement. A Google AI Pro plan gives a higher quota, but verify the actual quota in the Antigravity UI.
3. In Antigravity **Settings → AI Credit Overages**, select **Never**. Do not add payment methods or buy credits. When baseline quota ends, stop and wait for it to refresh.
4. Clone **this public repository only**: `https://github.com/breakingjames-ops/Qwen`. Check out the intended public sandbox/PR branch. **Do not open or index private folders, credentials or personal projects** in the agent workspace.
5. In VS Code, open **Terminal → Run Task → Sandbox: full local audit checks**. This executes the existing `npm run check` and `npm test` scripts locally. It makes **zero model calls** and requires no paid dependencies. Node 22+.
6. Start Antigravity chat and paste the chosen prompt below, filling in an exact public PR/branch/head SHA if available. For review tasks, keep file and terminal actions read-only and approve terminal actions as needed. Disable automatic code/apply/commit permissions for read-only review.

## Three repeatable jobs
| Job | When | Prompt | AI changes permitted? |
| --- | --- | --- | --- |
| Independent code audit | Qwen/Grok produces a PR or branch | [AUDIT](../prompts/ANTIGRAVITY_AUDIT.md) | **None**, read-only |
| Debug one real finding | Audit produces a reproducible defect | [FIX_ONE_BUG](../prompts/ANTIGRAVITY_FIX_ONE_BUG.md) | Isolated new branch, tests, PR only |
| Visual/accessibility regression | Dashboard UI changes | [UI_REGRESSION](../prompts/ANTIGRAVITY_UI_REGRESSION.md) | **None**, read-only |

**Suggested sequence:** Qwen builds → Grok audits → Antigravity independently runs checks/debugs public code → ChatGPT decides which findings are genuinely supported → private implementation owner evaluates selected code separately. Antigravity can also be used *before* Grok as a quick initial smoke-test, but it is not a substitute for independent audit.

## What these tasks do not do
- VS Code tasks launch local Node checks **only**. They do not trigger any AI session, automatic nightly review, cloud deployment or GitHub writes.
- Antigravity is a separate service whose available models and rate limits depend on Google plan and capacity; installing VS Code or the extension does not create unlimited free usage.
- The starter sandbox uses fictional data, and its mock viewer switches **are not real login security**.
- Never grant the experimental AI access to a private repository, real family/professional records, browser cookies, Gmail, bank data, provider tokens, keys or production Cloudflare.
- No automatic merges, deployments, billed API calls or external scans; verify every public URL and PR head before claiming success.
- A model saying it ran a test is not proof; require actual command output or CI for the exact commit.

## Review report handoff
Keep a **single Markdown result** in the local work session or a proposed public PR comment *only after checking it contains no private information*. Include:
- Exact public repo / PR URL / inspected head SHA
- Files reviewed and commands **actually** executed
- Findings with severity, file:line, evidence and reproduction
- Confirmed vs suspected vs unverified issues
- Minimal fixes and remaining test gaps
- A clear **NOT COMMITTED / NOT DEPLOYED** status where applicable

Pass the exact public PR link and report to ChatGPT for final cross-model verification. The production owner's integration decisions happen separately and privately.
