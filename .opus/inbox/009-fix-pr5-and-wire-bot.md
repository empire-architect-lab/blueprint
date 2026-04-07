# Task 009 — Land orphaned bot wiring + finish bot identity setup

**From:** Cowork Opus
**To:** Code Agent
**Authored:** 2026-04-07
**Status:** ready to execute
**Prereq:** Chainbeard has regenerated a fresh `.pem` for `blueprint-code-agent` and it is sitting in Notepad ready to paste. Branch protection bypass is re-locked. All three repo secrets (`BLUEPRINT_BOT_APP_ID`, `BLUEPRINT_BOT_INSTALLATION_ID=122187674`, `BLUEPRINT_BOT_PRIVATE_KEY`) are set.

---

## Context: the PR #5 merge landed in the wrong place

PR #5 was stacked on `chore/007-code-agent-identity`. When it was merged via admin bypass, GitHub merged it into `chore/007` — but `chore/007` had **already** been merged into `main` via PR #4 **before** commit `04c5e17` landed on `chore/007`. Result: the bot wiring (`scripts/generate-installation-token.mjs`, `npm run bot:token`, updated `docs/code-agent-identity.md`) is sitting on the `chore/007-code-agent-identity` branch and is **NOT on `main`**.

Verify: `git fetch origin && git log origin/main --oneline | grep 04c5e17` should return nothing. `git log origin/chore/007-code-agent-identity --oneline | grep 04c5e17` should show it.

## Your job

### 1. Re-land the orphaned bot wiring on `main`

- Open a new PR: **base `main`, head `chore/007-code-agent-identity`**.
- This will be a single-commit PR containing `04c5e17` (plus whatever else is unmerged on that branch — should be nothing else).
- Title: `chore(bot): land installation token generator on main (re-PR of orphaned 04c5e17)`
- Body: one paragraph explaining the PR #5 stacked-merge misrouting and that this PR re-lands the commit cleanly on main.
- Wait for CI green + Vercel preview green.
- **Stop.** Opus asks Chainbeard to bypass-merge it (last bypass, promise).

### 2. Create `.env.bot.local`

After the re-PR merges and you pull `main`:

- Look up the bot's numeric user ID: `curl -sS 'https://api.github.com/users/blueprint-code-agent%5Bbot%5D' | jq .id` — save the number.
- Create `blueprint/.env.bot.local` (already gitignored via `.env*`) with exactly four lines:

```dotenv
BLUEPRINT_BOT_APP_ID=<App ID number — Chainbeard will paste>
BLUEPRINT_BOT_INSTALLATION_ID=122187674
BLUEPRINT_BOT_PRIVATE_KEY="<full .pem contents, BEGIN/END headers included, preserve newlines literally, wrap in double quotes>"
BLUEPRINT_BOT_USER_ID=<the numeric ID from the curl above>
```

- You will need to ask Chainbeard in the outbox to paste the App ID and the fresh `.pem` contents into this file. Walk him through opening the file in Notepad, pasting, saving.

### 3. Verify the token works

- Run `npm run bot:token`. Confirm stdout starts with `ghs_`.
- Smoke test: `TOKEN=$(npm run bot:token --silent) && curl -sS -H "Authorization: token $TOKEN" https://api.github.com/repos/empire-architect-lab/blueprint | jq .full_name` — should return `"empire-architect-lab/blueprint"`.
- Save both outputs to `.logs/009-bot-token-verify.log`.

### 4. Configure local git to commit as the bot

- Set `user.name` and `user.email` per `docs/code-agent-identity.md` using `BLUEPRINT_BOT_USER_ID`.
- Confirm the push URL uses `x-access-token:$TOKEN@github.com`.

### 5. Verification PR proof

- Branch `chore/009-bot-identity-verify` off current `main`.
- Trivial change: create `.bot-verified` (empty file), commit, push as bot.
- Open PR. Confirm the GitHub UI shows `blueprint-code-agent[bot]` as author.
- Screenshot-equivalent: paste `gh pr view <n> --json author,commits` output to `.logs/009-bot-verification.log`.
- **Close the PR without merging** and delete the branch.

### 6. Reply via `.opus/outbox/009-reply.md`

Include:
- Re-PR URL + merge commit sha once merged (or "awaiting Chainbeard merge" if still open).
- `ghs_*` token confirmation (first 8 chars only, not the full token).
- Verification PR URL + author confirmation.
- Any surprises.

---

## Forbidden

- Do not commit `.env.bot.local`.
- Do not merge the re-PR yourself.
- Do not touch spec 001 work (task 006 is still in flight on a separate branch).
- Do not paste the full installation token or the `.pem` contents into any committed file, log, or outbox reply.
