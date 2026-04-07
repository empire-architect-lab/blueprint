# Spec 001 — The Cursor

**Milestone:** M1 (per `ROADMAP.md`)
**Owner:** Code Agent
**Dispatcher:** Cowork Opus
**Branch:** `spec/001-the-cursor`
**Status:** draft — awaiting Opus review
**Authored:** 2026-04-07

---

## One-sentence summary

Build the opening ~12-second cinematic sequence of the Blueprint Lab homepage — a black-screen typing terminal that dissolves into a 3D wireframe Earth and a scroll-driven pipeline flythrough, landing on a hero line that reads "Built by the process it teaches." — as the first scene the visitor sees on `/`.

---

## Why this exists

From `ROADMAP.md` M1: _"The first 8 seconds of the experience. Black screen, silent. A blinking monospace cursor types `$ git log --oneline | head -1`. Hits enter. A real commit hash + message appears, pulled live from the GitHub API — visitors just watched the page query its own repo."_

The site's one-line pitch is: _"This entire website was built by the process it documents — and you can watch it being built, in real time, as you scroll."_ M1 is the proof-of-life: the first 12 seconds that earn the visitor's attention and make the rest of the scroll feel inevitable. Every subsequent chapter depends on this opening landing.

If M1 does not make Chainbeard say "wow", it gets re-spec'd, not shipped (per ROADMAP pace rule).

---

## The visitor experience (source of truth)

A first-time visitor lands on `/` on a desktop Chrome browser with motion enabled. What they see, beat by beat:

1. **T+0s** — Page loads. Screen is pure black. No content, no fonts, no chrome. Single favicon in the tab.
2. **T+0.4s** — A blinking monospace cursor appears, horizontally and vertically centered. Blink interval 530ms (classic terminal).
3. **T+0.4s → T+1.8s** — The cursor types the literal string `$ git log --oneline | head -1` character by character at ~80ms per character. Cursor remains blinking at the trailing position.
4. **T+1.8s → T+2.4s** — 600ms pause. The cursor keeps blinking.
5. **T+2.4s** — The cursor "presses enter": a soft key-click sound plays **only if** the `NEXT_PUBLIC_BLUEPRINT_SFX` env flag is `true` (default: off). Visual: brief highlight flash on the line.
6. **T+2.4s → T+2.7s** — A new line appears below, typed instantly: `<short-sha> <commit message>` — real data fetched from the GitHub API for `empire-architect-lab/blueprint`, default branch `main`, HEAD commit. Format: `a1b2c3d chore(foundation): enable branch protection on main, add ROADMAP, close T012`.
7. **T+2.7s → T+3.9s** — 1.2s read pause.
8. **T+3.9s → T+5.9s** — The entire terminal scene dissolves: every visible character disintegrates into thousands of glowing particles that scatter, swirl, and reform into a 3D wireframe Mercator projection of Earth. The earth has exactly one glowing dot at Casablanca (33.5731°N, 7.5898°W).
9. **T+5.9s** — Lenis smooth scroll engages. Scrollbar becomes interactive. The page becomes scrollable.
10. **Scroll-driven (T+5.9s → scroll end)** — As the visitor scrolls, the camera flies upward through the Earth and into a 3D pipeline of exactly 8 glowing nodes labeled in order: `SPECIFY → PLAN → TASKS → IMPLEMENT → PR → CI → PREVIEW → DEPLOY`. Each node lights up sequentially as the camera passes it. The 8th node is a Vercel logo (monochrome, glowing).
11. **When camera passes the Vercel node** — The entire screen flashes pure white (`#FFFFFF`) for 120ms, then smash-cuts to a hero section.
12. **Hero section** — A single line of 220px Cabinet Grotesk (Display) reads: **"Built by the process it teaches."**. Below it, in 18px JetBrains Mono: `commit <real-sha> · <real-spec-count> specs · <real-task-count> tasks · 0 lies`. All four numbers are real — fetched at build time from (a) GitHub API for the HEAD sha, (b) count of directories in `specs/` matching `^\d{3}-` pattern, (c) count of `- [ ]` + `- [x]` lines across all `specs/**/tasks.md` files, and (d) hardcoded `0`.

The whole sequence completes within **14 seconds** of page load on a 4G connection.

---

## User stories

### US-1 — First-time desktop visitor with motion enabled (P1, MUST)

**Given** a first-time visitor on a desktop Chrome browser ≥1280px wide with `prefers-reduced-motion: no-preference`,
**when** they navigate to `/`,
**then** they see the full cinematic sequence as described above, from black screen through hero reveal, with real commit data, within 14 seconds, and no console errors.

