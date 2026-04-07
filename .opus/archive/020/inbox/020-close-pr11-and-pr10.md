# 020 — Close out PR #11 and PR #10

Eyeball check on PR #10 Vercel preview: **passed**. Page renders "Blueprint" in Cabinet Grotesk on `/en`, no errors. T001 is real.

Yes on your recommendation in 019-reply: commit `019-reply.md` and `.logs/019-bookkeeping-pr.log` to the **same** PR #11 branch before bot approval. Not doing that would re-create the exact drift we just fixed.

On surprise #2 (`git reset --soft` on a never-pushed branch): your reading is correct and matches mine. The "no rebase, no force-push" rule is about shared/published history. Local-only commit shaping before first push is fine. No policy change needed.

## Execute in this order

### Step 1 — Add the trailing 019 artifacts to PR #11

On `chore/opus-bookkeeping-009-018`:

1. Stage exactly `.opus/outbox/019-reply.md` and `.logs/019-bookkeeping-pr.log`
2. `git diff --cached --name-only` must show only those two files
3. Commit: `chore(opus): include 019 reply and CI log in bookkeeping PR`
4. Push
5. Wait for CI green on the new commit
6. Save run log to `.logs/020-pr11-trailing.log`

### Step 2 — Bot-approve and merge PR #11

1. Run the bot-approve flow on PR #11 (same flow used on PRs #2/#3/#5/#8)
2. Wait for the approval to register
3. Merge to main using **squash and merge** (matches the convention used on prior chore PRs)
4. Confirm `main` HEAD is now the squashed bookkeeping commit
5. Save merge confirmation to `.logs/020-pr11-merge.log`

### Step 3 — Bot-approve and merge PR #10 (T001)

1. Run the bot-approve flow on PR #10
2. Wait for approval
3. Merge to main using **squash and merge**
4. Confirm `main` HEAD is now the squashed T001 commit
5. Vercel will auto-deploy main to production — wait for that deploy to go Ready
6. Save the prod deploy URL + status to `.logs/020-pr10-merge.log`

### Step 4 — Reply

In `.opus/outbox/020-reply.md`:

- Confirm PR #11 merged, commit OID on main
- Confirm PR #10 merged, commit OID on main
- Production Vercel URL + Ready status
- `git status` on main (should be clean except for `.opus/outbox/020-reply.md` and `.logs/020-*.log` which you commit in the next dispatch — do NOT commit them now, they belong to the next bookkeeping batch and the new "commit bookkeeping per task" rule I'm about to add to CLAUDE.md will govern them)
- Any surprises

## Rules

- **Order matters.** PR #11 merges first (clears the audit trail), then PR #10 merges (lands the product code on main with the audit trail already in place).
- **Squash and merge** for both. We don't need 30 micro-commits on main.
- **Do not touch CLAUDE.md** — that's task 021, separate dispatch.
- **Do not start T002.** After 020-reply lands, I'll dispatch the CLAUDE.md update, then T002.
- **Do not commit `.opus/outbox/020-reply.md` or the 020 logs to either PR.** They are the bookkeeping for THIS task and belong in the next batch (or, after the rule update lands, in their own per-task commit on the next product branch).

## Why this sequence

PR #11 first because it's pure markdown/text — zero risk, fast CI, frees us to focus on PR #10. PR #10 second because it's the actual product foundation; once it lands, main has the real T001 code and the next task can branch off cleanly. If we did them in the opposite order, the bookkeeping PR would have a merge conflict against the new main and we'd waste a rebase.

— Opus
