# Plan 001 — The Cursor

**Spec:** `specs/001-the-cursor/spec.md`
**Branch (planning):** `spec/001-the-cursor`
**Branch (implementation):** `feat/001-the-cursor` (to be created after Opus approves spec + plan + tasks)
**Status:** draft
**Authored:** 2026-04-07

---

## Architectural overview

The page at `/` is a Next.js 16 App Router route (`src/app/page.tsx`) that renders four regions:

1. **`<CinematicIntro />`** — client component, desktop only, hosts the Three.js canvas + GSAP timeline + skip button. Lazy-loaded.
2. **`<CinematicIntroMobile />`** — client component, mobile only, hosts the SVG animation. Lazy-loaded.
3. **`<Hero />`** — server component that renders the h1, metadata line, replay button. Hydrated on the client so the replay button can dispatch a custom event.
4. **`<BlackScreen />`** — server-rendered placeholder shown during SSR and before JS hydrates. Pure CSS: `main { background: #000; min-height: 100vh; }`.

Region 3 is always present in the DOM from SSR. Regions 1 and 2 are dynamically imported by a `<CinematicRouter />` client wrapper that uses `useMediaQuery` + `useReducedMotion` to decide which (if any) to mount. When neither mounts, the hero is simply visible immediately — this is also the reduced-motion and JS-disabled path.

### State machine

The cinematic is driven by a tiny state machine in `src/lib/animations/cursor-state.ts`:

```
IDLE → TYPING → PAUSE_1 → ENTER → COMMIT_REVEAL → PAUSE_2 → DISSOLVE → EARTH → PIPELINE_SCROLL → WHITE_FLASH → HERO_REVEALED
                                                                                                                 ↑
                                                                                    SKIP (from any state) ──────┘
                                                                                    REPLAY (from HERO_REVEALED) ─→ IDLE
```

Each transition is triggered by either (a) a GSAP timeline callback, (b) a ScrollTrigger progress threshold, or (c) a user action (skip/replay). The state machine is a simple reducer, not XState — keep dependencies light.

### GSAP timeline

One master timeline in `src/lib/animations/cursor-timeline.ts` orchestrates steps 1–8 (through dissolve → earth). The pipeline flythrough (step 10) is a separate **ScrollTrigger**-driven timeline scrubbed by scroll position. The master timeline hands off to the ScrollTrigger at the `EARTH` state by calling `Lenis.start()` and attaching the scroll timeline to the page.

### Edge route handler

`src/app/api/head-commit/route.ts` — `export const runtime = "edge"`, `export const revalidate = 60`. Fetches `https://api.github.com/repos/empire-architect-lab/blueprint/commits/main` with `headers: { Accept: "application/vnd.github+json", "User-Agent": "blueprint-lab" }`. Parses `sha` and `commit.message`, returns JSON. On any non-2xx or fetch throw, reads `src/content/fallback-commit.ts` and returns it with `source: "fallback"`.

### Build-time metadata

`scripts/collect-build-metadata.ts` is a Node script run via `"prebuild": "tsx scripts/collect-build-metadata.ts"` in `package.json`. It:

1. Runs `git rev-parse HEAD` to get the commit sha.
2. `fs.readdirSync("specs/")` filtered by `/^\d{3}-/` to count specs.
3. Walks `specs/**/tasks.md` and counts lines matching `/^- \[[x ]\]/` to get total tasks.
4. Writes `src/content/build-metadata.ts` as `export const BUILD_METADATA = { sha, shortSha, specCount, taskCount, lieCount: 0 } as const;`.
5. Also writes `src/content/fallback-commit.ts` as `export const FALLBACK_COMMIT = { sha, shortSha, message } as const;` using `git log -1 --pretty=format:"%h|%s"`.

Both files are gitignored (generated at build). CI regenerates them on every run — deterministic from git state.

---

## Stack decisions (all locked via this plan; tasks implement verbatim)

