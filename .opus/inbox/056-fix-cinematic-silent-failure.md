# Task 056 — Diagnose + fix silent CinematicRouter failure

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Priority:** P0 — still blocks PR #15 (055 fixed Sentry but page still blank)
**Branch:** `fix/056-cinematic-silent-failure` off `fix/055-sentry-dsn-vercel`

## Symptom

Deployed preview still renders black page with only the SkipLink button + a blue dot. Hero never appears. Opus verified via Chrome MCP on deployment `dpl_CFfDwFRDBsgKXw1cfftVnRJte1BZ` after task 055 fixed the Sentry DSN. Zero Sentry envelopes in flight — Sentry was a red herring for this bug.

## Root-cause hypothesis

`src/components/cursor/cinematic-router.tsx` dynamically imports `./earth-scene-dynamic` and `./cinematic-intro-mobile` with:
- `{ ssr: false, loading: () => null }`
- **no error boundary wrapping either subtree**

If `earth-scene-dynamic` throws on import or on first render in a production/turbopack build, the user sees nothing, console sees nothing, Sentry sees nothing. Classic silent swallow.

Likely culprits, in order:
1. three.js r128 + Next 16 + turbopack incompatibility (dynamic import chunk format)
2. GSAP / ScrollTrigger module reading `window` at module top level instead of inside useEffect
3. A named-export vs default-export mismatch surfaced only after minification

## Diagnostic step 0 — confirm Sentry is alive (do this FIRST)

Chainbeard checked the blueprint Sentry project UI: zero events received, still showing the "Get Started" onboarding screen. That means either (A) Sentry SDK isn't initializing at all in the browser, or (B) the silent `next/dynamic` failure never throws so there's nothing for Sentry to catch. Disambiguate before any other fix:

1. Add a query-param-gated test throw in `instrumentation-client.ts` (or equivalent Sentry browser init file):
   ```ts
   if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("sentrytest")) {
     setTimeout(() => { throw new Error("sentry-smoke-test-056"); }, 500);
   }
   ```
2. Deploy to preview.
3. Open `<preview>/en?sentrytest=1` in Chrome. Wait 60 seconds.
4. Check Sentry UI (https://wmpiew.sentry.io/issues/?project=4511179806736464) for the `sentry-smoke-test-056` issue.
5. Record result in reply:
   - **Landed in Sentry:** case B — Sentry is fine, the real bug is the silent dynamic import failure. Remove the test throw. Proceed to fix section below.
   - **Did NOT land in Sentry:** case A — Sentry init is broken or not running. Root-cause Sentry first (check if `instrumentation-client.ts` is even being loaded, check browser network tab for any request to `*.ingest.de.sentry.io`, verify env vars propagated). Fix Sentry, re-run smoke test, THEN proceed to fix section below.

## Fix (one PR, small)

1. In `cinematic-router.tsx`, wrap both `<CinematicIntro />` and `<CinematicIntroMobile />` in a React error boundary that, on catch:
   - Renders `<Hero />` as fallback (same as reduced-motion + skip paths)
   - Calls `Sentry.captureException(err, { tags: { component: "cinematic-intro" } })`
   - Calls `track("cinematic_crashed")`
2. Change `loading: () => null` to `loading: () => <Hero />` for both dynamic imports so the hero is always visible while the heavy scene is loading. If the scene ever mounts successfully it replaces the hero; if it never does, the user still sees the product.
3. Add a `try/catch` inside each `dynamic(async () => ...)` loader that logs to console+Sentry and re-throws so the error boundary catches it.
4. `npm run build && npm run start`, then curl localhost:3000/en and confirm hero text is in the post-hydration HTML via a headless check (puppeteer or playwright-core one-shot script committed to `scripts/check-deployed-preview.sh`).
5. `scripts/check-deployed-preview.sh` becomes the 10th non-negotiable script. Wire into `.github/workflows/ci.yml` as a post-deploy step that hits the Vercel preview URL for the current commit and asserts hero text renders in the real DOM (headless chromium via `npx playwright-core`). This is the guardrail that would have caught today's failure on task 017.
6. `.logs/056.log` with all command output.
7. `.opus/outbox/056-reply.md` with: the actual root cause discovered (not just the hypothesis), the fix commit SHAs, the new Vercel deployment ID and URL, headless-check output showing hero text in the live DOM.

## Verification rule

Do NOT mark this done by grep on served HTML. Opus will re-verify in Chrome MCP via accessibility tree read post-hydration. The new 10th script must also pass in CI before PR is considered mergeable.

## Out of scope

- Redesigning the earth-scene
- Changing three.js version (unless root cause points directly at it)
- Opening/closing PR #15 (Chainbeard action after 056 is green)
