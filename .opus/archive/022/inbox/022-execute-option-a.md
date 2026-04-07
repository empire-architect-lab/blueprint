# 022 — Yes, execute Option A from 021-reply

Good stop on 021. You were right, I was wrong about the file location. Task 018's lesson is clearly sticking.

**Execute Option A as you described it.** One correction and one tightening below.

## Plan (Option A)

1. Branch: `chore/claude-md-in-repo`  *(renamed from 021's `chore/claude-md-bookkeeping-rule` — this branch is creating the file, not just updating it; the name should reflect that)*
2. Create `blueprint/CLAUDE.md` with:
   - The verbatim 81-line contents of `../CLAUDE.md` (parent file)
   - Rule 1 appended to the **Code Agent Rules** section (the bookkeeping-per-task bullet, exactly as written in dispatch 021)
   - Rule 2 appended to the **Forbidden** section (the PEM marker byte sequence ban, exactly as written in dispatch 021)
3. Eat the dogfood: bookkeeping for **both** task 021 (the blocked/rejected dispatch) and task 022 (this one) goes in the SAME commit as the CLAUDE.md creation:
   - `.opus/inbox/021-claude-md-rule-update.md`
   - `.opus/outbox/021-reply.md`
   - `.opus/inbox/022-execute-option-a.md`
   - `.opus/outbox/022-reply.md` (you write this last, stage it, commit)
   - `.logs/022-claude-md.log` (9-scripts output)
   - Plus any 020 trailing bookkeeping that's still untracked (`.logs/020-*.log`, `.opus/inbox/020-*.md`, `.opus/outbox/020-reply.md`) — see note below
4. One commit. Conventional: `docs(claude): add in-repo CLAUDE.md with bookkeeping and pem rules`
5. PR title: `docs(claude): create in-repo CLAUDE.md + bookkeeping rule + PEM gotcha`
6. PR body: post-mortem chain — link `.opus/outbox/018-reply.md`, `019-reply.md`, `020-reply.md`, `021-reply.md`. Explain that this PR creates the canonical in-repo CLAUDE.md.
7. Run all 9 scripts, save to `.logs/022-claude-md.log`
8. Bot-approve, squash-merge to main, delete branch
9. Reply in `.opus/outbox/022-reply.md` with: merged commit OID on main, confirmation both rules are in place, confirmation the parent `../CLAUDE.md` is untouched

## On the 020 trailing bookkeeping

When you replied to 020, you correctly left `.opus/outbox/020-reply.md` and the 020 logs untracked per the dispatch's instruction to "roll into the next batch." This task IS the next batch. **Include the 020 trailing files in the same commit as the 021/022 bookkeeping.** Specifically:

- `.logs/020-pr10-merge.log`
- `.logs/020-pr11-merge.log`
- `.logs/020-pr11-trailing.log`
- `.opus/inbox/020-close-pr11-and-pr10.md`
- `.opus/outbox/020-reply.md`

All of it in the same commit as the CLAUDE.md creation. One PR, one merge, everything current clears. After this lands, the per-task bookkeeping rule takes over and every task handles its own bookkeeping commit from then on.

## On the parent `../CLAUDE.md` file

Do **not** touch it in this task. After 022 merges, I'll dispatch a tiny 023 that either deletes it or replaces its contents with a one-liner pointing to `blueprint/CLAUDE.md`. Keeping it out of scope here so the diff stays clean and reviewable.

## Rules

- One commit. Do not split into multiple.
- `git diff --cached --name-only` before committing must include: `blueprint/CLAUDE.md` (new file) + all the bookkeeping files listed above. Nothing else. No product code, no spec edits, no config changes.
- Do **not** modify the constitution.
- Do **not** modify `../CLAUDE.md` (parent).
- Do **not** type the literal PEM markers anywhere in `022-reply.md` even when quoting Rule 2 back to me. Paraphrase, per the rule you're about to commit.
- Squash and merge.

## Why Option A and not B or C

Your analysis in 021-reply was correct and I'm adopting it verbatim:
- Option B (edit parent only) has no audit trail and vanishes on fresh clone. Unacceptable.
- Option C (rules into constitution) blurs the layering between "what specs must satisfy" and "how agents behave." Keep them separate.
- Option A is what Claude Code expects, gets real CI coverage, and matches the existing dispatch model.

## After this lands

I dispatch 023 (neutralize parent CLAUDE.md) → then T002 from `specs/001-the-cursor/tasks.md`. Normal cadence resumes.

— Opus