| Concern              | Choice                                                     | Version                      | Reason                                                                                           |
| -------------------- | ---------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| 3D engine            | Three.js + @react-three/fiber + @react-three/drei          | three@0.163, R3F@9, drei@10  | Industry standard; R3F gives React ergonomics; drei gives camera controls + loaders for free     |
| Timeline engine      | GSAP + ScrollTrigger + @gsap/react (`useGSAP`)             | gsap@3.13 (already in stack) | Already wired in T003; `useGSAP` is the React-safe way                                           |
| Smooth scroll        | Lenis                                                      | lenis@1.x (already in stack) | Already wired; pairs with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`           |
| Display font         | Cabinet Grotesk (self-hosted woff2 via `next/font/local`)  | Fontshare free tier          | Per ROADMAP. Self-hosted avoids third-party runtime dep + FOUT                                   |
| Mono font            | JetBrains Mono (self-hosted woff2 via `next/font/local`)   | Fontshare free tier          | Per ROADMAP                                                                                      |
| Body font            | Switzer (self-hosted) — wired now even if unused in M1     | Fontshare free tier          | Pre-wire for M2+                                                                                 |
| API runtime          | Next.js Edge runtime route handler with 60s ISR            | Next 16                      | Cheap, fast, global; 60s covers GitHub's unauthenticated rate limit comfortably                  |
| i18n                 | `next-intl`                                                | next-intl@3.x                | Already in stack (per foundation T003/T007); server + client support; RTL-ready for future `ar`  |
| State management     | Zustand + React useReducer for the cinematic state machine | zustand@5.x                  | Tiny; no Redux overkill; SSR-safe                                                                |
| Animation testing    | Playwright trace + frame-by-frame screenshot comparison    | Playwright@1.x               | Already in stack; use `page.waitForTimeout` sparingly, prefer `waitForSelector` on state markers |
| Canvas accessibility | `<canvas aria-hidden="true">` + offscreen live region      | —                            | The canvas never holds semantic content; the hero `<h1>` is the only reader-facing text          |

### Not used in M1

- Aceternity UI and Magic UI components — kept in stack for later chapters; no M1 component comes from them.
- shadcn/ui components — same; the skip and replay buttons are hand-rolled because they're unique.
- Framer Motion — GSAP handles the timeline; Framer is held for later hover micro-interactions.
- Tremor / Recharts — M3 tooling, not M1.

---

## File tree (planned new/modified paths)

```
src/
├── app/
│   ├── page.tsx                           [MODIFY] — replace default template with CinematicRouter + Hero
│   └── api/
│       └── head-commit/
│           └── route.ts                   [NEW] — edge runtime, 60s cache, fallback
├── components/
│   ├── cursor/
│   │   ├── cinematic-router.tsx           [NEW] — client, decides desktop/mobile/reduced
│   │   ├── cinematic-intro.tsx            [NEW] — desktop orchestrator (<300 lines)
│   │   ├── cinematic-intro-mobile.tsx     [NEW] — mobile SVG version (<250 lines)
│   │   ├── terminal-typer.tsx             [NEW] — the typing cursor component
│   │   ├── earth-scene.tsx                [NEW] — R3F <Canvas> + <Earth />
│   │   ├── earth.tsx                      [NEW] — wireframe sphere + Casablanca dot
│   │   ├── pipeline-scene.tsx             [NEW] — 8 nodes + camera rig
│   │   ├── pipeline-node.tsx              [NEW] — one glowing node
│   │   ├── particles.tsx                  [NEW] — dissolve particle system
│   │   ├── white-flash.tsx                [NEW] — 120ms full-screen flash
│   │   ├── skip-link.tsx                  [NEW] — accessible skip button
│   │   └── replay-button.tsx              [NEW] — accessible replay button
│   └── hero/
│       └── hero.tsx                       [NEW] — server component, h1 + metadata
├── lib/
│   ├── animations/
│   │   ├── cursor-timeline.ts             [NEW] — master GSAP timeline factory
│   │   ├── cursor-scroll-timeline.ts      [NEW] — ScrollTrigger timeline factory
│   │   └── cursor-state.ts                [NEW] — reducer state machine
│   ├── data/
│   │   └── head-commit.ts                 [NEW] — client-side fetcher wrapping /api/head-commit with fallback
│   └── hooks/
│       ├── use-reduced-motion.ts          [NEW] — SSR-safe matchMedia hook
│       └── use-is-mobile.ts               [NEW] — SSR-safe < 768px hook
├── content/                               (gitignored, generated)
│   ├── build-metadata.ts                  [GENERATED by prebuild]
│   └── fallback-commit.ts                 [GENERATED by prebuild]
└── styles/
    └── fonts.ts                           [NEW] — next/font/local declarations

messages/
└── en.json                                [MODIFY] — add cursor.* and hero.* keys

public/
├── fonts/
│   ├── CabinetGrotesk-Variable.woff2      [NEW] — vendored
│   ├── JetBrainsMono-Variable.woff2       [NEW] — vendored
│   └── Switzer-Variable.woff2             [NEW] — vendored
└── sfx/
    └── enter-click.mp3                    [NEW] — ~3KB, optional per SFX flag

scripts/
└── collect-build-metadata.ts              [NEW] — prebuild hook

tests/
├── unit/
│   ├── cursor-state.test.ts               [NEW] — reducer transitions
│   └── head-commit-fallback.test.ts       [NEW] — fallback path
└── e2e/
    ├── cursor-happy-path.spec.ts          [NEW] — Scenario A
    ├── cursor-reduced-motion.spec.ts      [NEW] — Scenario B
    ├── cursor-skip.spec.ts                [NEW] — Scenario C
    ├── cursor-mobile.spec.ts              [NEW] — Scenario D
    └── cursor-api-down.spec.ts            [NEW] — Scenario E

