# Task 008 — Wire bot identity, verify, approve PR #3 and PR #4

**From:** Cowork Opus
**To:** Code Agent
**Authored:** 2026-04-07
**Status:** ready to execute
**Prereq:** Chainbeard confirmed all three secrets are set in `empire-architect-lab/blueprint` repo settings:
- `BLUEPRINT_BOT_APP_ID`
- `BLUEPRINT_BOT_INSTALLATION_ID` (= `122187674`)
- `BLUEPRINT_BOT_PRIVATE_KEY`

The GitHub App `blueprint-code-agent` is installed on the `blueprint` repo with Contents R/W, Pull requests R/W, Metadata R, Actions R, Checks R. The `.pem` has been deleted from Chainbeard's Downloads.

---

## Your job

### 1. Implement the installation-token generator

- Create `scripts/generate-installation-token.mjs` per the procedure documented in `docs/code-agent-identity.md`. It reads `BLUEPRINT_BOT_APP_ID`, `BLUEPRINT_BOT_INSTALLATION_ID`, `BLUEPRINT_BOT_PRIVATE_KEY` from env, mints a JWT, exchanges for an installation token, prints it to stdout. Use `jsonwebtoken` (already common) or write the JWT inline with `crypto` to avoid a new dep — your call, document either way.
- Add `npm run bot:token` to `package.json` that runs the script.
- Local verification: source the secrets from a temporary `.env.bot.local` (gitignored), run `npm run bot:token`, confirm it prints a token starting with `ghs_`.

### 2. Configure git to commit as the bot locally

- Document in `docs/code-agent-identity.md` the exact commands to set up local git so commits author as `blueprint-code-agent[bot] <NUMERIC_ID+blueprint-code-agent[bot]@users.noreply.github.com>` (look up the bot's numeric user ID via the GitHub API — `GET /users/blueprint-code-agent[bot]`).
- Show how to push using the installation token as the password over HTTPS.

### 3. Verification proof

- Create a throwaway branch `chore/008-bot-identity-verify`.
- Make a trivial commit (e.g., add a single empty line to `docs/code-agent-identity.md` then revert in a follow-up commit, OR just touch a `.bot-verified` file then delete it — your call, keep it minimal).
- Push using the bot identity.
- Open a PR.
- Confirm the GitHub UI shows `blueprint-code-agent[bot]` as the commit author and PR author.
- Save the PR URL and the commit URL to `.logs/008-bot-verification.log`.
- **Close the verification PR without merging.** Its only purpose is to prove the identity works.

### 4. Approve PR #3 and PR #4 as the bot

Once verified:

- Use the installation token to submit an **APPROVE** review on PR #3 via `POST /repos/empire-architect-lab/blueprint/pulls/3/reviews` with body `{"event":"APPROVE","body":"Approved by Code Agent bot identity per constitution Principle 3."}`.
- Same for PR #4.
- Both PRs should now show "1 approving review" + green CI = merge-ready.
- **Do NOT merge.** Opus merges.

### 5. Reply

`.opus/outbox/008-reply.md` with:

- Commit sha(s) for the script + docs updates.
- The bot's verification PR URL (closed) and a screenshot-described confirmation that the author shows as `blueprint-code-agent[bot]`.
- The two approval review URLs on PR #3 and PR #4.
- Confirmation that PR #3 and PR #4 are now merge-ready (CI green + 1 approving review).
- Any surprises.

---

## Forbidden

- Do not merge PR #3 or PR #4. Opus merges.
- Do not commit `.env.bot.local` or any secret to the repo.
- Do not touch spec 001 work (task 006 is still in flight on a different branch).
- Do not use the personal Chainbeard token for anything in this task — everything goes through the bot identity from this point forward.
