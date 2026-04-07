# Tasks 001 — The Cursor

**Spec:** `specs/001-the-cursor/spec.md`
**Plan:** `specs/001-the-cursor/plan.md`
**Owner:** Code Agent
**Dispatcher:** Cowork Opus
**Implementation branch:** `feat/001-the-cursor` (not this branch — this is planning only)
**Status:** draft — awaiting Opus approval before any task below is executed

---

## Definition of done

All boxes below checked in the same commits that implement them (Principle 10). All 9 foundation scripts green on CI. All 5 Playwright scenarios (A–E from `spec.md`) green. Lighthouse targets hit per NFR-2. Opus verifies the Vercel preview and says "wow" per ROADMAP.

---

## T001 — Scaffold deps and fonts

- [x] `npm install three@^0.163 @react-three/fiber@^9 @react-three/drei@^10 zustand@^5`
- [x] `npm install -D tsx@^4`
- [x] Verify `gsap`, `@gsap/react`, `lenis`, `framer-motion`, `next-intl` already present (`npm ls` each)
- [x] Download Cabinet Grotesk Variable, JetBrains Mono (Regular weight; variable woff2 not distributed by JetBrains), Switzer Variable from Fontshare/JetBrains; vendor the woff2 files to `public/fonts/`
- [x] Create `src/styles/fonts.ts` using `next/font/local` declaring all three families with CSS variable names `--font-display`, `--font-mono`, `--font-body`
- [x] Update `src/app/[locale]/layout.tsx` to apply the three CSS variables to `<html>`
- [x] Register font families in Tailwind 4 `@theme inline` block in `src/app/globals.css` (no `tailwind.config.ts` exists in Tailwind 4 setup — see plan)
- [x] All 9 foundation scripts green (typecheck, lint, vitest, playwright, gitleaks, audit, rls, tenant, forbidden, i18n) — see `.logs/017-t001.log`

## T002 — Build-time metadata pipeline

- [x] Create `scripts/collect-build-metadata.ts` per plan: reads git + specs + tasks, writes `src/content/build-metadata.ts` and `src/content/fallback-commit.ts`
- [x] Add `"prebuild": "tsx scripts/collect-build-metadata.ts"` to `package.json`
- [x] Add `src/content/` to `.gitignore`
- [x] Run `npm run build` locally; verify both generated files exist, shape is `{ sha, shortSha, specCount, taskCount, lieCount: 0 }` and `{ sha, shortSha, message }`
- [x] Write unit test for the collector script: mock filesystem, assert counts are correct
- [x] Unit test green

## T003 — Edge route handler for HEAD commit

- [x] Create `src/app/api/head-commit/route.ts` with `runtime = "edge"`, `revalidate = 60`, GET handler per plan FR-1/FR-9
- [x] On fetch success: return `{ sha, shortSha, message: truncate(message, 72), source: "github" }`
- [x] On any non-2xx or thrown error: read `FALLBACK_COMMIT` from `src/content/fallback-commit.ts`, return with `source: "fallback"`
- [x] `truncate` helper handles Unicode safely (use `[...str]` spread, not `.length`)
- [x] Write unit test `tests/unit/head-commit-fallback.test.ts`: mock fetch to throw, assert fallback shape is returned
- [x] Manually hit `http://localhost:3000/api/head-commit` in dev: 200 with live data; disconnect network and hit again: 200 with fallback
- [x] Unit test green

## T004 — i18n strings and next-intl wiring for M1 (en/fr/ar/nl)

- [x] Verify `next-intl` middleware is already configured from foundation T007 for all four locales (`en`, `fr`, `ar`, `nl`); wire any missing locale minimally
- [x] Add new `cursor.*` and `hero.*` namespaces to `messages/en.json` with all visitor-facing strings from `spec.md` (typed command, skip label, replay label, reduced-motion subtitle, hero headline, metadata format string). English is human-written and canonical.
- [x] Add the same keys to `messages/fr.json`, `messages/ar.json`, `messages/nl.json` as stub translations. Literal English copy is an acceptable stub. Every key must exist in every locale file or `scripts/check-i18n.sh` will fail.
- [x] Create or append to `messages/_review.md` listing every stubbed key per locale (format: `## fr` / `- cursor.skipLabel` etc.) so a human reviewer can find them later
- [x] RTL spot check: confirm `ar` renders right-to-left in dev (`<html dir="rtl">` when locale is `ar`) even with stub strings
- [x] Run `scripts/check-i18n.sh` — must pass (no hardcoded English in any new component, all keys present in all four locales)

