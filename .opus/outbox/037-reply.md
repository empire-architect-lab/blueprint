## Task 037 — Spec 001 / T016 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `8720036` — `feat(home): t016 homepage mounts cinematic router`

## What shipped

- `src/app/page.tsx` — new server component. Exports `metadata = { title: "Blueprint Lab", description: "The practice dashboard built by the spec-driven process it teaches." }` and a default `HomePage` function returning `<main className="min-h-screen bg-black text-white"><CinematicRouter /></main>`. Per the inbox's explicit override of the spec line, `<Hero />` is **not** also rendered here — `CinematicRouter` already owns hero rendering for every branch (reduced-motion, skip, complete, mobile-hero handoff). Rendering `<Hero />` a second time at the page level would double-mount it.
- `tests/unit/page.test.tsx` — two checks. (1) Mocks `@/components/cursor/cinematic-router` to a stub div, dynamically `import("@/app/page")`, renders `<HomePage />`, asserts the `<main>` exists and its `className` contains `min-h-screen bg-black text-white`, and asserts the router-stub mounted inside it. (2) Asserts the exported `metadata.title === "Blueprint Lab"` and `typeof metadata.description === "string"`.
- `specs/001-the-cursor/tasks.md` — all 4 T016 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/app/page.tsx` | new ✅ |
| `tests/unit/page.test.tsx` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

`cinematic-router.tsx`, `hero.tsx`, layouts, metadata files outside `page.tsx` — all untouched.

## ⚠ Two things to flag

### 1. Routing reality vs. the inbox path

This repo's routing is locale-prefixed via `next-intl`. The middleware at `src/middleware.ts` matches `/((?!api|trpc|_next|_vercel|.*\\..*).*)` and `createMiddleware(routing)` redirects `/` → `/en` (or whichever default locale is configured). So a `src/app/page.tsx` written at the literal root will be **shadowed at runtime by the locale redirect** — Next never gets to render it for an actual `/` request because the middleware rewrites the URL first. The actual locale homepage that users land on is `src/app/[locale]/page.tsx`, which I left untouched (it's still the placeholder T002 page rendering `home.title`).

I shipped exactly what the inbox whitelist asked for: `src/app/page.tsx`. But if you actually want the cinematic router to mount when a user visits the site, the file needs to live at `src/app/[locale]/page.tsx` — and that path is **not** on the T016 whitelist. Two ways to handle this:

- **(a)** Dispatch a tiny side task whose whitelist is `src/app/[locale]/page.tsx` so the same body can be moved over, and either delete this `src/app/page.tsx` or leave it as a no-op fallback.
- **(b)** Rewire the next-intl routing to expose a non-prefixed root (`localePrefix: "as-needed"` or `"never"`) so `src/app/page.tsx` becomes the actual entry. This is a bigger architectural change and probably belongs in its own spec.

I went with the literal-whitelist interpretation (option neither — just shipped what the inbox said) so I do not violate the file boundary. Tell me which way you want to resolve it.

### 2. The "Playwright check `/` returns 200 + contains `<main>`" requirement

The inbox said the manual 4-path walkthrough is replaced by *"existing T012/T015 unit tests + a new minimal Playwright check that `/` returns 200 and contains `<main>`."* The existing `e2e/home.spec.ts` already navigates to `/en` (the locale-redirected URL), asserts a level-1 heading is visible, and runs an axe scan — that **functionally** covers the request, but it hits `/en` not `/`, and it asserts a heading not a `<main>`. The e2e file is **not on the whitelist** for this task, so I did not edit it. The new unit test in `tests/unit/page.test.tsx` covers the `<main>` assertion at the unit level (mocked router, jsdom render). If you want a literal Playwright `goto("/")` check, dispatch it with `e2e/home.spec.ts` on the whitelist and I will add it.

## 9 scripts — all green

Saved to [.logs/037-T016.log](.logs/037-T016.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK first try |
| 3 | vitest | **18 files / 266 tests passed** (was 17 / 264 — two new homepage tests) |
| 4 | playwright | 1 passed (existing `/en` smoke + axe) |
| 5 | gitleaks | no leaks, 61 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox: standby for T017 (observability — Plausible events + Sentry sanity check). I have not touched any T017 files.

## Bookkeeping commit to follow

- `.logs/037-T016.log`
- `.opus/outbox/037-reply.md` (this file)
- `.opus/inbox/037-spec001-T016-homepage.md`
