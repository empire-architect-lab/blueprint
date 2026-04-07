## Task 008 — reply (partial, blocked)

**Branch:** `chore/008-bot-wiring` (stacked on `chore/007-code-agent-identity`)
**Commit:** `04c5e17` — `chore(bot): add installation token generator and update identity docs`
**PR #5:** https://github.com/empire-architect-lab/blueprint/pull/5 (base: `chore/007-code-agent-identity`)

## Status: BLOCKED — local secrets not available

Steps 1 and 2 of the dispatch are done. Steps 3 (verification PR as bot) and 4 (approvals on PR #3 and PR #4) **cannot be executed** from this session because the bot's App secrets live only in GitHub repo secrets, not on the local Windows machine, and there is no `.env.bot.local` at the repo root.

GitHub repo secrets (`BLUEPRINT_BOT_APP_ID`, `BLUEPRINT_BOT_INSTALLATION_ID`, `BLUEPRINT_BOT_PRIVATE_KEY`) are only readable by GitHub Actions workflows. They are **not** accessible to local scripts. The dispatch assumed a `.env.bot.local` would be present locally; it isn't.

## What Chainbeard needs to do before the next task

Create `.env.bot.local` at the repo root (`blueprint/.env.bot.local` — already gitignored via `.env*`). Populate with exactly these four values:

```dotenv
BLUEPRINT_BOT_APP_ID=<the App ID number from step 1.8 of the original setup>
BLUEPRINT_BOT_INSTALLATION_ID=122187674
BLUEPRINT_BOT_PRIVATE_KEY="<paste full .pem contents here, including BEGIN/END header and footer, wrap in double quotes, preserve newlines literally>"
BLUEPRINT_BOT_USER_ID=<look up via: curl -sS 'https://api.github.com/users/blueprint-code-agent%5Bbot%5D' | jq .id — a 7-to-9-digit number>
```

The `.pem` was downloaded during task 007 step 1.7 and **Chainbeard was instructed to delete it after saving to repo secrets**. Two options:

1. **Re-generate a new private key** from the App settings page (https://github.com/organizations/empire-architect-lab/settings/apps → `blueprint-code-agent` → Private keys → Generate a private key). A new `.pem` downloads. Paste into `.env.bot.local`, then **also update the `BLUEPRINT_BOT_PRIVATE_KEY` repo secret** to match. You can then delete the old key from the App settings page. This is the cleanest option.
2. **Recover the key from the repo secret.** Not possible — GitHub never exposes secret values after they're set. Option 1 it is.

Don't worry about the `.pem` hitting disk — `.env.bot.local` is gitignored and the hook chain (prettier/gitleaks) will never touch it.

## Once `.env.bot.local` exists, send the next inbox message. Code Agent will then:

1. Run `npm run bot:token` — confirm it prints `ghs_*`
2. Smoke test: `curl -H "Authorization: token $BOT_TOKEN" https://api.github.com/repos/empire-architect-lab/blueprint` returns the repo JSON
3. Configure local git to author as `blueprint-code-agent[bot]` using `BLUEPRINT_BOT_USER_ID`
4. Create `chore/008-bot-identity-verify`, make a trivial commit (e.g. touch-and-delete a `.bot-verified` file), push as the bot, open the verification PR
5. Save the verification PR URL + commit URL to `.logs/008-bot-verification.log`
6. Close the verification PR without merging
7. Submit `APPROVE` reviews on PR #3 and PR #4 via `gh pr review --approve` (or `POST /repos/.../pulls/:n/reviews`) as the bot
8. Confirm both PRs show 1 approving review + green CI = merge-ready
9. Reply via outbox

## What's in PR #5 right now

**1. `scripts/generate-installation-token.mjs` (new, ~85 lines)**

- Zero external dependencies — JWT signed inline with `node:crypto.createSign("RSA-SHA256")`
- Loads `.env.bot.local` with a minimal built-in parser that handles multi-line double-quoted values (required because RSA private keys span many lines)
- Mints a 9-minute JWT (under GitHub's 10-minute ceiling), exchanges for a ~1-hour installation token
- Prints only the token to stdout; errors and hints go to stderr with non-zero exit

**2. `package.json`** — adds `"bot:token": "node scripts/generate-installation-token.mjs"`

**3. `docs/code-agent-identity.md`** — rewrote two sections:
- **Token generation** — `.env.bot.local` format, the 5-step script flow, smoke-test curl
- **Git config** — `user.name`/`user.email` commands using `BLUEPRINT_BOT_USER_ID`, direct push URL with `x-access-token`, and the `gh auth login --with-token` alternative

## PR stacking — heads up for merge order

- PR #4 (`chore/007`) → must merge first, lands the doc + constitution update
- PR #5 (`chore/008`, this PR) — currently based on `chore/007`. After PR #4 merges, GitHub auto-retargets PR #5 to `main`.
- PR #3 → ideally merges after PR #5 so constitution Principle 3 is in place before the bot starts approving anything.

But PR #4 itself can't land because no one can approve it (branch protection requires 1 review, Chainbeard authored the setup commits so he cannot self-approve the bot identity branch either… wait, actually Chainbeard authored via his personal identity, and the PR was opened by the same identity from `gh pr create`, so self-approval is still blocked).

**This is the chicken-and-egg:** we can't have the bot approve PR #4 until the bot exists, and the bot's docs (which describe how the bot exists) are in PR #4. The unblock path:

- **Option 1:** Opus temporarily reduces branch protection's required-reviews from 1 to 0, merges PR #4 and PR #5, re-enables required reviews to 1. Small window, documented in `.logs/`.
- **Option 2:** Chainbeard approves PR #4 and PR #5 from a second browser session using a different account. But we don't have a second account — that's the whole reason task 007 exists.
- **Option 3:** Opus merges PR #4 and PR #5 via admin override (branch protection allows admins to bypass, if that setting is enabled). Check `gh api repos/empire-architect-lab/blueprint/branches/main/protection | jq .enforce_admins` — if `enforced: false`, admins can merge without review.

Recommendation: **Option 3** if admin bypass is available. Fall back to Option 1 for a documented ~60-second window if admins are also enforced.

## Surprises

1. **Local secrets gap** (above) — the dispatch's "Local verification: source the secrets from a temporary `.env.bot.local`" step implicitly required Chainbeard to create that file on the local machine. It wasn't created, so I can't proceed past step 2. Flagged now so the next dispatch can carry the `.pem` path.
2. **Chicken-and-egg on PR #4 / PR #5 approval** (above). The bot's own enablement PRs cannot be approved by the bot because the bot doesn't exist yet. Needs an admin-override or temporary protection tweak.
3. **Gitleaks false positive on the doc example.** An earlier draft of the doc showed a literal PEM-format private-key header/footer placeholder block (the BEGIN/END dashes-RSA-dashes wrapper). Gitleaks flagged it on pre-push. Replaced with a plain-English angle-bracket placeholder and amended the commit. No real key touched.

## Files touched

- `scripts/generate-installation-token.mjs` (new, 85 lines)
- `package.json` (+1 script line)
- `docs/code-agent-identity.md` (rewrote ~25 lines in 2 sections)

## Stopping here.

Awaiting: (a) `.env.bot.local` on this machine, and (b) a merge strategy for the bot's own enablement PRs.
