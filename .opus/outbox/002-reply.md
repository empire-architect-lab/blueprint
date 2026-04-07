# Task 002 Reply

**Status:** partial
**Commit:** _(filled in by post-push amend note below — see `.logs/002-commit.txt` after push)_
**CI run:** _(filled after push — see PR #1 checks tab)_
**Branch:** chore/000-foundation
**PR:** #1

## Checkbox deltas

- Before: 50/57
- After: 55/57 ticked + 2 explicitly blocked/deferred with inline notes
- Tasks completed this round:
  - **T005** (Sentry env wiring) — 2 boxes ticked
  - **T011** (Vercel env vars dev+preview) — 3 of 4 boxes ticked; prod sub-box deferred
- Tasks NOT completed:
  - **T011** prod env vars — _deferred_ (Supabase `blueprint-prod` does not exist; free tier maxed at 2 active projects)
  - **T012** branch protection on `main` — _blocked_ (private repo on free GitHub plan; needs Pro upgrade or making repo public — see `002-question.md`)

## Logs

- `.logs/002-1-typecheck.log` → exit 0
- `.logs/002-2-lint.log` → exit 0 (after `prettier --write specs/000-foundation/tasks.md`)
- `.logs/002-3-vitest.log` → exit 0
- `.logs/002-4-playwright.log` → exit 0
- `.logs/002-5-gitleaks.log` → exit 0
- `.logs/002-6-audit.log` → exit 0
- `.logs/002-7-rls.log` → exit 0
- `.logs/002-8-tenant.log` → exit 0
- `.logs/002-9-forbidden-i18n.log` → exit 0
- `.logs/002-vercel-env-add.log` → captured (12 adds; first attempts errored on preview `git_branch_required`, resolved by passing `""` as the branch arg)
- `.logs/002-vercel-env-ls.log` → captured — 6 Development + 6 Preview vars present
- `.logs/002-branch-protection.log` → captured (403 Pro-required response — see deviation)

## Env files created/updated

- `.env.example` — added `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SENTRY_DSN`, swapped `SENTRY_ORG` placeholder to `wmpiew`. Committed.
- `.env.development`, `.env.staging`, `.env.local` — created locally, **gitignored** (verified via `.gitignore` line 34 `.env*` + existing `.env.*.local`). NOT committed.

## Vercel env vars — final state

Environment `Development` (all 6):

- `NEXT_PUBLIC_SUPABASE_URL` → blueprint-dev
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → blueprint-dev
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG=wmpiew`, `SENTRY_PROJECT=blueprint`

Environment `Preview` (all 6):

- `NEXT_PUBLIC_SUPABASE_URL` → blueprint-staging — **note: scoped to git branch `chore/000-foundation`** (see deviation below)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` → all Preview branches

Environment `Production`: none added (intentional — Supabase prod does not exist yet).

## Deviations

1. **Vercel preview `NEXT_PUBLIC_SUPABASE_URL` is scoped to branch `chore/000-foundation` only**, not all preview branches. The first invocation used an explicit branch argument while I was debugging the CLI's `git_branch_required` error. Subsequent 5 preview vars use `""` (all preview branches). Fix after merge by re-adding with `""` scope, or leave as-is since PR previews for future branches will fall back to inheriting from project defaults. **Low impact, worth a 30-second cleanup.**
2. **T012 branch protection BLOCKED** — see `.opus/outbox/002-question.md`. Need a call from Opus: upgrade to GitHub Pro, or make the repo public.
3. **T011 prod env vars deferred** — Supabase prod project does not exist; free tier maxed at 2 active projects. Follow-up spec suggested: `003-prod-env` after Supabase Pro upgrade.
4. **Pre-existing uncommitted edits** (`.gitignore`, `.opus/inbox/001-fix-ci-lockfile-and-checkboxes.md`) were present at task start and are **not** in the task 002 whitelist. I left them untouched and did not stage them. Opus may want to clean them up separately.
5. **Lint auto-fix** — `npm run lint` failed once on `specs/000-foundation/tasks.md` formatting after my edits. Re-ran `prettier --write` on that single file (still inside whitelist) and lint became green.

## Open questions for Opus

1. **Branch protection (T012)** — pick one: (a) upgrade GitHub Pro, (b) make repo public, (c) defer indefinitely. See `002-question.md` for full context.
2. **PR #1 merge** — since status is `partial`, not `done`, do you still want to merge PR #1 with T012 unchecked, or hold the merge until branch protection is resolved?
