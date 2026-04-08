## Task 035 — Spec 001 / T014 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `f354158` — `feat(cursor): t014 mobile 2d cinematic per spec 001`

## What shipped

- `src/components/cursor/cinematic-intro-mobile.tsx` — `<CinematicIntroMobile />` client component, four beats driven by a single `beat: "typer" | "map" | "pipeline" | "hero"` `useState`. Beat 1 reuses `<TerminalTyper />` from T007 with `cursor.typedCommand` and `charDelayMs={50}`; on `onComplete` it advances to `map`. Beat 2 renders an inline SVG `viewBox="0 0 460 200"` containing a simplified Mercator silhouette `<path>` (~1KB inline string, no `<img>` / network) and a `<circle>` at the Casablanca pixel position with a SVG SMIL `<animate>` pulsing `r` from 4 → 7 → 4. Beat 3 renders a vertical `<ul>` mapped over `PIPELINE_NODES` (8 items, imported from `@/lib/constants/pipeline-nodes` so the labels stay verbatim and DRY with the desktop pipeline scene); a 350ms `setInterval` walks `litIndex` through the array, lighting each label, and on completion advances to `hero` after a 400ms tail. Beat 4 returns `<Hero />` (the same component T013 shipped), so the mobile-vs-desktop hero is literally identical. Skip buttons appear on the typer and map beats, both wired to advance the beat directly.
- **No Three.js in the transitive graph.** This module imports: `react`, `next-intl`, `./terminal-typer` (no three), `@/components/hero/hero` (no three — uses `BUILD_METADATA` + `fetch`), `@/lib/constants/pipeline-nodes` (a tuple constant). Confirmed by `Grep three|@react-three src/components/cursor/cinematic-intro-mobile.tsx` returning only the in-file *comment* warning future editors not to import three. Same `Grep` against `src/components/hero/hero.tsx` and `src/components/cursor/terminal-typer.tsx` returns zero matches. **Bundle-analyzer note:** the inbox asked for an analyzer grep, but the existing repo does not have `@next/bundle-analyzer` wired (T020 is the task that installs it). I did not add it here because the whitelist forbids `package.json` edits and the dev-dep install would violate the "do NOT touch T020 files" rule. The static-import grep above is the strongest proof I can give without crossing the whitelist; T020 will produce the actual `analyzer.html` artifact.
- `src/components/cursor/use-is-mobile.ts` — thin re-export of the canonical `useIsMobile` hook from `@/lib/hooks/use-is-mobile`. The whitelist asked for `src/components/cursor/use-is-mobile.ts` ("new or extend if exists"); the canonical hook from T005 lives in `src/lib/hooks/`, so I exposed a sibling re-export at the path the inbox specified instead of duplicating the implementation. Same `useSyncExternalStore` + `matchMedia("(max-width: 767px)")` semantics, SSR returns `false`. The dynamic-import gate (a future caller that does `if (useIsMobile()) <CinematicIntroMobile />`) belongs to T015 (`CinematicRouter`), so the mobile component itself does not gate on the hook — that wiring is a router concern. T015 will import either path and get the same hook.
- `tests/unit/cinematic-intro-mobile.test.tsx` — two checks under `NextIntlClientProvider` with the real `messages/en.json`: (1) the component mounts and (with reduced motion shimmed via `matchMedia` returning `true`) the typer instantly completes so the SVG appears + the skip button text is the i18n string; (2) clicking the skip button advances to the pipeline beat where exactly 8 `<li data-lit>` rows render. `global.fetch` is shimmed for the eventual hero mount.
- `specs/001-the-cursor/tasks.md` — all 6 T014 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/components/cursor/cinematic-intro-mobile.tsx` | new ✅ |
| `src/components/cursor/use-is-mobile.ts` | new (re-export of canonical hook) ✅ |
| `src/app/[locale]/earth-preview/page.tsx` | not edited (the existing desktop preview page is fine; the inbox said "edit only if needed for manual test", and I did not need to) |
| `tests/unit/cinematic-intro-mobile.test.tsx` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

T013/T015/T016 files untouched. `<Hero />` not modified per the carry-forward instruction.

## iPhone 12 DevTools walkthrough (manual, no automation)

Local `npm run dev`, opened `/en/earth-preview` in Chrome DevTools at iPhone 12 (390×844, DPR 3) with throttling off. The desktop earth preview still mounts on that route (the mobile component is not yet routed — that's T015). The mobile component was instead exercised via the unit test above; a follow-up manual smoke once T015 lands the router will complete the visual confirmation. **Flagging this as a soft pass:** the inbox asked for a DevTools iPhone 12 viewport walkthrough, but without a router or homepage root I cannot mount `<CinematicIntroMobile />` from a route. Two options: (a) accept this static + unit-test proof and let T015 produce the visual confirmation, or (b) dispatch a tiny side task that drops a temporary `/en/mobile-preview` route (not on the T014 whitelist). I went with (a). Tell me if you want (b).

## 9 scripts — all green

Saved to [.logs/035-T014.log](.logs/035-T014.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK first try |
| 3 | vitest | **16 files / 260 tests passed** (was 15 / 258 — two new mobile-cinematic tests) |
| 4 | playwright | 1 passed |
| 5 | gitleaks | no leaks, 57 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox: standby for T015 dispatch. T015 (`CinematicRouter`) is the natural next step — it will be the thing that does `useIsMobile() ? <CinematicIntroMobile /> : <CinematicIntro />` and listens for the skip/complete/replay events.

## Bookkeeping commit to follow

- `.logs/035-T014.log`
- `.opus/outbox/035-reply.md` (this file)
- `.opus/inbox/035-spec001-T014-mobile-2d.md`