## T005 — SSR-safe hooks

- [x] `src/lib/hooks/use-reduced-motion.ts` — `useSyncExternalStore` + `matchMedia("(prefers-reduced-motion: reduce)")`, SSR returns `false`
- [x] `src/lib/hooks/use-is-mobile.ts` — same pattern with `matchMedia("(max-width: 767px)")`, SSR returns `false`
- [x] Unit tests for both hooks asserting SSR return value and client update behavior
- [x] Unit tests green

## T006 — State machine

- [x] `src/lib/animations/cursor-state.ts` — reducer with states from `plan.md` state-machine diagram
- [x] Actions: `TICK_TYPING`, `START_PAUSE_1`, `PRESS_ENTER`, `REVEAL_COMMIT`, `START_DISSOLVE`, `EARTH_READY`, `PIPELINE_PROGRESS(n)`, `TRIGGER_FLASH`, `REVEAL_HERO`, `SKIP`, `REPLAY`
- [x] Reducer enforces legal transitions; illegal transitions throw in dev, no-op in prod
- [x] Unit tests `tests/unit/cursor-state.test.ts` cover: every legal transition, every illegal transition, SKIP from every state, REPLAY only from HERO_REVEALED
- [x] Unit tests green

## T007 — Terminal typer component

- [x] `src/components/cursor/terminal-typer.tsx` — client component
- [x] Props: `command: string`, `charDelayMs: number`, `onComplete: () => void`
- [x] Renders a `<pre>` with a blinking caret; uses `useEffect` + `setInterval` to emit characters; calls `onComplete` at the end
- [x] Respects `useReducedMotion` — if reduced, calls `onComplete` immediately with no typing
- [x] Unit test (vitest + @testing-library/react): advance fake timers, assert characters appear, assert `onComplete` fires
- [x] Unit test green

## T008 — Skip link + replay button

- [x] `src/components/cursor/skip-link.tsx` — fixed bottom-right anchor, aria-label from i18n, activates on Enter and click, dispatches a custom `blueprint:cinematic-skip` event
- [x] `src/components/cursor/replay-button.tsx` — same positioning inside the hero, dispatches `blueprint:cinematic-replay` event
- [x] Both pass axe-core in isolation (Storybook not required; a `tests/unit/*-a11y.test.ts` vitest + jsdom + axe check is sufficient)
- [x] Both have visible focus rings (Tailwind `focus-visible:ring-2`)
- [x] Unit + a11y tests green

## T009 — Earth scene (Three.js)

- [x] `src/components/cursor/earth-scene.tsx` — client component, wraps `<Canvas>` from `@react-three/fiber`, sets up camera + lighting + ambient
- [x] `src/components/cursor/earth.tsx` — wireframe sphere geometry (IcosahedronGeometry 32 subdivisions, MeshBasicMaterial wireframe), radius 2
- [x] Casablanca dot at (33.5731, -7.5898) rendered as a glowing Sphere with Emissive material
- [x] Helper `latLngToXYZ(lat, lng, radius)` in `src/lib/three/geo.ts` with unit test
- [x] Dynamic import with `ssr: false` from the parent component
- [x] Canvas has `aria-hidden="true"`, wrapper div has `data-role="earth"`
- [x] Unit test for `latLngToXYZ` green

## T010 — Particle dissolve system

- [ ] `src/components/cursor/particles.tsx` — `BufferGeometry` with ~3000 points, custom shader for glow
- [ ] Exposes two animation functions: `dissolveFromTerminal()` and `reformAsEarth()`
- [ ] Integrates with the master GSAP timeline via callbacks (not GSAP on the particle object directly — use GSAP to tween a progress uniform `uProgress` from 0 → 1)
- [ ] Visual confirmation on localhost: triggers on a dev-only keypress (`d` dissolves, `r` reforms) behind `process.env.NODE_ENV === "development"`

## T011 — Pipeline scene + scroll flythrough

