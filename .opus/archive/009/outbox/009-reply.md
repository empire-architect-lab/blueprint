## Task 009 — reply (complete)

### Step 1 — Re-PR
- **PR #6:** https://github.com/empire-architect-lab/blueprint/pull/6 — merged as `17eeff6` after rebase resolved the `docs/code-agent-identity.md` conflict (rebased `chore/007-code-agent-identity` onto `main` via `git rebase --onto origin/main 03906f1` → single bot-wiring commit replayed cleanly, no conflict, force-pushed with `--force-with-lease`).
- `main` now contains `scripts/generate-installation-token.mjs`, `npm run bot:token`, and the rewritten Token generation / Git config sections of the doc.

### Branch protection re-verification
```
required_reviews: 1
required_status_checks: ['ci']
enforce_admins: false
```
Unchanged from the documented state — admins can still bypass on explicit override (which is how PR #6 landed). Not flipping `enforce_admins` to true without your call — that's a behavioral change worth a separate dispatch.

### Step 2 — `.env.bot.local`
Created at repo root (gitignored via `.env*`), 29 lines, contains:
- `BLUEPRINT_BOT_APP_ID` ✅
- `BLUEPRINT_BOT_INSTALLATION_ID=122187674` ✅
- `BLUEPRINT_BOT_PRIVATE_KEY="..."` ✅ (multi-line PEM, double-quoted)
- `BLUEPRINT_BOT_USER_ID=274315264` ✅ (resolved via `GET /users/blueprint-code-agent[bot]`)

### Step 3 — Token + smoke test
- `npm run bot:token` → token prefix `ghs_tnFQ` (first 8 chars only, rest redacted)
- `curl -H "Authorization: token $TOKEN" https://api.github.com/repos/empire-architect-lab/blueprint | jq .full_name` → `"empire-architect-lab/blueprint"`
- Log: `.logs/009-bot-token-verify.log`

### Step 4 — Local git configured as bot
```
user.name  = blueprint-code-agent[bot]
user.email = 274315264+blueprint-code-agent[bot]@users.noreply.github.com
```
Push URL pattern: `https://x-access-token:${TOKEN}@github.com/empire-architect-lab/blueprint.git`
After verification I unset the local user.name/user.email so the repo falls back to the global Chainbeard identity by default. Bot identity will be re-applied per task when acting as the bot.

### Step 5 — Verification PR
- **PR #7:** https://github.com/empire-architect-lab/blueprint/pull/7 (closed, branch deleted)
- Commit: `4b76eb7b5684c8a51257194dca37e1c1f056023d` — `chore(bot): add .bot-verified marker for identity verification`
- `gh pr view 7 --json author,commits` proof in `.logs/009-bot-verification.log`:
  - PR author: `app/blueprint-code-agent` (`is_bot: true`)
  - Commit author: `blueprint-code-agent[bot]` <`274315264+blueprint-code-agent[bot]@users.noreply.github.com`>
  - Commit author ID: `BOT_kgDOEFm4AA`
- PR closed without merging, branch `chore/009-bot-identity-verify` deleted on remote.

### Surprises
1. **`.env.bot.local` round-tripped empty the first time** — Notepad save apparently dropped the buffer. Caught it because the file existed but was 0 bytes; you re-saved with content and it took. Worth noting in the doc as a Notepad gotcha — recommend VS Code instead next time.
2. **Re-rebase needed before PR #6 could merge** — the original head of `chore/007-code-agent-identity` had three commits (`03906f1`, `ab1deb3`, `f07f0d3`), the first two of which were already on `main` via PR #4's squash-merge. GitHub saw a conflict on `docs/code-agent-identity.md` because the squash had different content than the originals. Rebased with `git rebase --onto origin/main 03906f1 chore/007-code-agent-identity` to replay only `f07f0d3`, then force-pushed. Clean from there.
3. **CI didn't auto-trigger on PR #6 initially** — GitHub appears to dedupe `pull_request` workflow runs by head SHA. After the rebase the head SHA changed (`a9d5188`), CI fired normally.
4. **Forbidden-by-default `git config` edits** — I had to set `user.name`/`user.email` locally for the bot push. Per global rules I never persistently rewrite git config; I unset both after the verification PR closed so the working directory falls back to the global Chainbeard identity. Future "act as bot" operations should re-set per-task or use a wrapper script.

### Status
All six steps done. Bot identity is fully wired and provably working. PR #3 (foundation T012 cleanup) and any future PR can now be approved by the bot via `GH_TOKEN=$(npm run -s bot:token) gh pr review --approve <n>` — but task 009 didn't ask for those approvals, so I'm stopping here. Awaiting task 010 (or your direct ask) for the PR #3 approval and the spec 001 PR #2 follow-through.
