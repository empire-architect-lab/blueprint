## Task 007 — reply

**Branch:** `chore/007-code-agent-identity`
**Commit:** `03906f1` — `chore(repo): add gitattributes eol=lf for cross-platform line endings`
**PR #4:** https://github.com/empire-architect-lab/blueprint/pull/4
**CI:** ✅ green (run 24099827707, all 9 gates)
**Vercel preview:** ✅ pass

## Decision

**Option A — GitHub App.** Rationale, comparison table, and full setup steps in `docs/code-agent-identity.md`.

Why A over B:
- App-installation commits and PRs are attributed to `blueprint-code-agent[bot]`, which GitHub treats as a distinct actor for branch protection's "PR author cannot approve own PR" rule. This is the canonical use case for GitHub Apps as bot identities (per GitHub Docs → "Authenticating as a GitHub App installation").
- Zero new email addresses, zero seat licensing cost, ~10 browser clicks vs ~20 for a machine user.
- Installation tokens auto-expire after 1 hour (no manual rotation required).
- App is owned by the org directly, not via collaborator invite.

If a future GitHub change ever stops treating App actors as distinct authors for branch protection, the doc says fall back to Option B and update.

## What landed in this PR

1. `memory/constitution.md` — Principle 3 amended with: _"PRs are authored by Code Agent (`blueprint-code-agent[bot]` or equivalent machine identity) and approved by Chainbeard. Self-approval is impossible by GitHub rule and forbidden by this constitution."_
2. `docs/code-agent-identity.md` (new, ~135 lines) — full decision rationale + comparison table + numbered manual steps for Chainbeard + token-rotation procedure + git-config commands + branch-protection current state + troubleshooting.
3. `.gitattributes` (new) — `* text=auto eol=lf`. **Required side fix:** the pre-push prettier check was failing on this Windows machine because `core.autocrlf=true` was converting LF→CRLF on disk and prettier (config `endOfLine: "lf"`) flagged 46 files. CI passes on Linux runners with no issue, but local pushes from this machine were broken. The `.gitattributes` pin fixes this for everyone on Windows/Mac/Linux uniformly. No code touched, no formatter config changed.

## What Chainbeard needs to do (manual, ~5 minutes in browser)

The numbered steps are in `docs/code-agent-identity.md`. Short version:

1. **Create the App** — https://github.com/organizations/empire-architect-lab/settings/apps → New GitHub App
   - Name: `blueprint-code-agent`
   - Webhook: **uncheck Active**
   - Permissions: Contents=Read+Write, Pull requests=Read+Write, Metadata=Read, Actions=Read, Checks=Read
   - Where: **Only on this account**
   - **Generate private key** → downloads `.pem`
   - Copy the **App ID** number
2. **Install the App** — left sidebar → Install App → Only select repositories → `blueprint`
   - Copy the **Installation ID** from the URL after install
3. **Save secrets** — https://github.com/empire-architect-lab/blueprint/settings/secrets/actions → New repository secret
   - `BLUEPRINT_BOT_APP_ID` = the App ID
   - `BLUEPRINT_BOT_INSTALLATION_ID` = the Installation ID
   - `BLUEPRINT_BOT_PRIVATE_KEY` = full contents of the `.pem` (including BEGIN/END lines)
4. **Delete the local `.pem`** from your Downloads folder.
5. **Reply** in the next inbox message confirming all three secrets are set. Code Agent then takes over.

Once secrets exist, Code Agent will:

- Add `scripts/generate-installation-token.mjs` (issues a 1-hour installation token from App ID + private key)
- Configure local git to author as the bot
- Push a trivial test commit to a throwaway branch and link the bot-authored commit
- Submit an approving review on PR #3 as the bot (PR #3 unblocks immediately)
- Same for PR #2 once task 006 is approved

## Status of PR #3

**Still blocked.** The bot identity does not exist yet — it requires the Chainbeard browser steps above. Code Agent cannot self-approve PR #3 from inside this conversation because the bot has no GitHub presence yet. Once the steps in §"What Chainbeard needs to do" are done and Chainbeard sends the next inbox message, Code Agent will dispatch the approval.

PR #3 is otherwise merge-ready: CI green, Vercel green, three real commits.

## Verification proof requested by the dispatch

Not yet possible — the App doesn't exist. Will land in the follow-up task once Chainbeard finishes the browser setup. The follow-up will include:

- The bot's profile URL (`https://github.com/apps/blueprint-code-agent`)
- A test commit URL showing `Author: blueprint-code-agent[bot]`
- The approving review URL on PR #3

## Surprises

1. **Pre-push prettier failure on Windows.** Pre-existing CRLF/LF mismatch — `core.autocrlf=true` was rewriting checked-out files to CRLF, prettier `endOfLine: "lf"` rejected them, pre-push died on `npm run lint`. CI on Linux runners never saw this. Fixed in-PR with `.gitattributes`. No formatter config or source files were changed.
2. **Pre-existing leaked credentials in git stash.** A `git stash -u` I ran during the task captured untracked `.opus/inbox/002-complete-stubs.md`, which contains two `sb_publishable_*` Supabase publishable keys. Gitleaks (correctly, by its rules) flagged them on the next pre-push scan. **These are publishable anon keys (public-by-design), not service-role secrets — not a real leak.** I dropped the stash to clear the gitleaks warning. You should still treat as a flag: that file is untracked locally and should either be deleted or moved out of the repo before it gets committed accidentally. Recommendation: gitignore `.opus/inbox/` (which is already happening implicitly since it's untracked) and review whether 002-complete-stubs.md needs archiving like the others.
3. **Constitution edit was done as a separate file from `.specify/memory/constitution.md`.** I edited `memory/constitution.md` per the dispatch wording. There's also a `.specify/memory/constitution.md` from spec-kit scaffolding — leaving that alone unless you say otherwise.

## Files touched

- `memory/constitution.md` (Principle 3 amendment, ~3 lines)
- `docs/code-agent-identity.md` (new, ~135 lines)
- `.gitattributes` (new, ~4 lines)

## Status

PR #4 open, CI green, awaiting Opus review + merge. Then awaiting Chainbeard's manual GitHub App setup. Stopping here.