- [ ] Create `src/lib/constants/pipeline-nodes.ts` with `export const PIPELINE_NODES = ['SPECIFY','PLAN','TASKS','IMPLEMENT','PR','CI','PREVIEW','DEPLOY'] as const;` (verbatim, exempt from i18n per spec answer 3)
- [ ] `src/components/cursor/pipeline-scene.tsx` — a column of 8 `<PipelineNode />` positioned at increasing Y; imports labels from `@/lib/constants/pipeline-nodes` and maps over `PIPELINE_NODES`. No inline node-label strings in this component.
- [ ] `src/components/cursor/pipeline-node.tsx` — glowing torus + billboarded text label (from drei `<Text />`); receives label as a prop, never hardcodes one
- [ ] 8th node replaces torus with a Vercel logo (imported SVG, extruded via `SVGLoader` + `ExtrudeGeometry`)
- [ ] `src/lib/animations/cursor-scroll-timeline.ts` — ScrollTrigger timeline that scrubs camera Y position and lights each node at the right progress percentage
- [ ] Lenis integration: `lenis.on('scroll', ScrollTrigger.update)` + `ScrollTrigger.scrollerProxy` setup
- [ ] Visual confirmation on localhost: scrolling flies the camera through the 8 nodes

## T012 — White flash + hero reveal handoff

- [ ] `src/components/cursor/white-flash.tsx` — full-viewport `<div>` that fades in/out over 120ms total (60 in, 60 out) using GSAP
- [ ] Triggered by the ScrollTrigger when the camera passes the Vercel node (progress ≥ ~0.95)
- [ ] On flash end, dispatches `blueprint:cinematic-complete` event; the `CinematicRouter` listens and unmounts the cinematic, revealing the hero

## T013 — Hero component

- [ ] `src/components/hero/hero.tsx` — server component
- [ ] Reads `BUILD_METADATA` from `src/content/build-metadata.ts`
- [ ] Reads head commit via server fetch to `/api/head-commit` (Next fetch cache will hit the same 60s revalidate)
- [ ] Renders `<h1 className="font-display text-[220px] leading-none">` with the i18n key `hero.headline`
- [ ] Renders `<p className="font-mono text-[18px]">` with the i18n key `hero.metadata` interpolating sha, specs, tasks, lies
- [ ] Contains the `<ReplayButton />` in the bottom-right corner
- [ ] Has `data-spec-id="001-the-cursor"` on the root element (future hook for Spec 005)

## T014 — Mobile 2D version

- [ ] `src/components/cursor/cinematic-intro-mobile.tsx` — client component, dynamically imported, only mounts when `useIsMobile() === true`
- [ ] Beat 1: same `<TerminalTyper />` component reused
- [ ] Beat 2: inline SVG world map (a simplified Mercator path, ~3KB) with a `<circle>` at Casablanca animated with `<animate>` or CSS `@keyframes`
- [ ] Beat 3: vertical scroll-driven list of 8 pipeline labels; CSS `scroll-timeline` or Intersection Observer to light each up
- [ ] Beat 4: hero revealed exactly the same way as desktop (reuse `<Hero />` component)
- [ ] No Three.js import anywhere in this component's transitive graph — verified via `@next/bundle-analyzer` that the mobile chunk doesn't contain three
- [ ] Visual confirmation on a DevTools iPhone 12 viewport

## T015 — CinematicRouter orchestrator

- [ ] `src/components/cursor/cinematic-router.tsx` — client component
- [ ] Reads `useReducedMotion()` and `useIsMobile()`
- [ ] If reduced motion OR JS disabled path: renders `<Hero />` only, plus the "Cinematic intro disabled per your motion preferences." subtitle
- [ ] If mobile + motion: dynamic imports `<CinematicIntroMobile />`
- [ ] If desktop + motion: dynamic imports `<CinematicIntro />`
- [ ] Listens for `blueprint:cinematic-skip` and `blueprint:cinematic-complete` events and swaps to `<Hero />`
- [ ] Listens for `blueprint:cinematic-replay` from the hero and re-mounts the cinematic

## T016 — Homepage integration

- [ ] `src/app/page.tsx` — replace Next's default template
- [ ] Renders `<main className="min-h-screen bg-black text-white">` containing `<CinematicRouter />` and `<Hero />` (the router decides which is visible)
- [ ] Set page metadata: title "Blueprint Lab", description per ROADMAP pitch
- [ ] `npm run dev` and manually walk through all 4 paths: desktop motion on, desktop reduced motion, mobile motion on, JS disabled in DevTools

## T017 — Observability wiring

- [ ] In `<CinematicRouter />`, fire Plausible event `cinematic_completed` on hero reveal, `cinematic_skipped` on skip
- [ ] Confirm Sentry is capturing errors — throw a test error inside `<CinematicIntro />` in dev behind a keypress `e`, verify it appears in the Sentry dashboard, remove the throw
- [ ] No PII in either event payload (reviewed manually)

