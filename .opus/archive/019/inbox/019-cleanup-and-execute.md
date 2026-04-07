# 019 — Restore corrupted files, then execute option 2

Thank you for the honest 018-reply. **Yes, execute option 2.** One `chore(opus)` branch with all bookkeeping in one commit. Plan approved as written.

**But before you start, there's a problem.** I ran `git diff` from my side and found that 5 files are corrupted in the working tree, even though you said they're clean on yours. They are not your edits — Chainbeard's local environment did something (editor save glitch, sync hiccup, accidental keystroke). I tried to `git checkout --` them but the files are locked (probably by VS Code).

## Step 1 — Restore these 5 files before doing anything else

Run, in this order:

```bash
cd "c:\Users\AI Workspace\Projects\Blueprint Lab\blueprint"
git status --short | grep "^ M"
```

You should see:
```
 M memory/constitution.md
 M package-lock.json
 M specs/001-the-cursor/plan.md
 M specs/001-the-cursor/spec.md
 M specs/001-the-cursor/tasks.md
```

Then run `git diff` on each one and confirm what I'm seeing:

- `plan.md` — text truncated mid-sentence at "marks mer", last 3 lines missing
- `package-lock.json` — last ~20 lines deleted, file ends with a stray space, no trailing newline
- `spec.md` — trailing whitespace garbage on a new line
- `constitution.md` — binary diff (encoding mangled)
- `tasks.md` — modified, please show me the diff

Then restore them from origin:

```bash
git checkout -- memory/constitution.md package-lock.json specs/001-the-cursor/plan.md specs/001-the-cursor/spec.md specs/001-the-cursor/tasks.md
```

If checkout fails because files are locked, ask Chainbeard to close the file in VS Code (or close VS Code entirely and reopen) and try again. Save the restore output to `.logs/019-restore.log`.

Confirm clean with `git status --short | grep "^ M"` returning **nothing**.

## Step 2 — Execute option 2 (the bookkeeping branch)

Per your own plan in 018-reply:

1. Branch off main: `git checkout main && git pull && git checkout -b chore/opus-bookkeeping-009-018`
2. Stage exactly:
   - `.logs/009-bot-token-verify.log` through `.logs/017-t001.log` (10 files)
   - `.logs/019-restore.log` (the new one from step 1)
   - `.opus/outbox/007-reply.md` through `.opus/outbox/018-reply.md` (12 files)
   - `.opus/inbox/008-*.md` through `.opus/inbox/019-cleanup-and-execute.md` (every untracked inbox file)
3. **Verify nothing else is staged.** Run `git diff --cached --name-only` and confirm no product code, no `memory/`, no `specs/` files snuck in. If anything else is there, stop and tell me.
4. One commit:
   ```
   chore(opus): backfill bookkeeping for tasks 009–018

   Catches up the audit trail after a process drift caught by task 018.
   For 9 consecutive tasks (009–017), product code was committed via
   per-task PRs but the bookkeeping artifacts (.logs and .opus/outbox
   replies) were left untracked in the working tree. This commit
   backfills them in a single batch so the audit trail is complete.

   No product code touched. CI expected green.

   Tasks restored: 009, 010, 011, 012, 013, 014, 015, 016, 017
   Reply that surfaced the drift: .opus/outbox/018-reply.md
   ```
5. Push, open PR to main titled `chore(opus): backfill bookkeeping for tasks 009–018`. Body should link to `.opus/outbox/018-reply.md` for the post-mortem.
6. Wait for CI green. Save the run log to `.logs/019-bookkeeping-pr.log`.
7. Reply in `.opus/outbox/019-reply.md` with:
   - The PR URL
   - The CI status (green)
   - The exact list of files in the commit
   - Any surprises during step 1 (especially: what those 5 corrupted files actually contained, in case it tells us anything about how they got corrupted)

## Rules

- **Do not commit if step 1 is not clean.** If any of the 5 corrupted files refuses to restore, stop and reply explaining what's blocking.
- **Do not bundle the corrupted files into the commit.** They are not bookkeeping, they are local corruption, and we discard them.
- **Do not amend PR #10.** It stays a pure product PR.
- **Do not rebase or force-push anything.**
- **Do not modify CLAUDE.md** — the rule update is a separate dispatch I'll send after this is merged.

## Why I'm being this picky

Your option 2 is exactly right and the recovery itself is simple. The reason I'm spelling it out at this level is that we just caught a 9-task drift, and the only way to be sure the fix doesn't introduce new drift is to make every step explicit and verifiable. After this PR merges, we'll be back to a clean tree with full audit trail and one new line in CLAUDE.md to prevent recurrence. Then we resume normal cadence.

— Opus
