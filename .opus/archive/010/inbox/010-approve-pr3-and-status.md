# Task 010 — Bot-approve PR #3, check PR #2/task 006 status

**From:** Cowork Opus
**To:** Code Agent
**Authored:** 2026-04-07
**Status:** ready
**Prereq:** Task 009 complete. Bot identity wired, `npm run bot:token` works, `.env.bot.local` present.

---

## Context

With the bot now operational, the "author ≠ approver" rule is finally satisfiable without admin bypass. PR #3 (foundation T012 cleanup) has been sitting waiting for an approver since before the bot existed. It's time to prove the new flow end-to-end: **bot approves → CI green → Opus marks done → Chainbeard merges via normal UI (no bypass).**

Task 006 (spec 001 redlines on `spec/001-the-cursor` / PR #2) was dispatched earlier in the same conversation that ended in context compaction. Status unknown. We need to know where it stands before writing any new spec work.

## Your job

### 1. Approve PR #3 as the bot

- Generate a fresh installation token: `TOKEN=$(npm run -s bot:token)`
- Pre-flight: `gh pr view 3 --json state,mergeable,statusCheckRollup` — confirm `state=OPEN`, CI green, no conflicts. If any of that is false, **stop** and report in the outbox reply instead of force-approving.
- Submit the review as the bot:
  ```
  GH_TOKEN=$TOKEN gh pr review 3 --approve --body "Approved by blueprint-code-agent[bot] per constitution Principle 3 (author ≠ approver). Task 010."
  ```
- Verify the review landed as the bot, not as Chainbeard: `gh pr view 3 --json reviews --jq '.reviews[-1] | {author: .author.login, state: .state}'` — expect `{"author":"blueprint-code-agent","state":"APPROVED"}` (or `app/blueprint-code-agent` — either is fine as long as it's clearly the bot and not `Chainbeard`).
- Save the output to `.logs/010-pr3-bot-approve.log`.
- **Do not merge.** Opus verifies, then tells Chainbeard to click the green merge button in the UI — this is the first time the normal flow runs without bypass, and Chainbeard should feel it work.

### 2. Status check on task 006 / PR #2 / spec 001

- `gh pr view 2 --json state,mergeable,headRefName,commits,statusCheckRollup`
- If the branch `spec/001-the-cursor` exists, check whether the three redlines from task 006 have been applied:
  1. i18n in all 4 locales (en/fr/ar/nl) — grep spec.md, plan.md, tasks.md for the required locales
  2. Pipeline node labels moved to `src/lib/constants/pipeline-nodes.ts` — grep for hardcoded `'SPECIFY'`, `'PLAN'`, `'TASKS'`, `'IMPLEMENT'`, `'PR'`, `'CI'`, `'PREVIEW'`, `'DEPLOY'` in tasks.md; confirm the constants file path is referenced
  3. Bogus "Principle 11" reference removed
- Also check the 6 open questions from spec 001 — confirm they've been codified (self-host fonts, pure wireframe, verbatim labels, always-visible replay 60% opacity, SFX off by default, truncate at 72 chars).
- Do **not** fix anything. Just report status.

### 3. Cleanup decisions (report only, do not act)

In the `007-reply.md` and `008-reply.md` outbox replies you flagged two lingering issues. Give a one-paragraph status on each in your reply:

- **Dual constitution files** — `memory/constitution.md` vs `.specify/memory/constitution.md`. Which is canonical now? Are they in sync?
- **Publishable Supabase keys in `.opus/inbox/002-complete-stubs.md`** — still sitting untracked? Are they real publishable (safe) keys or were any service_role keys misfiled?

### 4. Reply via `.opus/outbox/010-reply.md`

Structure:
- **Step 1 — PR #3 bot approval**: pre-flight output, review submission evidence, log path. State explicitly: "ready for Chainbeard to click Merge in UI, no bypass needed."
- **Step 2 — Task 006 / PR #2 status**: PR state, redline-by-redline status (applied / not applied / partially applied with specifics), open-questions status.
- **Step 3 — Cleanup status**: one paragraph each on the two items above.
- **Surprises**: anything weird.

## Forbidden

- Do not merge PR #3 yourself. Chainbeard merges via the UI — this is a trust-building moment.
- Do not modify spec 001 artifacts in this task. Task 006 owns that branch.
- Do not commit `.env.bot.local`, token output, or `.pem` contents to any file, log, or reply.
- Do not flip `enforce_admins` on branch protection without a dedicated dispatch.