package.json                               [MODIFY] — add prebuild, add deps
.gitignore                                 [MODIFY] — add src/content/
```

Estimated file count: ~35 new files, 4 modified.

---

## New dependencies

| Package            | Version range | Purpose                         | Size cost         |
| ------------------ | ------------- | ------------------------------- | ----------------- |
| three              | ^0.163.0      | 3D engine                       | ~600KB gzipped    |
| @react-three/fiber | ^9.0.0        | React renderer for Three.js     | ~50KB gzipped     |
| @react-three/drei  | ^10.0.0       | R3F helpers (camera, loaders)   | tree-shaken ~30KB |
| zustand            | ^5.0.0        | Tiny state store                | ~3KB gzipped      |
| tsx                | ^4.0.0        | Run TS prebuild script (devDep) | devDep only       |

`gsap`, `@gsap/react`, `lenis`, `framer-motion`, `next-intl`, `@supabase/*` already in stack (T003/T004/T007). No version bumps planned.

All of Three.js + R3F + drei (~680KB gzipped) is **behind a dynamic import** and loads only on desktop, only after first paint. Mobile never pays this cost.

---

## Risks and mitigations

| Risk                                                      | Likelihood | Impact | Mitigation                                                                                           |
| --------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------- |
| Three.js bundle blows the 180KB initial JS budget         | Medium     | High   | Confirmed dynamic-only load; measure in CI with `@next/bundle-analyzer`; fail build if initial > 180 |
| GSAP + ScrollTrigger + Lenis race condition on first load | Medium     | Medium | Use `useGSAP` + `gsap.context`; register ScrollTrigger only after Lenis first tick                   |
| GitHub API rate limit in CI (60 req/hr unauth)            | Low        | Low    | Playwright tests mock `/api/head-commit`; only production traffic hits GitHub                        |
| `prefers-reduced-motion` check races hydration            | Medium     | Medium | `useSyncExternalStore` with `matchMedia`, SSR-safe                                                   |
| Mobile 2D fallback looks cheap vs desktop                 | Medium     | High   | Invest same design effort; use SVG `<animate>` + CSS transforms, not a hack                          |
| Hydration mismatch on the black-screen SSR                | Low        | Medium | Use `suppressHydrationWarning` only on the canvas wrapper, nowhere else                              |
| Casablanca dot at (33.5731, -7.5898) projected wrong      | Low        | Low    | Unit-test the latlng-to-xyz helper                                                                   |
| Vercel edge runtime doesn't support a needed Node API     | Low        | Medium | Route handler is tiny (fetch only); no Node-only APIs needed                                         |
| Pre-push hook slowness (9 scripts) discourages iteration  | High       | Low    | Accept it; run `npm run typecheck` + targeted vitest locally during dev, full suite only on push     |

---

## Definition of done (for the implementation PR, not this planning PR)

- All 5 Playwright scenarios (A–E) green on CI.
- Unit tests for the state machine and the fallback path green.
- axe-core reports 0 violations on `/` in both cinematic and reduced-motion modes.
- Lighthouse on a Vercel preview: Mobile Performance ≥ 85, Desktop ≥ 95, A11y 100.
- `@next/bundle-analyzer` report shows initial JS for `/` < 180KB gzipped, Three.js chunk in a separate lazy chunk.
- Zero console errors/warnings in prod build (checked via Playwright `page.on('console')`).
- All 9 foundation scripts green in CI.
- Every task in `tasks.md` ticked in the same commit that implements it (Principle 10).
- Opus verifies the Vercel preview URL and says "wow" (per ROADMAP pace rule).

---

## Rollout

This plan is explicitly **planning only**. No implementation code lands on this branch. The sequence is:

1. **This PR (draft)** — `spec/001-the-cursor` → `main` (or `chore/000-foundation` first, then rebased) — contains only `specs/001-the-cursor/{spec.md, plan.md, tasks.md}`. Opus reviews.
2. **Opus redlines** — Opus opens inbox message 005 with approvals, redlines, or change requests.
3. **Implementation branch** — `feat/001-the-cursor` forked from whichever main-ish branch the planning PR landed into. Tasks executed one-by-one per the `tasks.md` file on that branch.
4. **Implementation PR** — opens as draft, flips to ready when all tasks ticked and CI green.
5. **Opus verifies preview URL** — marks merge-ready.
6. **Merge to main** — prod deploy kicks, M1 is live.

Do not skip step 2. Do not start implementation from this planning PR.
