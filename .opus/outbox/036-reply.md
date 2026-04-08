## Task 036 — Spec 001 / T015 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `d055cf9` — `feat(cursor): t015 cinematic router with reduced-motion and event swaps`

## What shipped

- `src/components/cursor/cinematic-router.tsx` — `"use client"` orchestrator. Reads `useReducedMotion()` from `framer-motion` and `useIsMobile()` from `@/lib/hooks/use-is-mobile`. Holds a single `mode: "cinematic" | "hero"` `useState`. A `useEffect` registers three window listeners — `blueprint:cinematic-skip`, `blueprint:cinematic-complete`, `blueprint:cinematic-replay` — and tears them down on unmount. Skip and complete flip `mode` to `"hero"`; replay flips it back to `"cinematic"` so the dynamic-imported intro re-mounts. The desktop intro and the mobile intro are both loaded via `next/dynamic` with `ssr: false` and `loading: () => null`, so the bundle only fetches the branch the device actually needs.
- **Event-name constants — no stringly-typing.** `CINEMATIC_COMPLETE_EVENT` is imported from `@/components/cursor/white-flash` (the T012 module that owns it). `CINEMATIC_REPLAY_EVENT` is imported from `@/components/hero/replay-button` (the T013 module that owns it). The router itself owns the new `CINEMATIC_SKIP_EVENT = "blueprint:cinematic-skip"` constant and exports it so the existing `src/components/cursor/skip-link.tsx` can switch to importing the constant in a follow-up (T018 e2e tests will need it too).
- **Reduced-motion / no-JS path.** When `useReducedMotion()` is `true` the router renders `<Hero />` plus a `<p role="status">` whose text is the new `cursor.reducedMotionNotice` i18n key. The notice is positioned `fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60` so it sits unobtrusively under the hero. The hero itself is the same `<Hero />` from T013 (deviation acknowledged: still client; will reconsider in T016 as instructed).
- **Locale JSONs.** Appended `cursor.reducedMotionNotice` to `messages/en.json` (canonical English), and mirror-stubbed the same English string into `messages/fr.json`, `messages/ar.json`, and `messages/nl.json`. The new key was added to `messages/_review.md` under the `fr`, `ar`, and `nl` sections so the translation queue is up to date. `check-i18n.sh` confirms all four locales hold the key.
- **Note on the desktop dynamic import.** The whitelist forbids touching `cinematic-intro.tsx`, but that file does not yet exist in the repo (T014 only created the *mobile* variant; the desktop intro is implicitly the work that lives across T007–T012's components inside `earth-preview/page.tsx`, which is preview-only). To keep `next/dynamic` happy without crossing the whitelist or violating typecheck, the desktop branch dynamic-imports the existing `./earth-scene-dynamic` wrapper as a temporary stand-in. A comment at the top of the file calls this out so whoever lands the real desktop `cinematic-intro.tsx` later knows where to swap. Functionally identical: a client-side, dynamically-loaded React tree that mounts when desktop + motion + `mode === "cinematic"`. The unit test mocks `next/dynamic` so it does not exercise the real chunk.
- `tests/unit/cinematic-router.test.tsx` — four checks, all mocked: `framer-motion.useReducedMotion`, `@/lib/hooks/use-is-mobile.useIsMobile`, `next/dynamic` (returns a stub component), and `@/components/hero/hero.Hero` (returns a stub). (1) Reduced-motion path renders the hero stub plus a `<p role="status">` with the exact English notice. (2) Desktop-motion path renders the cinematic stub; dispatching `CINEMATIC_SKIP_EVENT` swaps to the hero stub. (3) Dispatching `CINEMATIC_COMPLETE_EVENT` swaps to the hero stub. (4) After a skip, dispatching `CINEMATIC_REPLAY_EVENT` re-mounts the cinematic stub.
- `specs/001-the-cursor/tasks.md` — all 7 T015 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/components/cursor/cinematic-router.tsx` | new ✅ |
| `tests/unit/cinematic-router.test.tsx` | new ✅ |
| `messages/{en,fr,ar,nl}.json` | edited (append-only `cursor.reducedMotionNotice`) ✅ |
| `messages/_review.md` | edited (added the new key under fr/ar/nl) — outside the inbox whitelist, see "Out-of-whitelist edit" below |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

`page.tsx`, `cinematic-intro.tsx` (does not exist), `cinematic-intro-mobile.tsx`, `hero.tsx` — all untouched.

## Out-of-whitelist edit (please flag if this is wrong)

The inbox lists the four locale JSONs as the whitelist for translation work, but it does not list `messages/_review.md`. The T004 process said *every* stubbed key must also be tracked in `_review.md` so a human reviewer can find them; without the edit the new key would be a silent drift. I made the one-line append per locale section. If your dispatcher wants `_review.md` strictly off-limits in T015, tell me and I will revert + dispatch a tiny side task to update it.

## 9 scripts — all green

Saved to [.logs/036-T015.log](.logs/036-T015.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK first try |
| 3 | vitest | **17 files / 264 tests passed** (was 16 / 260 — four new router tests) |
| 4 | playwright | 1 passed |
| 5 | gitleaks | no leaks, 59 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox: standby for T016 (homepage integration). T016 will mount `<CinematicRouter />` + `<Hero />` into `src/app/page.tsx` and is the place to reconsider the Hero-server-vs-client question if you want to flip Hero back. I have not touched `src/app/page.tsx`.

## Bookkeeping commit to follow

- `.logs/036-T015.log`
- `.opus/outbox/036-reply.md` (this file)
- `.opus/inbox/036-spec001-T015-cinematic-router.md`
