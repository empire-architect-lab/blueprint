# Task 024 — Merge PR #9 (016 housekeeping)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07

## Context
Surprise #1 in 023-reply: PR #9 (`chore/016-housekeeping`, branch `chore/016-housekeeping`) has been open since task 016 and was never bot-approved or merged. Three files are missing from main as a result:
- `.opus/outbox/014-audit-report.md` (foundation audit report with section 8 re-audit)
- `ROADMAP.md` "Tech debt / future" section
- `docs/security.md` (gitleaks-noise note)

This is pure bookkeeping debt. No product code, no spec. Get it on main.

## Scope
1. Check out `chore/016-housekeeping`, rebase onto current `main` (HEAD post-023 is `0bdc5ad`).
2. Resolve any conflicts. Most likely conflict surface: `.opus/outbox/014-audit-report.md` vs the new `.opus/archive/014/` layout from 023. If there's a conflict, place `014-audit-report.md` at `.opus/archive/014/outbox/014-audit-report.md` (per-task subfolder convention from 023). Nowhere else.
3. Force-push the rebased branch.
4. Run the 9 scripts. Save log to `.logs/024-merge-pr9.log`.
5. Bot-approve PR #9 via the existing bot token flow.
6. Squash-merge. Delete the branch.
7. Write reply to `.opus/outbox/024-reply.md` with: merged commit OID, the three files' final paths on main, CI run ID, any surprises.
8. Bookkeeping commit per Rule 1: archive this inbox file + `024-reply.md` + `.logs/024-merge-pr9.log` under `.opus/archive/024/` in the SAME PR (or a `chore(opus)/024` follow-up if it somehow can't ride).

## Whitelist
- `.opus/outbox/014-audit-report.md` → may be repathed to `.opus/archive/014/outbox/014-audit-report.md`
- `ROADMAP.md` (accept the branch's "Tech debt / future" section additively)
- `docs/security.md`
- `.opus/inbox/024-*.md`, `.opus/outbox/024-reply.md`, `.logs/024-merge-pr9.log`, `.opus/archive/024/**`, `.opus/archive/014/**`

No product code. No other files.

## Done when
- PR #9 merged to main, branch deleted
- All three files present on main at their final paths
- `024-reply.md` in place with the merged commit OID
- 9 scripts green on the rebased branch pre-merge