## T018 — E2E tests (Playwright) — all 5 scenarios

- [ ] `tests/e2e/cursor-happy-path.spec.ts` — Scenario A from `spec.md`
- [ ] `tests/e2e/cursor-reduced-motion.spec.ts` — Scenario B; use Playwright `emulateMedia({ reducedMotion: 'reduce' })`
- [ ] `tests/e2e/cursor-skip.spec.ts` — Scenario C
- [ ] `tests/e2e/cursor-mobile.spec.ts` — Scenario D; use iPhone 12 device descriptor; assert no three chunk loaded via `page.route`
- [ ] `tests/e2e/cursor-api-down.spec.ts` — Scenario E; mock `/api/head-commit` to 500
- [ ] All 5 green locally with `npm run test:e2e`

## T019 — Accessibility audit

- [ ] `@axe-core/playwright` integrated into the 5 e2e tests (run `axe` on each page at the final state)
- [ ] 0 violations on all 5
- [ ] Keyboard-only walkthrough recorded as a note in `.logs/001-a11y-walkthrough.log`: Tab → skip link, Shift+Tab → nothing, Tab again after reveal → replay button
- [ ] Screen reader spot-check with NVDA or VoiceOver on the hero: h1 is announced, metadata is announced, replay button is announced with its aria-label

## T020 — Performance audit

- [ ] Install `@next/bundle-analyzer` (devDep) if not already present
- [ ] Run `ANALYZE=true npm run build`; save report to `.logs/001-bundle-analyzer.html`
- [ ] Verify: initial JS for `/` < 180KB gzipped, Three.js in a separate lazy chunk, mobile chunk contains no three
- [ ] Run Lighthouse on a local prod build (`npm run build && npm start`) at mobile and desktop profiles; save JSON reports to `.logs/001-lighthouse-mobile.json` and `.logs/001-lighthouse-desktop.json`
- [ ] Targets hit: Mobile Perf ≥ 85, Desktop Perf ≥ 95, A11y 100, Best Practices ≥ 95, SEO 100
- [ ] If any target misses, fix before opening PR for review

## T021 — 9 foundation scripts green

- [ ] `npm run typecheck` → `.logs/001-1-typecheck.log` exit 0
- [ ] `npm run lint` → `.logs/001-2-lint.log` exit 0
- [ ] `npm run test` → `.logs/001-3-vitest.log` exit 0
- [ ] `npm run test:e2e` → `.logs/001-4-playwright.log` exit 0
- [ ] `npm run scan:secrets` → `.logs/001-5-gitleaks.log` exit 0
- [ ] `npm audit --audit-level=high` → `.logs/001-6-audit.log` exit 0
- [ ] `bash scripts/check-rls.sh` → `.logs/001-7-rls.log` exit 0 (N/A — no Supabase in this spec, should still pass)
- [ ] `bash scripts/check-tenant-id.sh` → `.logs/001-8-tenant.log` exit 0 (same)
- [ ] `bash scripts/check-forbidden-terms.sh && bash scripts/check-i18n.sh` → `.logs/001-9-forbidden-i18n.log` exit 0

## T022 — PR, preview URL, Opus verification

- [ ] Open implementation PR from `feat/001-the-cursor` → `main` (draft initially)
- [ ] Wait for CI green
- [ ] Vercel preview URL in the PR description
- [ ] Flip PR to ready-for-review
- [ ] Write `.opus/outbox/<NNN>-reply.md` (NNN assigned when Opus dispatches the implementation inbox message) with: commit sha, CI URL, preview URL, log paths, bundle size, Lighthouse scores
- [ ] **STOP.** Opus verifies the preview, says "wow" or redlines, then merges.

---

## Notes for the executing Code Agent (future self)

- **Do not start T001 without a fresh inbox message from Opus authorizing implementation.** This `tasks.md` was hand-authored in the planning PR; implementation requires a separate dispatch per the workflow.
- **Keep each task in its own commit** with a conventional commit message. Example: `feat(cursor): T007 terminal typer component with reduced-motion bypass`.
- **Tick each task checkbox in the same commit** as its implementation (Principle 10).
- **If a task turns out to be wrong**, STOP and write an outbox blocker. Do not improvise on tasks.md without Opus review.
- **The e2e tests may be flaky** due to animation timing. Use `data-state` attributes on key elements and wait on those rather than on wall-clock timeouts where possible.
