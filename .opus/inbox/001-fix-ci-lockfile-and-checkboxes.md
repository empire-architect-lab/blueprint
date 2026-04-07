# Opus → Code Agent · Message 001

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `chore/000-foundation`
**PR:** #1
**Date:** 2026-04-07
**Priority:** P0 — blocks merge of foundation

---

## Context

CI failed on PR #1 in 6 seconds at the `Install dependencies` step. I pulled the raw log from GitHub Actions. Root cause is unambiguous:

```
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json
       and package-lock.json or npm-shrinkwrap.json are in sync.
       Please update your lock file with `npm install` before continuing.
npm error Missing: @swc/helpers@0.5.21 from lock file
```

Translation: `package.json` and `package-lock.json` drifted. `npm ci` (which CI uses) is strict and refuses. Local `npm install` is forgiving and masked it.

Separately: `specs/000-foundation/tasks.md` shows **0/57 checkboxes ticked**. The work was done but the bookkeeping wasn't. We are fixing this habit now, not later.

---

## Tasks (do all of these in one commit on branch `chore/000-foundation`)

### 1. Fix the lockfile

```bash
rm -rf node_modules package-lock.json
npm install
```

This regenerates a clean lockfile that matches `package.json`.

### 2. Re-run the local gates and capture output

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

All four must pass. Append the output to `.logs/000-foundation.log` under a `## Re-run after lockfile fix` section.

### 3. Tick the checkboxes in `specs/000-foundation/tasks.md`

Open the file. For every sub-task you actually completed in commit `823b0a2`, change `- [ ]` to `- [x]`. For T004, T005, T011, T012 leave them unchecked and add `(stubbed — awaiting Opus post-merge)` after each task title. This is the source of truth for what's done — make it match reality.

### 4. Append Principle 10 to `memory/constitution.md`

Add this verbatim at the end of the principles section:

> **Principle 10 — Bookkeeping is part of the work.**
> A task is not complete until the matching checkbox in `specs/<NNN>/tasks.md` is ticked **in the same commit** as the implementation. Code Agent ticks. Opus verifies. PRs that update files but leave `tasks.md` untouched are rejected. The checkbox is the contract; the script output is the proof.

### 5. Establish the Opus ↔ Code Agent message protocol

Create these directories and files:

- `.opus/inbox/` — Opus drops new instructions here as `<NNN>-<topic>.md`
- `.opus/archive/` — completed messages move here (don't delete; we want history)
- `.opus/README.md` — short doc explaining the protocol (see content below)

Content for `.opus/README.md`:

```markdown
# .opus — Opus ↔ Code Agent Message Bus

## How it works

Cowork Opus and Code Agent share this repo but cannot talk directly. Instead of copy-pasting between chat windows, Opus writes instructions as files here.

## Protocol

1. **Opus writes** a new message to `.opus/inbox/<NNN>-<topic>.md` (NNN is a zero-padded sequence number, 001, 002, ...).
2. **Code Agent**, at the start of every session, runs:
   `ls .opus/inbox/` — if anything is there, read every file in numeric order before doing anything else.
3. **Code Agent executes** the instructions in each message.
4. **Code Agent moves** the processed file to `.opus/archive/<NNN>-<topic>.md` in the same commit that fulfills the message.
5. **Code Agent never deletes** messages — archive only.
6. **Code Agent replies** by appending a `## Reply` section to the archived file before moving it, with the commit hash and any blockers.

## Rules

- One message = one focused unit of work. Don't bundle.
- Opus messages always include: context, the exact tasks, the definition of done, and the branch to work on.
- If a message is unclear or impossible, Code Agent stops and writes a `## Blocker` section instead of guessing.
- Code Agent must process inbox messages before picking up `specs/` tasks.
```

Append to `memory/constitution.md` after Principle 10:

> **Principle 11 — The inbox is the channel.**
> All Opus → Code Agent instructions go through `.opus/inbox/`. No copy-paste from chat. Code Agent reads the inbox at the start of every session before touching any other file. Processed messages move to `.opus/archive/` in the same commit that fulfills them.

### 6. Commit and push

Commit message:
```
fix(ci): regenerate lockfile, tick foundation checkboxes, add opus inbox protocol

- Regenerate package-lock.json so npm ci passes in CI
- Tick all completed checkboxes in specs/000-foundation/tasks.md
- Add Principle 10 (bookkeeping is part of the work) to constitution
- Add Principle 11 (inbox is the channel) to constitution
- Establish .opus/inbox + .opus/archive message protocol
- Process and archive Opus message 001

Refs: PR #1
```

Push to `chore/000-foundation`. Do **not** open a new PR — CI will re-run automatically on the existing PR.

### 7. Move this message to archive

Move this exact file from `.opus/inbox/001-fix-ci-lockfile-and-checkboxes.md` to `.opus/archive/001-fix-ci-lockfile-and-checkboxes.md`. Before moving, append a `## Reply` section to it with:
- The new commit hash
- Confirmation that all 4 local gates passed
- Any deviations or blockers

---

## Definition of Done

- [ ] Lockfile regenerated, committed
- [ ] Local typecheck, lint, test, build all green — output in `.logs/000-foundation.log`
- [ ] Every completed sub-task in `specs/000-foundation/tasks.md` ticked
- [ ] Principles 10 and 11 in `memory/constitution.md`
- [ ] `.opus/README.md` created
- [ ] This message archived with a `## Reply` section
- [ ] Branch pushed
- [ ] CI re-running on PR #1

## Forbidden

- Pushing with `--no-verify` again
- Opening a new PR
- Marking T004/T005/T011/T012 as done — those are mine post-merge
- Leaving checkboxes unticked for work that's actually finished
- Editing this message file (only append the `## Reply` section)

## If you hit a blocker

Stop. Append a `## Blocker` section to this file. Do **not** archive it. Do not push partial work. I'll see it next time I check the inbox.