### US-2 — Visitor with `prefers-reduced-motion: reduce` (P1, MUST)

**Given** a visitor whose OS has "reduce motion" enabled,
**when** they navigate to `/`,
**then** the cinematic sequence is entirely skipped. Instead, the hero section fades in over 400ms directly, and a small subtitle below the metadata line reads: _"Cinematic intro disabled per your motion preferences."_

### US-3 — Visitor who wants to skip (P1, MUST)

**Given** any visitor with motion enabled,
**when** the blinking cursor has appeared (T+0.4s onward) and before the hero section has rendered,
**then** a small, unobtrusive "skip intro" link is visible in the bottom-right corner, keyboard-focusable, screen-reader-labeled as "Skip cinematic intro",
**and when** they activate it (click or Enter),
**then** the sequence halts immediately and the hero section is shown instantly (no fade).

### US-4 — Visitor who wants to replay (P2, SHOULD)

**Given** a visitor who has reached the hero section,
**when** they look at the bottom-right corner of the hero section,
**then** a small "replay intro" button is visible, keyboard-focusable, screen-reader-labeled as "Replay cinematic intro",
**and when** they activate it,
**then** the entire sequence runs again from T+0.

### US-5 — Mobile visitor (P1, MUST)

**Given** a visitor on a device with viewport width < 768px,
**when** they navigate to `/`,
**then** the 3D Three.js earth and pipeline are not loaded at all (Three.js chunk never fetched on mobile). Instead, the same narrative beats play as a vertical 2D SVG animation: typing terminal → SVG world map with Casablanca dot → vertical scroll-driven list of the 8 pipeline nodes → hero section. Same start (typing), same payoff (hero line + metadata), roughly the same duration (±2s).

### US-6 — GitHub API failure fallback (P1, MUST)

**Given** the GitHub API is unreachable, rate-limited, or returns non-2xx at request time,
**when** the typing sequence reaches the commit-hash reveal,
**then** the page falls back to a hardcoded recent commit embedded at build time (the most recent commit known to the build). The fallback is indistinguishable from the live path to the visitor. No error is shown. No console error is emitted. A single `console.warn` is acceptable **only** in development mode, guarded by `process.env.NODE_ENV === "development"`.

### US-7 — Screen reader / keyboard-only visitor (P1, MUST)

**Given** a visitor using a screen reader or keyboard only,
**when** they navigate to `/`,
**then** (a) the cinematic sequence is auto-skipped for assistive tech (same behavior as `prefers-reduced-motion`), (b) the hero heading "Built by the process it teaches." is real DOM text (not a canvas/image), structured as an `<h1>`, (c) the metadata line is real DOM text structured as a `<p>`, (d) all interactive controls (skip, replay) have accessible names, (e) tab order is logical, (f) axe reports zero violations on the page.

---

## Functional requirements

