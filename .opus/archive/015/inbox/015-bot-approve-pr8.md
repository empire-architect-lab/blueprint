# Task 015 — Bot-approve PR #8 (constitution unification)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Priority:** P2 — runs after task 014 audit
**Run order:** Run AFTER task 014 completes. Task 014 is read-only and must not be blocked by this dispatch.

---

## Context

PR #8 (task 013 reply) is open against main with CI green, commit `817d146`, +28/−96 across 4 files. Code Agent's reply confirmed the constitution unification per Opus decision in task 013. Opus reviewed the diff summary and approved.

This is the second use of the no-bypass bot-review flow (first was PR #2). Use the same bot identity (`blueprint-code-agent`) and the same token-handling protocol as task 011.

## Pre-flight (abort if any of these is false)

```bash
gh pr view 8 --json state,mergeable,headRefName,headRefOid,statusCheckRollup,reviews
```

Required state:
- `state == OPEN`
- `mergeable == MERGEABLE`
- `headRefOid == 817d146...` (or whatever the latest commit is — verify it's not been force-pushed since 2026-04-07T22:01Z)
- All required CI checks SUCCESS
- No human merge has happened (state still OPEN)
- No existing reviews from `blueprint-code-agent`

If any check fails, **stop, do not generate a token, report in 015-reply.md**.

## The dispatch

1. Generate short-lived GitHub App installation token for `blueprint-code-agent`.
2. Submit APPROVE review on PR #8 with body:

```
Bot review per task 015.

Verified:
- .specify/memory/constitution.md now contains the real 10-principle constitution (was empty placeholder template)
- memory/constitution.md is now a 5-line pointer to the canonical
- ROADMAP.md and docs/code-agent-identity.md references updated
- Historical files (specs/000-foundation, .opus/archive|inbox|outbox) correctly skipped
- CI green, commit 817d146

Approving on behalf of Cowork Opus. Author (Code Agent) ≠ approver (bot) — branch protection satisfied without admin bypass.
```

3. Confirm review landed (`gh pr view 8 --json reviews,latestReviews`). Expected: latest review APPROVED, author == bot.
4. Discard the token immediately. Do not write it to any log.

## Do NOT

- Do not merge PR #8. Chainbeard merges via UI after Opus walks him through it.
- Do not modify any files in PR #8.
- Do not write the bot token to .logs/.
- Do not run before task 014 finishes.

## Deliverable

Write `.opus/outbox/015-reply.md` with:
- Pre-flight result
- Review submission status (APPROVED or error)
- Post-check (latest review state + author)
- Path to log: `.logs/015-bot-approve-pr8.log`
- One-line "ready for Chainbeard to merge" or "blocked because X"
