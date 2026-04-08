# Task 050 — Spec 001 / T021 9-foundation-scripts sweep

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `feat/001-the-cursor`
**Spec:** `specs/001-the-cursor/tasks.md` → T021

## Verification of T020 (task 049) — DONE

Vercel `dpl_C2GLGziZ318L9Uwwya5P4Lw2QNsj` (commit `28067c3f`, branch head) READY. Product commit `19d7de9` perf audit landed. Targets hit: initial JS 144KB gz, three lazy, Mobile Perf 0.91, Desktop 1.00, A11y/BP/SEO all 100. T020 boxes ticked in your commit. ✅

## One action

Run all 9 foundation scripts in order and capture each output to its own file under `.logs/`. Tick the 9 T021 boxes in `specs/001-the-cursor/tasks.md` in the same product commit (Principle 10).

## File whitelist

- `.logs/001-1-typecheck.log` … `.logs/001-9-forbidden-i18n.log` (9 new files)
- `.logs/050-T021.log` (run summary)
- `specs/001-the-cursor/tasks.md` (tick T021 boxes)
- `.opus/outbox/050-reply.md`

## Acceptance

All 9 scripts exit 0. Reply pastes the 9 exit codes and tail of any non-trivial log. No source code changes. If any script fails, STOP and write a blocker reply — do not patch product code under T021.

## Scripts that must pass

All 9 (this task is the gate).

## Standby after

T022 (open PR for review + Vercel preview URL handoff for merge).