- **FR-1** — The GitHub API call to fetch HEAD commit data MUST be cached at the edge for 60 seconds. Implementation: Next.js App Router `fetch(..., { next: { revalidate: 60 } })` inside a Route Handler (`src/app/api/head-commit/route.ts`) running on the Edge runtime. The homepage calls this route handler, not `api.github.com` directly — this avoids exposing rate-limit state to the browser and centralises the fallback.
- **FR-2** — The homepage MUST NOT ship a GitHub Personal Access Token in client-side code. The Route Handler uses no token for public repo reads (unauthenticated GitHub API allows 60 req/hour per IP; with 60s edge cache that's ample).
- **FR-3** — The fallback hardcoded commit is read from `src/content/fallback-commit.ts` (a TypeScript file generated at build time by a prebuild script that runs `git log -1 --pretty=format:"%h %s"`). If the fallback file is missing, the build fails.
- **FR-4** — The four build-time metadata numbers (commit sha, spec count, task count, `0 lies`) are computed by a single `scripts/collect-build-metadata.ts` script run in the `prebuild` npm script. Output lands in `src/content/build-metadata.ts`, committed via build and imported by the hero component.
- **FR-5** — The skip link is rendered from `T+0.4s` onward (when the cursor first appears) until the hero section has rendered. It is hidden before and after.
- **FR-6** — The replay button is rendered only inside the hero section, and clicking it re-runs the full cinematic from T+0 using the same GSAP timeline object (no component remount).
- **FR-7** — All visitor-facing text (typed command, skip label, replay label, hero headline, reduced-motion subtitle) MUST be sourced from `messages/{en,fr,ar,nl}.json` via `next-intl`. English is the canonical, human-written source. fr/ar/nl land as stub translations (literal English copy is an acceptable stub) and every stubbed key is recorded in `messages/_review.md` for later human review. RTL layout for `ar` is wired and renders correctly even when the strings are stubs. No inline English strings in components. **Exception:** the 8 pipeline node labels (`SPECIFY/PLAN/TASKS/IMPLEMENT/PR/CI/PREVIEW/DEPLOY`) are proper nouns / command names, sourced verbatim from `src/lib/constants/pipeline-nodes.ts`, and explicitly exempt from `next-intl`.
- **FR-8** — The sound effect on "enter" is OFF by default. It plays only when `NEXT_PUBLIC_BLUEPRINT_SFX === "true"` in the client bundle. The SFX asset (`public/sfx/enter-click.mp3`, ~3KB) is code-split and only fetched if the flag is on.
- **FR-9** — Route Handler for `/api/head-commit` returns JSON `{ sha: string; shortSha: string; message: string; source: "github" | "fallback" }`.
- **FR-10** — The mobile 2D SVG animation is implemented as a separate component (`HeroMobile`) dynamically imported only when `matchMedia("(max-width: 767px)").matches` on first paint. Three.js is `dynamic(() => import(...), { ssr: false })` and guarded behind the same desktop media query — mobile never touches it.

---

## Non-functional requirements

- **NFR-1 Performance** — First Contentful Paint < 1.5s on a Moto G4 / Slow 4G Chrome DevTools throttling profile. Largest Contentful Paint < 2.5s.
- **NFR-2 Lighthouse** — Mobile Performance ≥ 85, Desktop Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100 on a production Vercel preview build.
- **NFR-3 Bundle** — The Three.js + @react-three/fiber + @react-three/drei chunk is lazy-loaded after first paint and only on desktop. Initial JS payload for `/` < 180KB gzipped.
- **NFR-4 Zero noise** — Zero `console.error`, zero `console.warn` (except the dev-only FR-6 fallback warn), zero unhandled promise rejections, zero React hydration warnings.
- **NFR-5 Accessibility** — axe-core reports 0 violations on the page in both cinematic and reduced-motion modes. Keyboard tab order hits: skip-link → hero h1 → replay button → (rest of page when later chapters land). Color contrast ≥ 4.5:1 for all text.
- **NFR-6 i18n** — All visitor-facing strings live in `messages/en.json`. Adding a new locale later is a matter of translating that file only.
- **NFR-7 Observability** — Sentry captures any error during the sequence. Plausible fires one custom event `cinematic_completed` on hero reveal and `cinematic_skipped` on skip activation. Neither event contains PII.
- **NFR-8 No hydration flash** — The initial SSR payload for `/` is a black `<main>` with the hero content server-rendered inside an `aria-hidden="false"` wrapper. The JS client hydrates, replaces the content with the canvas, and reveals the hero at the right moment. If JS is disabled entirely, the visitor sees a static hero (no cinematic) — graceful degradation is effectively the same as the reduced-motion path.

---

## Out of scope (explicit)

- **OOS-1** — Chapters M2 through M6 from the roadmap (process scroll, receipts grid, spec browser, glossary, mirror).
- **OOS-2** — The `spec_id` hover-tooltip system. That is Spec 005. M1 may add `data-spec-id="001-the-cursor"` attributes to its components for future wiring, but no tooltip logic ships here.
- **OOS-3** — Supabase-backed content of any kind. The commit data is from GitHub API; the metadata is build-time. Supabase is not touched by this spec.
- **OOS-4** — Authentication, user accounts, tenant context. This page is fully public and stateless.
- **OOS-5** — Human-reviewed copy in fr, ar, nl. Stub translations are committed to `messages/{fr,ar,nl}.json` for every new key, marked in a sibling `messages/_review.md` tracker file. The English copy is the canonical source for M1. RTL layout for `ar` is wired and rendered correctly even if the words are stubs.
- **OOS-6** — Custom domain, SEO meta tags beyond defaults, Open Graph images, sitemap, robots.txt. Those are a later housekeeping spec.
- **OOS-7** — Any back/forward navigation animation. On browser back/forward, the cinematic re-runs from T+0 — same as a fresh load.

---

## Acceptance (BDD scenarios for the e2e test)

### Scenario A — Happy path (desktop, motion on)

```gherkin
Given a Playwright Chromium desktop context with viewport 1440x900
  And prefers-reduced-motion is "no-preference"
When I navigate to "/"
Then within 500ms I see a blinking cursor element at the viewport center
  And within 2000ms the text "$ git log --oneline | head -1" is fully typed
  And within 4000ms a line matching /^[0-9a-f]{7} .+/ is present below it
  And within 7000ms a <canvas> element with data-role="earth" is present
  And within 14000ms the <h1> element with text "Built by the process it teaches." is visible
  And the page has scroll height > viewport height
  And no console.error has fired
  And axe-core reports 0 violations
```

### Scenario B — Reduced motion

```gherkin
Given a Playwright Chromium desktop context
  And prefers-reduced-motion is "reduce"
When I navigate to "/"
Then within 1000ms the <h1> "Built by the process it teaches." is visible
  And a <p> with text containing "Cinematic intro disabled" is visible
  And no <canvas> element exists on the page
  And no console.error has fired
```

### Scenario C — Skip intro

```gherkin
Given a Playwright Chromium desktop context with motion enabled
When I navigate to "/"
  And I wait 1000ms
  And I press Tab (focus lands on the skip-intro link)
  And I press Enter
Then within 300ms the <h1> "Built by the process it teaches." is visible
  And the typing sound has not played (SFX flag is off)
```

### Scenario D — Mobile fallback

```gherkin
Given a Playwright Chromium mobile context with viewport 375x812
When I navigate to "/"
Then no Three.js chunk is present in the network tab
  And an <svg> element with data-role="earth-mobile" is visible
  And within 14000ms the <h1> "Built by the process it teaches." is visible
```

### Scenario E — GitHub API down

```gherkin
Given the network is intercepted so /api/head-commit returns 500
When I navigate to "/" in desktop context with motion enabled
Then the commit-hash reveal still happens with the hardcoded fallback sha
  And the page renders to the hero as normal
  And the metadata line still shows the fallback sha
```

---

## Constraints from the constitution

- **Principle 1 (SDD)** — This spec exists before any code. ✅
- **Principle 2 (multi-tenant)** — Not applicable; no Supabase tables are touched.
- **Principle 3 (CI gate)** — The implementation PR for this spec must land with all 9 scripts green.
- **Principle 4 (conventional commits)** — Every commit on `spec/001-the-cursor` and its implementation branch follows `<type>(scope): <subject>`. Scopes: `cursor`, `hero`, `three`, `gsap`, `api`, `i18n`.
- **Principle 5 (file sizes)** — No file over 500 lines. Components split aggressively. The GSAP timeline lives in a dedicated module (`src/lib/animations/cursor-timeline.ts`). The Three.js scene graph lives in `src/components/cursor/` split per object (earth, pipeline, particles).
- **Principle 6 (a11y)** — Non-negotiable. US-7 + NFR-5 enforce it.
- **Principle 7 (i18n)** — All strings via `next-intl`. See FR-7.
- **Principle 8 (observability)** — Sentry + Plausible wired per NFR-7.
- **Principle 9 (no secrets)** — No tokens needed; public repo read with 60s edge cache.
- **Principle 10 (bookkeeping)** — Every task in `tasks.md` for this spec gets ticked in the same commit that implements it.

---

## Open questions — ANSWERED by Opus (task 006)

1. **Cabinet Grotesk licensing** — **ANSWERED: self-host.** Vendor the woff2 files in `public/fonts/` via `next/font/local`. Zero third-party runtime dependency. Reflected in `plan.md` stack table.
2. **Earth texture vs pure wireframe** — **ANSWERED: pure wireframe.** Line segments, no fill. Per ROADMAP literal reading; cheaper and on-brand.
3. **Pipeline node labels** — **ANSWERED: verbatim, NOT localized.** Sourced from `src/lib/constants/pipeline-nodes.ts` as `export const PIPELINE_NODES = ['SPECIFY','PLAN','TASKS','IMPLEMENT','PR','CI','PREVIEW','DEPLOY'] as const;`. Exempt from `next-intl` because they are proper nouns / command names. No inline strings in `pipeline-scene.tsx`.
4. **Replay button visibility** — **ANSWERED: always visible at 60% opacity**, brightens to 100% on hover/focus.
5. **SFX enter-click default** — **ANSWERED: OFF by default**, opt-in via `NEXT_PUBLIC_BLUEPRINT_SFX=true`. Confirmed as drafted.
6. **Commit message truncation** — **ANSWERED: truncate at 72 chars with ellipsis** for visual rhythm. Helper handles Unicode safely (use `[...str]` spread, not `.length`).
