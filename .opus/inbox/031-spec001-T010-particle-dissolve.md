# Task 031 — Spec 001 / T010 — Particle dissolve system

**Branch:** `feat/001-the-cursor` (continue the rolling draft PR #15)
**Spec:** `specs/001-the-cursor/` — tasks.md section T010

## Prior decision (carry forward)

T009.1 formula is canonical. `latLngToXYZ` is correct as shipped in `5e0e22f`; do NOT flip any signs. If you touch spec prose in a future task, amend the T009.1 bullet to match the formula (+r, 0, 0) — not now.

## One action

Implement T010 per tasks.md: build `src/components/cursor/particles.tsx` as a `BufferGeometry` points cloud (~3000 pts) with a custom shader driven by a `uProgress` uniform, expose `dissolveFromTerminal()` and `reformAsEarth()`, and wire a dev-only keypress trigger (`d`/`r`) behind `process.env.NODE_ENV === "development"` on the `/en/earth-preview` page so it can be eyeballed.

## File whitelist

- `src/components/cursor/particles.tsx` (new)
- `src/app/[locale]/earth-preview/page.tsx` (add dev-only keypress trigger + mount particles beside `<EarthScene />`)
- `tests/unit/particles.test.ts` (progress→shader uniform contract)
- `specs/001-the-cursor/tasks.md` (tick T010 boxes)

Do NOT touch earth.tsx, earth-scene.tsx, or cursor-scroll-timeline.ts (T011).

## Acceptance

- `uProgress` tweens 0→1 via GSAP (not GSAP on the particle mesh itself)
- Both animation fns exported and callable
- Keypress handler is gated by `NODE_ENV === "development"` — no handler registered in prod builds
- `/en/earth-preview` still renders; `d` dissolves, `r` reforms

## Scripts (must all pass, save to `.logs/031-T010.log`)

typecheck, lint, vitest, playwright, gitleaks, npm audit, check-rls, check-tenant-id, check-forbidden-terms + check-i18n.

Bookkeeping commit at end per CLAUDE.md Rule 1. Reply in `.opus/outbox/031-reply.md`. Do NOT stop for human review this time — roll straight to T011 when green.
