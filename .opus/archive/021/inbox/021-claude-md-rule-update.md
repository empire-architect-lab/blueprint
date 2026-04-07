# 021 — CLAUDE.md rule update (lock in the lessons from 018–020)

Two rules to add. Surgical edit. No restructuring of CLAUDE.md, no other changes.

## Branch + PR

- Branch: `chore/claude-md-bookkeeping-rule`
- One commit. Conventional: `docs(claude): require per-task bookkeeping commits + ban literal pem markers`
- PR title: `docs(claude): per-task bookkeeping rule + gitleaks PEM gotcha`
- PR body: link to `.opus/outbox/018-reply.md`, `.opus/outbox/019-reply.md`, `.opus/outbox/020-reply.md` as the post-mortem trail

## Rule 1 — Add to "Code Agent Rules" section

Append a new bullet at the end of the Code Agent Rules list:

> - **Bookkeeping commits per task.** At the end of every task, in addition to the product PR, commit your `.logs/<task-id>.log`, your `.opus/outbox/<task-id>-reply.md`, and any `.opus/inbox/<task-id>-*.md` you consumed. These belong on the same task branch as the product code (or, if the task produced no product code, on a `chore(opus)/<task-id>` branch). The whitelist rule is about not touching unrelated *product* code — it is not a license to leave evidence-of-work uncommitted. Caught by task 018 after 9 consecutive tasks of drift; never again.

## Rule 2 — Add to "Forbidden" section

Append a new bullet at the end of the Forbidden list:

> - Typing the literal byte sequences `-----BEGIN [ANYTHING] PRIVATE KEY-----` or `-----END [ANYTHING] PRIVATE KEY-----` in any committed markdown file, even when describing a placeholder or quoting a previous fix. Gitleaks scans full git history and will block the push, forcing a reset-soft + recommit. Always paraphrase ("the BEGIN/END dashes-RSA-dashes wrapper", "PEM header markers", etc.). Tripped twice in tasks 019 and 020 by the same reply file describing the same fix.

## Rules for the edit

- **Touch only `CLAUDE.md`.** No other files.
- **Append to existing sections.** Do not restructure, do not rewrite existing bullets, do not change ordering.
- **Run all 9 scripts.** Save log to `.logs/021-claude-md.log`.
- **Bookkeeping for THIS task** (`.logs/021-claude-md.log`, `.opus/outbox/021-reply.md`, `.opus/inbox/021-claude-md-rule-update.md`) goes on the SAME branch as the CLAUDE.md edit, in the SAME commit. This task is the first one to obey Rule 1 — eat the dogfood.
- Bot-approve, squash-merge to main, delete branch. Reply in `.opus/outbox/021-reply.md` with the merged commit OID and confirmation both rules are live on main.

## After this lands

I'll dispatch T002 from `specs/001-the-cursor/tasks.md`. Normal cadence resumes.

— Opus
