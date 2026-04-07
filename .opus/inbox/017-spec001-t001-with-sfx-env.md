# Task 017 — Implement spec 001 T001 + fold in `NEXT_PUBLIC_BLUEPRINT_SFX` env fix

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Priority:** P1 — first product-code PR of the Blueprint
**Run order:** Run AFTER tasks 016 and the bot-approval of PR #8 are settled. Do NOT run in parallel with 016 (both touch unrelated branches but may race on `main` for branch creation).

---

## Why

PR #8 merged. Foundation audit (task 014) confirmed the base is healthy. Time to ship the first real product code.

This task executes `T001` as defined in `specs/001-the-cursor/tasks.md`. I'm not re-specifying T001 here — the spec-kit tasks.md is the source of truth and you wrote it. Read it from main and execute it.

**One addition:** the audit found `.env.example` is missing `NEXT_PUBLIC_BLUEPRINT_SFX` (required by spec 001 FR-8). Fold the fix into this same PR — it belongs with T001 since T001 is the first task in spec 001 and FR-8 is a spec 001 requirement.

## Steps

### Part A — read and execute T001

1. Pull latest main: `git fetch origin && git checkout main && git pull`
2. Read `specs/001-the-cursor/tasks.md`. Identify T001's:
   - Title
   - File whitelist (do NOT touch any file outside this whitelist)
   - Acceptance criteria
   - Linked spec.md FRs
3. Branch: `spec/001-the-cursor-t001` (or whatever spec-kit's `/implement` would name it — match spec-kit convention)
4. Write the plan first (`docs/plans/spec-001-t001.md` or wherever your plan convention is): files to change, what changes, what the risks are. Commit the plan separately as `docs(plan): spec 001 T001 plan`.
5. Implement T001 per the tasks.md acceptance criteria. Touch only files in T001's whitelist (see Part B exception below).

### Part B — `NEXT_PUBLIC_BLUEPRINT_SFX` env fix (whitelist exception for this PR only)

Add to `.env.example`:

```
# Spec 001 FR-8: enter-click SFX. Off by default. Set to "true" to opt in.
NEXT_PUBLIC_BLUEPRINT_SFX=false
```

This is a documented one-line additive change to a file outside the T001 whitelist. Permitted **only** for this task because the missing env var was found by audit 014 and folding it in here avoids a separate single-line PR. Note in the PR description that this is the audit fix.

If T001's whitelist already includes `.env.example`, this is not an exception, just part of the work — note that in the reply.

### Part C — run the 9 scripts

After implementation, run all 9 non-negotiable scripts:
1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run test:e2e`
5. `npm run scan:secrets`
6. `npm audit --audit-level=high`
7. `bash scripts/check-rls.sh`
8. `bash scripts/check-tenant-id.sh`
9. `bash scripts/check-forbidden-terms.sh && bash scripts/check-i18n.sh`

All must exit 0. Save the combined output to `.logs/017-t001.log`.

If any script fails, **stop, do not commit, fix the failure, re-run, and only commit when all 9 are green locally**. Do not push a known-failing branch.

### Part D — commit + PR

- Commit message format: `feat(spec-001): T001 <one-line summary>` (per CLAUDE.md conventional commits)
- If multiple commits, use the conventional types (feat/fix/chore/refactor/docs/test) per the CLAUDE.md examples
- PR title: `feat(spec-001): T001 — <T001 title from tasks.md>`
- PR body must include:
  - Link to `specs/001-the-cursor/tasks.md` T001
  - Link to spec.md FRs satisfied
  - Checkbox list of T001 acceptance criteria with `[x]` for each met
  - Note: "includes audit-014 fix: add `NEXT_PUBLIC_BLUEPRINT_SFX` to .env.example (FR-8)"
  - Vercel preview URL once available
- Wait for CI green
- Do NOT self-approve. Stop. Opus reviews the Vercel preview + bot-approves in a follow-up dispatch.

### Part E — reply

Write `.opus/outbox/017-reply.md` with:
- T001 title and acceptance criteria checklist with current state
- Files changed (paths only, no diffs)
- All 9 script exit codes from `.logs/017-t001.log`
- Confirmation that `NEXT_PUBLIC_BLUEPRINT_SFX=false` was added to `.env.example`
- PR number + Vercel preview URL + CI status
- Surprises (anything you discovered while implementing that wasn't in the spec — be honest)

## Do NOT

- Do not touch files outside T001's whitelist (except the documented `.env.example` exception in Part B).
- Do not skip any of the 9 scripts.
- Do not commit if any script fails locally.
- Do not self-approve the PR.
- Do not merge the PR.
- Do not advance to T002 in this dispatch — Opus will dispatch T002 separately after reviewing T001's preview.

## What Opus will do after this lands

1. Read this reply
2. Click the Vercel preview URL and **actually look at the running thing** (the eyeball check, not just the diff)
3. If the preview matches T001's acceptance criteria, dispatch task 018 (bot-approve PR for T001)
4. Walk Chainbeard through the no-bypass merge
5. Then dispatch T002
