# Task 028 — Spec 001 / T005 — SSR-safe hooks

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue — commits feed rolling draft PR #15)
**Depends on:** T004 (task 027) — DONE.

## Context
Spec 001 / T005 from `specs/001-the-cursor/tasks.md`. Two React hooks that the cinematic router and components will consume to decide behavior at runtime. Both MUST be safe to call during Next.js server-side rendering (where `window` and `matchMedia` do not exist), and must update correctly on the client after hydration. The standard pattern for this is `useSyncExternalStore`.

## Scope (T005 checkbox list, verbatim)
1. `src/lib/hooks/use-reduced-motion.ts`:
   - Uses `useSyncExternalStore` with `matchMedia("(prefers-reduced-motion: reduce)")`
   - `getSnapshot` returns `mql.matches`
   - `getServerSnapshot` returns `false` (SSR default)
   - `subscribe` attaches `change` listener, returns cleanup
   - Guards against `typeof window === "undefined"` in subscribe so SSR never throws
2. `src/lib/hooks/use-is-mobile.ts`:
   - Same pattern, query is `"(max-width: 767px)"`
   - `getServerSnapshot` returns `false`
3. `tests/unit/use-reduced-motion.test.ts`:
   - Use vitest + `@testing-library/react` + jsdom environment
   - Mock `window.matchMedia` to control `matches` and dispatch `change`
   - Assert: initial render matches mock, `change` event updates, SSR snapshot is `false` (call `getServerSnapshot` directly or use `renderToString`)
4. `tests/unit/use-is-mobile.test.ts` — same structure
5. Both unit tests green
6. Tick T005 boxes in `specs/001-the-cursor/tasks.md` in the same commit (Principle 10)

## Constraints
- Both hooks must be **client-only** (`"use client"` directive at the top of each file). Consumers will be client components.
- Do NOT install new dependencies. `@testing-library/react` may already be in devDeps — check `package.json` first; if missing, adding it is allowed (it's test infra, same spirit as the vitest.config change in 025).
- Do NOT wire these into any component yet. That happens in T007+ (terminal typer) and T015 (router). T005 is pure primitives + tests.

## Whitelist
- `src/lib/hooks/use-reduced-motion.ts` (new)
- `src/lib/hooks/use-is-mobile.ts` (new)
- `tests/unit/use-reduced-motion.test.ts` (new)
- `tests/unit/use-is-mobile.test.ts` (new)
- `package.json` + `package-lock.json` — ONLY if `@testing-library/react` needs installing
- `vitest.config.ts` — ONLY if the jsdom environment needs wiring for these test files specifically
- `specs/001-the-cursor/tasks.md` (T005 checkboxes only)
- `.opus/inbox/028-*.md`, `.opus/outbox/028-reply.md`, `.logs/028-T005.log`, `.opus/archive/028/**`

## Done when
- Both hooks exported, both tests green, including the SSR-snapshot assertion
- `check-forbidden-terms.sh` passes (no `console.log`, no `@ts-ignore`)
- 9 scripts green, log at `.logs/028-T005.log`
- Commits pushed to `feat/001-the-cursor`, PR #15 CI green
- `028-reply.md` includes: paste of both hook file contents (they're tiny), vitest output showing the 4 assertions (2 per hook: client + SSR), PR #15 CI run URL
- Bookkeeping committed on the same branch per Rule 1
