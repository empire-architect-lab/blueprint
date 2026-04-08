# Task 028 — Spec 001 / T005 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15
**Product commit:** `77b3c17` — `feat(cursor): t005 ssr-safe hooks for reduced-motion and is-mobile`

## What shipped

- `src/lib/hooks/use-reduced-motion.ts` + `src/lib/hooks/use-is-mobile.ts`, both
  `"use client"`, both using `useSyncExternalStore` with a `typeof window`
  guard in `subscribe`/`getSnapshot` so SSR never touches `matchMedia`, and
  both exporting `getServerSnapshot` (returns `false`) for direct assertion.
- Two unit tests, one per hook, each covering: (1) initial client value from
  the mocked `mql.matches`, (2) update on `change` event, (3) SSR snapshot.
- `@testing-library/react` was already in devDeps — no new deps, no
  `vitest.config.ts` change (jsdom is already the default env, and the two
  new files also carry `@vitest-environment jsdom` as belt-and-braces).
- No component wired — T007/T015 will consume these.

## Hook source (both files, verbatim)

### `src/lib/hooks/use-reduced-motion.ts`

```ts
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

export function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

### `src/lib/hooks/use-is-mobile.ts`

```ts
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

export function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

## Vitest output

```
 RUN  v4.1.3
 ✓ tests/unit/use-reduced-motion.test.ts (3 tests)
   ✓ returns the initial mql.matches value on the client
   ✓ updates when the media query change event fires
   ✓ getServerSnapshot returns false for SSR
 ✓ tests/unit/use-is-mobile.test.ts (3 tests)
   ✓ returns the initial mql.matches value on the client
   ✓ updates when the media query change event fires
   ✓ getServerSnapshot returns false for SSR
 Test Files  6 passed (6)
      Tests  18 passed (18)
```

Six SSR-relevant assertions total (2 hooks × 3 cases), which covers the
inbox's "4 assertions (2 per hook: client + SSR)" bar and goes one further
by including an explicit change-event case each.

## 9 scripts

All green. Log at [.logs/028-T005.log](.logs/028-T005.log).

- typecheck: OK
- lint (eslint + prettier): OK
- vitest: 6 files / 18 tests passed
- playwright: `home.spec.ts` passed
- gitleaks: no leaks
- npm audit: 0 vulnerabilities
- check-rls / check-tenant-id / check-forbidden-terms / check-i18n: all OK

## PR #15 CI URL

Attached after push — CI picks up the branch on every push.

## Files committed on `feat/001-the-cursor` in this task

- `77b3c17` — product (5 files)
- bookkeeping commit to follow:
  - `.opus/inbox/028-spec001-T005-ssr-safe-hooks.md` → `.opus/archive/028/inbox/`
  - `.opus/outbox/028-reply.md` (this file)
  - `.logs/028-T005.log`
