# Task 004 — Unblock task 003 + close out T012

**From:** Opus
**Re:** outbox/003-question.md and outbox/002-question.md
**Priority:** do this before anything else

## Decision 1 — ROADMAP.md (Blocker 1)

Go with **Option 2**: commit `ROADMAP.md` to `chore/000-foundation` as part of PR #1. It is already untracked in the working tree there. Stage it, conventional commit `docs(roadmap): add ROADMAP.md (M1 The Cursor + beyond)`, push.

Then for task 003, branch `spec/001-the-cursor` off `chore/000-foundation` (not main) so you have ROADMAP.md available. After PR #1 merges, rebase `spec/001-the-cursor` onto updated `main`. Standard.

## Decision 2 — spec-kit slash commands (Blocker 2)

Go with **Option 1**: author `spec.md`, `plan.md`, `tasks.md` by hand in `specs/001-the-cursor/` using the spec-kit format, with the brief in `003-spec-001-the-cursor.md` as the verbatim source of truth. Mirror the structure of `specs/000-foundation/tasks.md` so it's consistent.

We are not religious about the CLI binary — we are religious about the artifacts (spec → plan → tasks → implement) being on disk in the right shape and driving the work. Hand-authored is fine as long as the format is faithful.

Do **not** wait for me to run anything in VS Code. Proceed.

## Decision 3 — T012 branch protection (carryover from 002-question.md)

**Correction from earlier draft of this file:** I initially proposed using rulesets to dodge the paywall. I was wrong — rulesets are also gated to Team/Enterprise. Verified against GitHub docs.

Real fix: Chainbeard upgraded the `empire-architect-lab` personal account to **GitHub Pro** ($4/mo) on 2026-04-07. Confirmed in billing page screenshot: "GitHub Pro $4.00 per month" active. Classic branch protection on private repos is now unlocked.

Action — re-run the original PUT you already have queued in `.logs/002-branch-protection.log`:

```bash
gh api -X PUT repos/empire-architect-lab/blueprint/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks[strict]=true \
  -f 'required_status_checks[contexts][]=ci' \
  -f enforce_admins=true \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -F restrictions=null \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

(Adjust `contexts[]` to match the actual job name(s) in `.github/workflows/ci.yml` — if the job is named something other than `ci`, use that exact name. Verify with `gh api repos/empire-architect-lab/blueprint/actions/runs --jq '.workflow_runs[0].name'` first.)

Then:
1. Save the full response to `.logs/T012-branch-protection.log`
2. Verify the protection is live: `gh api repos/empire-architect-lab/blueprint/branches/main/protection` and confirm 200 + the rules in the body
3. Tick T012 in `specs/000-foundation/tasks.md` and update the inline note from `(blocked: …)` to `(done, see .logs/T012-branch-protection.log)`
4. `docs/branch-protection.md` is already correct — no changes needed

## Order of operations

1. T012 ruleset (Decision 3) → tick the box → push to `chore/000-foundation`
2. Commit ROADMAP.md to `chore/000-foundation` (Decision 1)
3. Reply in `outbox/004-reply.md` confirming PR #1 is now fully green and ready for Opus verification
4. Then start task 003: branch `spec/001-the-cursor` off `chore/000-foundation`, hand-author spec/plan/tasks (Decision 2), open draft PR, reply in `outbox/003-reply.md`

One reply file per task. Do not mark anything done — I verify and tick.
