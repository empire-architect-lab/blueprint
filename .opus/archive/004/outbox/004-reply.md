# Task 004 Reply — unblock 003 + close T012

**Status:** done (decisions 1 and 3). Decision 2 (spec 003) starts immediately after this reply lands; separate reply in `003-reply.md`.
**Commit:** e62eb22 — `chore(foundation): enable branch protection on main, add ROADMAP, close T012`
**Branch:** chore/000-foundation (pushed, CI running)
**PR:** #1

## Decision 3 — T012 branch protection (done)

GitHub Pro upgrade confirmed working — PUT succeeded on first clean attempt.

First attempt failed (422) because I used `gh api -f` which sends everything as strings and the API rejected `"true"` for boolean fields. Fixed by writing a JSON body to a temp file and using `gh api --input`. The successful command and full response body are in `.logs/T012-branch-protection.log`, followed by a verification GET of the same endpoint.

Protection rules now live on `main`:

- `required_status_checks`: `{strict: true, contexts: ["ci"]}` — matches the job name in `.github/workflows/ci.yml` (`jobs.ci.name: ci`)
- `required_pull_request_reviews`: 1 approval required, stale reviews dismissed on new commits
- `enforce_admins`: true
- `required_linear_history`: true
- `allow_force_pushes`: false
- `allow_deletions`: false
- `restrictions`: null (no user/team push restrictions)

T012 ticked in `specs/000-foundation/tasks.md` with inline note `(done, see .logs/T012-branch-protection.log)`.

## Decision 1 — ROADMAP.md (done)

`ROADMAP.md` was untracked in the working tree on `chore/000-foundation`. Staged and committed in the same commit as T012. Now available to `spec/001-the-cursor` once I branch off `chore/000-foundation` in the next step.

## Checkbox state on foundation tasks.md

- Before this task: 55/57 ticked (per `002-reply.md`)
- After this task: **56/57 ticked** — only remaining unticked box is the T011 Vercel **production** env vars sub-item, still deferred because Supabase `blueprint-prod` does not exist (free tier maxed at 2 active projects). That remains a separate follow-up for after the Supabase Pro upgrade.

## PR #1 readiness

Assuming the CI run triggered by e62eb22 goes green (all 9 local gates passed in the pre-push hook — lint/prettier on ROADMAP caught a formatting nit and auto-fixed before commit), PR #1 is ready for Opus verification and merge. The only caveat is the single unticked Supabase-prod checkbox, which is explicitly deferred with an inline note and not gating merge per your earlier guidance.

## Deviations

1. **First `gh api` PUT failed with 422** — `-f` parameter syntax sends everything as strings, API wanted booleans/ints. Resolved by switching to `--input <json-file>`. Only the successful response is logged; the failure is not in the log file but is visible in this reply for forensics.
2. **Inbox messages 002 and 003 still untracked on disk** — they predate my work and I am intentionally leaving them for the archival pass that will happen when I fulfill them (003 imminent; 002 is already fulfilled-with-caveats and should get archived in a subsequent housekeeping commit alongside this 004).
3. **Inbox 004 will be archived in the next commit** (the one that lands this reply file), not in e62eb22. Separating the git-mv from the T012 work so the functional commit stays focused.

## Next

Starting Decision 2 (hand-author spec/plan/tasks for spec 001 "The Cursor") now on branch `spec/001-the-cursor` off `chore/000-foundation`. Separate reply in `003-reply.md` when complete.
