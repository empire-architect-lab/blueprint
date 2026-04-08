# Task 033 — Spec 001 / T012 white flash + hero reveal handoff

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue rolling)
**Spec:** `specs/001-the-cursor/spec.md` T012
**Standing order:** roll straight to T013 after this if green; do not stop for visual review.

## One action

Implement T012: white flash overlay + cinematic-complete handoff.

## Whitelist

- `src/components/cursor/white-flash.tsx` (new)
- `src/lib/animations/cursor-scroll-timeline.ts` (edit — fire flash trigger at progress ≥ 0.95)
- `src/app/[locale]/earth-preview/page.tsx` (edit — mount `<WhiteFlash />`, listen for `blueprint:cinematic-complete`)
- `tests/unit/white-flash.test.tsx` (new)
- `specs/001-the-cursor/tasks.md` (tick T012 boxes in same product commit)

Do not touch any T013+ files.

## Acceptance

- Full-viewport fixed div, GSAP fade in 60ms / out 60ms, `pointer-events-none`, `aria-hidden`.
- Reduced-motion: skip flash, dispatch event immediately.
- On fade-out end: dispatch `blueprint:cinematic-complete` once (guard against re-fire).
- Unit test: render, advance fake timers, assert event fired exactly once.

## Scripts (must be green, log to `.logs/033-T012.log`)

1 typecheck · 2 lint · 3 vitest · 4 playwright · 5 gitleaks · 6 audit · 7 rls · 8 tenant · 9 forbidden+i18n

## Bookkeeping

Same task branch: `.logs/033-T012.log`, `.opus/outbox/033-reply.md`, this inbox file.
