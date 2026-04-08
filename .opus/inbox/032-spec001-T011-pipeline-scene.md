# Task 032 — Spec 001 / T011 pipeline scene + scroll flythrough

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `feat/001-the-cursor` (continue, PR #15 rolling draft)
**Previous:** T010 verified green at `ff5d304` (254 tests, 9/9 scripts).

## Action

Implement T011 exactly as spec'd in `specs/001-the-cursor/tasks.md` lines 106–114. One action, no scope creep.

## File whitelist

- `src/lib/constants/pipeline-nodes.ts` (new)
- `src/components/cursor/pipeline-scene.tsx` (new)
- `src/components/cursor/pipeline-node.tsx` (new)
- `src/lib/animations/cursor-scroll-timeline.ts` (new)
- `src/app/[locale]/earth-preview/page.tsx` (mount pipeline scene + Lenis wiring)
- `tests/unit/pipeline-nodes.test.ts` (new — assert array length 8 + verbatim labels)
- `specs/001-the-cursor/tasks.md` (tick T011 boxes in same product commit)

Do NOT touch `earth.tsx`, `particles.tsx`, `latLngToXYZ`.

## Constraints

- `PIPELINE_NODES` labels exempt from i18n (spec answer 3) — add to `scan:forbidden` allowlist if needed.
- Vercel logo SVG: use an inline path constant, no network fetch at build time.
- Lenis + ScrollTrigger wired via `scrollerProxy` exactly as spec line 112.

## Acceptance

All 9 scripts green. Save log to `.logs/032-T011.log`. Standing order still applies: roll straight to T012 when green, no stop for visual review.

## Bookkeeping

Commit `.logs/032-T011.log`, this inbox file, and `.opus/outbox/032-reply.md` on the same product branch (Principle 10 / task 018 rule).
