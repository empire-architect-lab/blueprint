# Task 055 — Reply

**Status:** Done. DSN replaced on Vercel; preview redeployed; hero headline present in HTML.

## DSN verified in `vercel env ls`

After fix:
- `NEXT_PUBLIC_SENTRY_DSN` — Production, Development, Preview (feat/001-the-cursor), Preview (fix/055-sentry-dsn-vercel)
- `SENTRY_DSN` — same scopes

All set to: `https://e929fa68eabd4a64f476cb46a4e9a9fc@o4511051808899072.ingest.de.sentry.io/4511179806736464`

Note on scopes: original env list had DSN entries only for Preview + Development (no Production). I added Production for completeness per the task. Vercel CLI also required explicit `<gitbranch>` for Preview adds; I scoped Preview entries to `feat/001-the-cursor` and `fix/055-sentry-dsn-vercel` (the only branches that matter for PR #15 stack). If you want a wildcard Preview entry, the CLI rejected `--yes` without a branch — flag for follow-up.

`SENTRY_AUTH_TOKEN` — not present in any scope, nothing to remove.

## Empty commit SHA

- `a8850d9` — `chore(sentry): trigger rebuild after dsn fix [055]` (initial branch push)
- `c25edf9` — `chore(sentry): rebuild with dsn env [055]` (after fix/055 branch envs added)

## New deployment

- ID: `dpl_CFfDwFRDBsgKXw1cfftVnRJte1BZ`
- URL: https://blueprint-q9fih26sh-nacirizak-7822s-projects.vercel.app
- Branch alias: https://blueprint-git-fix-055-sentry-ds-1c4582-nacirizak-7822s-projects.vercel.app
- Status: ● Ready (42s build)

## Grep result

```
curl <preview>/en | grep -c "Built by the process it teaches"
→ 1
```

## Hero text in HTML — yes, but with a caveat

The string `"headline":"Built by the process it teaches."` appears in the next-intl messages payload pushed via `__next_f` in the served HTML. So the grep passes.

**However:** the server-rendered `<main>` still contains `BAILOUT_TO_CLIENT_SIDE_RENDERING` and only the Skip button is in the static markup. The CinematicRouter is client-only. The grep test only proves the i18n payload is shipped — it does **not** prove that Sentry init no longer crashes the client and the hero hydrates visibly. That can only be verified in a browser session.

Recommend: Chainbeard opens the new preview alias in the browser and confirms the hero actually renders. If it's still a black page with only the skip button, Sentry was not the whole story (or the wrong DSN is still being read from somewhere — e.g. a hardcoded fallback) and we open a follow-up.

## Branch / PR

Branch: `fix/055-sentry-dsn-vercel` off `feat/001-the-cursor`. PR opened against `feat/001-the-cursor` (stacks under PR #15) — see PR URL in task log.
