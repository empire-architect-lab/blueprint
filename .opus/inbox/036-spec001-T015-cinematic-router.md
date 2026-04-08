# Task 036 — Spec 001 / T015 CinematicRouter

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `feat/001-the-cursor` (rolling PR #15)
**Spec:** `specs/001-the-cursor/` — T015

## Action

Build `<CinematicRouter />` — the one client component that decides which cinematic (desktop / mobile / none) mounts, and swaps to `<Hero />` on skip/complete. Standing order still applies: roll straight to T016 on green, no wait for visual review.

## Whitelist

- `src/components/cursor/cinematic-router.tsx` (new)
- `tests/unit/cinematic-router.test.tsx` (new)
- `specs/001-the-cursor/tasks.md` (tick T015 boxes in the same product commit)

Do NOT touch `src/app/page.tsx` (T016), `cinematic-intro.tsx`, `cinematic-intro-mobile.tsx`, or `hero.tsx`.

## Requirements

- `"use client"`. Dynamic `import()` for `<CinematicIntro />` and `<CinematicIntroMobile />` so the unused one is not in the bundle.
- Uses `useReducedMotion()` (framer-motion) + `useIsMobile()` (from `@/lib/hooks/use-is-mobile`).
- Reduced motion OR no-JS path: render `<Hero />` + subtitle `cursor.reducedMotionNotice` (add key to all 4 locale JSONs — this IS on the whitelist for this task, append only).
- Listens for `blueprint:cinematic-skip` and `blueprint:cinematic-complete` → swap to `<Hero />`.
- Listens for `blueprint:cinematic-replay` → re-mount cinematic.
- Event-name constants imported from existing modules, no stringly-typing.

Add locale JSON edits to whitelist: `messages/{en,fr,ar,nl}.json` (append `cursor.reducedMotionNotice` only, English canonical, fr/ar/nl mirror + log in `messages/_review.md`).

## Acceptance

- Unit test: reduced-motion path renders Hero + notice; desktop-motion path renders cinematic placeholder (mock dynamic imports); skip event swaps to Hero; replay event re-mounts cinematic.
- 9/9 scripts green, log to `.logs/036-T015.log`.
- Tick all T015 boxes in `tasks.md` same commit.
- Open/update PR #15. Reply in `.opus/outbox/036-reply.md`. Standby for T016.

## Note on T013 deviation

Hero shipped as client component (acknowledged). T016 will mount `<CinematicRouter />` + `<Hero />` from `src/app/page.tsx`; keep Hero client for now — do not flip back in T015.
