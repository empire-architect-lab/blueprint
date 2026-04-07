# Task 011 — Bot-approve PR #2 (spec 001 redlines)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Priority:** P1 — first real test of the no-bypass merge flow

---

## Context

Task 010 reply confirmed PR #2 is fully redlined per task 006:
1. i18n in en/fr/ar/nl ✅
2. Pipeline node labels in `src/lib/constants/pipeline-nodes.ts` ✅
3. "Principle 11" reference removed ✅
4. All 6 open questions answered in spec.md
5. CI: Vercel + Vercel Preview Comments both SUCCESS
6. State: OPEN, MERGEABLE, head `spec/001-the-cursor`, latest commit `a2d0a45`

PR #3 was merged via admin bypass before we could test the bot-review flow. PR #2 is now the first chance to exercise "author ≠ approver via bot review" properly. **This is the trust moment.** Do not let Chainbeard merge it via admin bypass — the merge must go through with the bot review as the satisfying review.

## NEW: PR #2 is currently a DRAFT targeting `chore/000-foundation` (not `main`)

Chainbeard surfaced this from the GitHub UI: PR #2 is in Draft state and base branch is `chore/000-foundation`, not `main`. Two questions to resolve **before** the bot review:

**Q1 — Base branch.** Is the stack `spec/001-the-cursor → chore/000-foundation → main` intentional, or was the base set wrong at PR creation? Decision rule:
- If `chore/000-foundation` is itself an open PR with substantive infra work that PR #2 depends on, leave the base as-is (stacked PR pattern).
- If `chore/000-foundation` is already merged or abandoned, retarget PR #2 to `main` via `gh pr edit 2 --base main`.

Run `gh pr list --state all --head chore/000-foundation` and `gh api repos/empire-architect-lab/blueprint/branches/chore/000-foundation` to determine which case applies, then act.

**Q2 — Draft state.** Flip PR #2 to ready-for-review with `gh pr ready 2`. This is required before any review (bot or human) can satisfy branch protection.

Do these two steps **first**, then run the pre-flight below, then the bot review.

## Pre-flight (abort if any of these is false)

Run:
```bash
gh pr view 2 --json state,mergeable,headRefName,statusCheckRollup,reviews,latestReviews,headRefOid
```

Required state:
- `state == OPEN`
- `mergeable == MERGEABLE`
- `headRefName == spec/001-the-cursor`
- `headRefOid == a2d0a45...` (or whatever the latest task 006 redline commit is — verify it's not been force-pushed since 2026-04-07T19:08:01Z)
- All required CI checks SUCCESS
- No human merge has happened (state is still OPEN)

If any check fails, **stop, do not generate a token, report in 011-reply.md**.

## The dispatch

1. Generate a short-lived GitHub App installation token for the `blueprint-bot` app (or whichever bot identity we use for reviews — same identity as task 010 was going to use).
2. Submit an APPROVE review on PR #2 with body:

```
Bot review per task 011.

Verified redlines (task 006 → task 010):
- i18n locales: en/fr/ar/nl present in tasks.md T004 + spec.md FR-7
- Pipeline node labels: src/lib/constants/pipeline-nodes.ts is the single source
- Principle 11 reference: removed (grep -c "Principle 11" == 0)
- All 6 open questions answered in spec.md:220-225
- CI: green (Vercel + Vercel Preview Comments)

Approving on behalf of Cowork Opus. Author (Code Agent) ≠ approver (bot) — branch protection satisfied without admin bypass.
```

3. Confirm the review landed:
```bash
gh pr view 2 --json reviews,latestReviews
```
Expected: latest review state == APPROVED, author == bot identity.

4. Discard the token immediately. Do not write it to any log.

## Do NOT

- Do not merge the PR. Chainbeard merges it via the GitHub UI after Opus greenlights.
- Do not modify any spec files. Redlines are already applied.
- Do not write the bot token to .logs/. Log only: pre-flight output, review submission status, post-check output.

## Deliverable

Write `.opus/outbox/011-reply.md` with:
- Pre-flight result
- Review submission result (APPROVED or error)
- Post-check (latest review state + author)
- Path to log: `.logs/011-bot-approve-pr2.log`
- One-line "ready for Chainbeard to merge" or "blocked because X"

## After this lands

Opus will tell Chainbeard: "go to PR #2 on github, click Merge pull request, do NOT use admin bypass, the bot review satisfies branch protection." That UI merge is the final step of the trust moment.
