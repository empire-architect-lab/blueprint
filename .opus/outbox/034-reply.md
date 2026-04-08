## Task 034 — Spec 001 / T013 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `e8bb97d` — `feat(hero): t013 hero component per spec 001`

## What shipped

- `src/components/hero/hero.tsx` — `<Hero />` component with `data-spec-id="001-the-cursor"` on the root `<section>`. Renders the `font-display text-[220px] leading-none` `<h1>` from i18n key `hero.headline` and the `font-mono text-[18px]` `<p>` from `hero.metadata` interpolating `sha`, `specs`, `tasks`, `lies` from `BUILD_METADATA` (compile-time, imported from `@/content/build-metadata`) plus the head-commit `shortSha` fetched at runtime. Mounts `<ReplayButton />` in the bottom-right (`absolute bottom-6 right-6 z-50`) inside the section.
- `src/components/hero/replay-button.tsx` — client component, dispatches a `blueprint:cinematic-replay` `CustomEvent` on click. `aria-label` from `cursor.replayLabel` (existing key, reused so we don't double-translate). `focus-visible:ring-2` for the visible focus ring per the existing pattern. Exports the event-name constant so future T015 wiring can import it instead of stringly-typing.
- `tests/unit/hero.test.tsx` — renders `<Hero />` inside a `NextIntlClientProvider` with the real `messages/en.json`, mocks `BUILD_METADATA` (`shortSha = "abcdef1"`, `specCount = 7`, `taskCount = 42`, `lieCount = 0`) and `global.fetch` to return a stubbed `/api/head-commit` response. Asserts (a) the root has `data-spec-id="001-the-cursor"`, (b) the `h1` text is `"Built by the process it teaches."`, (c) `h1.className` contains `font-display` and `text-[220px]`, (d) the metadata `<p>` text is exactly `"commit abcdef1 · 7 specs · 42 tasks · 0 lies"` after the fetch resolves (`waitFor` + `findByText`). The mocked-`BUILD_METADATA` + stubbed-fetch coverage is exactly what the inbox required.
- `src/app/[locale]/earth-preview/page.tsx` — imports `Hero`, adds `heroVisible` state, listens for `CINEMATIC_COMPLETE_EVENT`, and on receipt sets `heroVisible = true`. The hero renders below the spacer when visible. The previous no-op `onComplete` placeholder is replaced.
- `messages/{en,fr,ar,nl}.json` — the `hero.headline` and `hero.metadata` keys were already present from T004 (correctly stubbed to English), so no edits were necessary in this task. `check-i18n.sh` confirms parity.
- `specs/001-the-cursor/tasks.md` — all 7 T013 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/components/hero/hero.tsx` | new ✅ |
| `src/components/hero/replay-button.tsx` | new ✅ |
| `messages/{en,fr,ar,nl}.json` | not edited (keys already in place from T004) — flagged below |
| `src/app/[locale]/earth-preview/page.tsx` | edited ✅ |
| `tests/unit/hero.test.tsx` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

T014+ files untouched.

## ⚠ Deviation from spec — Hero is a client component, not a server component

The spec line and the inbox both say `<Hero />` should be a server component that does an `await fetch("/api/head-commit")` server-side. I shipped it as a `"use client"` component that does the fetch in `useEffect` and falls back to `FALLBACK_COMMIT` on failure. **Why:** the inbox requires me to mount `<Hero />` from inside `src/app/[locale]/earth-preview/page.tsx`, which is itself a client component (it owns the Lenis + ScrollTrigger lifecycle and the `useState` for `litIndex`/`heroVisible`/refs). React does not let an async server component be rendered as a child of a client component except as a passed-in `children` slot from a server parent — and the whitelist forbids creating a new wrapper file, the homepage root, or a router (those belong to T015/T016). The cleanest options were:

1. Keep Hero server, add a server "hero island" file → blocked by whitelist.
2. Make the preview page a server component → impossible, it owns client-only hooks (Lenis/ScrollTrigger/refs).
3. Make Hero a client component now, rewrite to a server component in T016 when the homepage root is added.

I went with (3) and used `BUILD_METADATA` at module scope (still compile-time) + a `useEffect` fetch + same fallback semantics. **Functionally identical from the user's POV; only the runtime is different.** The unit test still passes, the same i18n keys are used, the same data-spec-id is on the root, the same Tailwind classes are applied. T016 (or whichever task scaffolds the real homepage root) will need to either (a) flip this back to a server component once it can be rendered from a server parent, or (b) explicitly accept the client-component runtime. Let me know which way you want it and I'll do the swap in the relevant task.

## i18n note

The `hero.headline` and `hero.metadata` keys were stubbed to English in all four locales back in T004, so this task didn't need to touch `messages/*.json`. `check-i18n.sh` is green. The English copy is canonical (`"Built by the process it teaches."` and `"commit {sha} · {specs} specs · {tasks} tasks · {lies} lies"`); fr/ar/nl currently mirror English and are still tracked in `messages/_review.md` from T004 for human translation later.

## 9 scripts — all green

Saved to [.logs/034-T013.log](.logs/034-T013.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK first try |
| 3 | vitest | **15 files / 258 tests passed** (was 14 / 257 — one new hero test) |
| 4 | playwright | 1 passed |
| 5 | gitleaks | no leaks, 55 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox: standing by for T014 dispatch. T014 (mobile 2D version) will need its own inbox before I touch any of `cinematic-intro-mobile.tsx`, mobile chunk verification, etc.

## Bookkeeping commit to follow

- `.logs/034-T013.log`
- `.opus/outbox/034-reply.md` (this file)
- `.opus/inbox/034-spec001-T013-hero.md`
