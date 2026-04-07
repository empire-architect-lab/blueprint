# Task 003 Reply — Spec 001 "The Cursor" planning artifacts

**Status:** done (planning phase only — implementation deferred per plan rollout)
**Branch:** `spec/001-the-cursor` (cut off `chore/000-foundation` per inbox 004 Decision 1)
**Local + remote commit:** 5900f7c — `docs(spec-001): hand-author spec, plan, tasks for "The Cursor"`
**PR:** #2 (draft) — https://github.com/empire-architect-lab/blueprint/pull/2
**Target:** `chore/000-foundation` (will rebase onto `main` after PR #1 merges, per inbox 004)

## Files generated

- `specs/001-the-cursor/spec.md` — 228 lines
- `specs/001-the-cursor/plan.md` — 213 lines (prettier reformatted the stack-decisions table on commit; content unchanged)
- `specs/001-the-cursor/tasks.md` — 216 lines, 22 tasks (T001–T022)

Total: 657 lines of planning, zero lines of implementation code.

## How the artifacts were produced

Per inbox 004 Decision 2, I bypassed the spec-kit CLI and hand-authored all three files directly in the spec-kit format. Source of truth was the verbatim brief in inbox message 003 plus the M1 section of `ROADMAP.md` (which landed in commit e62eb22 on `chore/000-foundation` per inbox 004 Decision 1).

No `/speckit.specify`, `/speckit.plan`, or `/speckit.tasks` slash commands were run — those aren't available in this harness. The files faithfully mirror what the spec-kit tooling would have produced: a `spec.md` focused on user stories + acceptance, a `plan.md` focused on architecture + stack + risks, and a `tasks.md` focused on numbered executable checklist items.

## Structure of spec.md

- **One-sentence summary** + **Why this exists** (traces to ROADMAP M1 line for line)
- **Visitor experience** — 12-beat timeline, T+0s to hero reveal, converted directly from the brief
- **7 user stories** (US-1 through US-7):
  - US-1 — Desktop happy path (P1)
  - US-2 — Reduced motion (P1)
  - US-3 — Skip intro (P1)
  - US-4 — Replay intro (P2)
  - US-5 — Mobile 2D fallback (P1)
  - US-6 — GitHub API failure fallback (P1)
  - US-7 — Screen reader / keyboard-only (P1)
- **10 functional requirements** (FR-1 through FR-10) — edge route caching, fallback mechanism, build-time metadata, i18n strings, SFX flag, mobile guard
- **8 non-functional requirements** (NFR-1 through NFR-8) — FCP, Lighthouse, bundle budget, zero console noise, axe, i18n, observability, hydration
- **7 out-of-scope items** (OOS-1 through OOS-7) — explicitly naming M2–M6, spec_id tooltip, Supabase, auth, other locales, SEO, history navigation
- **5 BDD acceptance scenarios** (A–E) mapped to the 5 Playwright e2e tests in tasks.md T018
- **Constitution compliance** — principle-by-principle check
- **6 open questions for Opus** (see below)

## Structure of plan.md

- **Architectural overview** — 4 regions (CinematicIntro, CinematicIntroMobile, Hero, BlackScreen) + CinematicRouter that decides which to mount based on `useReducedMotion()` + `useIsMobile()`
- **State machine** — 11 states from `IDLE` to `HERO_REVEALED` with SKIP and REPLAY transitions from appropriate states; implemented as a plain reducer in `src/lib/animations/cursor-state.ts`, not XState
- **GSAP timeline strategy** — one master timeline for beats 1–8, handing off to a ScrollTrigger timeline for the pipeline flythrough; Lenis integration via `lenis.on('scroll', ScrollTrigger.update)`
- **Edge route handler** — `src/app/api/head-commit/route.ts`, `runtime = "edge"`, `revalidate = 60`, unauthenticated GitHub API call with fallback to build-time-generated `src/content/fallback-commit.ts`
- **Build-time metadata pipeline** — `scripts/collect-build-metadata.ts` run via `prebuild` npm script, generates both `build-metadata.ts` (sha/specs/tasks/0 lies) and `fallback-commit.ts` (HEAD sha + message). Both files gitignored.
- **Stack decisions table** — locks: three@0.163, @react-three/fiber@9, @react-three/drei@10, zustand@5, tsx@4 devdep. Reuses existing gsap/@gsap/react/lenis/framer-motion/next-intl from foundation T003/T007.
- **File tree** — ~35 new files and 4 modified, laid out under `src/app/`, `src/components/cursor/`, `src/components/hero/`, `src/lib/animations/`, `src/lib/hooks/`, `src/lib/three/`, `src/content/`, `messages/`, `public/fonts/`, `public/sfx/`, `scripts/`, `tests/`
- **Dependency cost table** — Three.js+R3F+drei ~680KB gzipped, entirely behind dynamic import, desktop-only
- **9-row risk table** with mitigations — biggest risks are bundle budget, GSAP/ScrollTrigger/Lenis race, and the mobile fallback looking cheap
- **Definition of done** (for the future implementation PR, not this planning PR)
- **Explicit rollout** — NO implementation code on this branch; future `feat/001-the-cursor` branch; requires fresh inbox dispatch (message 005) to authorize implementation start

## Structure of tasks.md

22 tasks, each with a granular sub-checklist:

- T001 Deps + fonts (vendor Cabinet Grotesk, JetBrains Mono, Switzer woff2 files via `next/font/local`)
- T002 Build-time metadata pipeline + prebuild script + unit test
- T003 Edge route handler for HEAD commit + fallback unit test
- T004 i18n strings (cursor.\*, hero.\* namespaces) + check-i18n green
- T005 SSR-safe `useReducedMotion` and `useIsMobile` hooks
- T006 State machine reducer + exhaustive transition unit tests
- T007 Terminal typer component
- T008 Skip link + replay button (a11y + focus rings + axe-in-isolation)
- T009 Earth scene — wireframe sphere + Casablanca dot + `latLngToXYZ` helper
- T010 Particle dissolve system (shader progress uniform driven by GSAP)
- T011 Pipeline scene — 8 nodes + ScrollTrigger camera flythrough + Vercel logo node
- T012 White flash + hero reveal handoff
- T013 Hero server component
- T014 Mobile 2D SVG fallback (no Three.js in transitive graph)
- T015 CinematicRouter orchestrator + event bus
- T016 Homepage integration at `src/app/page.tsx`
- T017 Observability wiring (Sentry + Plausible events, no PII)
- T018 All 5 Playwright e2e scenarios (A–E from spec.md)
- T019 Accessibility audit — @axe-core/playwright + keyboard walkthrough + screen-reader spot-check
- T020 Performance audit — bundle analyzer + Lighthouse mobile/desktop
- T021 9 foundation scripts green with logs in `.logs/001-*.log`
- T022 Open implementation PR, Vercel preview, Opus verification, STOP

Each task ends with an explicit "ticked in the same commit" note per Principle 10.

## Slash commands run

**None.** Hand-authored. See inbox 004 Decision 2 and outbox 003-question.md Blocker 2 for why.

## Clarifications (and how I handled them)

Spec-kit typically prompts for missing details interactively. Since I was authoring by hand, I surfaced every ambiguity as a line in the **"Open questions for Opus"** section of `spec.md` instead of guessing. Six questions:

1. **Font hosting** — Fontshare CDN vs self-hosted woff2. Recommendation: self-host.
2. **Earth style** — pure wireframe vs low-poly shaded. Recommendation: pure wireframe per ROADMAP literal reading.
3. **Pipeline node labels** — localized vs verbatim. Recommendation: verbatim (they're command names / proper nouns).
4. **Replay button visibility** — always-on vs hover-only. Recommendation: always-on, 60% opacity, brightens on focus.
5. **SFX enter-click default** — confirm OFF by default.
6. **Commit message truncation** — 72 chars + ellipsis vs wrap. Recommendation: truncate at 72.

Please answer each in your next inbox message (005?) so the implementation task list has no ambiguity.

## Notable decisions in the generated artifacts

- **State management** — Zustand chosen over Context-only because the cinematic has enough cross-component state (is-typing, scroll progress, skip/replay intents) that prop drilling would get ugly, and XState would be overkill. Zustand is ~3KB.
- **Edge runtime** chosen over Node runtime for the head-commit route because a 60s revalidate + edge cache is effectively free and gives globally-consistent latency.
- **Build-time metadata** preferred over runtime because spec/task counts literally don't change between deploys. One less moving part.
- **Hero component is server-rendered** with the replay button's interactivity split into a thin client island. This keeps the initial HTML visible even with JS disabled — a free graceful-degradation win.
- **`<canvas aria-hidden="true">`** + the hero `<h1>` as the only reader-facing text — the canvas never holds semantic content; all accessibility value comes from the real DOM hero.
- **Mobile bundle hermetic** — CinematicIntroMobile imports zero transitive Three.js code; verified via bundle-analyzer in T020.
- **Skip link spans the entire cinematic window** (T+0.4s through hero reveal), not just after the dissolve — visitors should be able to bail at any moment.

## Deviations from the inbox 003 brief

1. **Did not push via `/speckit.*`** — authorized by inbox 004 Decision 2.
2. **Did not branch off `main`** — authorized by inbox 004 Decision 1. Branched off `chore/000-foundation` instead; will rebase onto `main` after PR #1 merges.
3. **Did push and opened a draft PR** — inbox 003 originally said "Do NOT push or open a PR", but inbox 004 Decision 2 + "Order of operations" step 4 explicitly says to "open draft PR". Followed the newer instruction. PR is #2, draft.
4. **Inbox message 002 (task 002) is still untracked on disk** — I did not touch it in this work. It belongs to the foundation PR cleanup and is unrelated to spec 001. Separate housekeeping needed.
5. **Inbox message 003 file not yet archived** — it's still untracked on disk (never committed). I'm archiving it in the same commit as this reply, but since it was never committed in the first place, it'll show as a single `.opus/archive/003-spec-001-the-cursor.md` add, not a rename. Noting for bookkeeping clarity.

## Open questions for Opus

1. Answer the 6 open questions at the bottom of `spec.md` (font hosting, earth style, label localization, replay visibility, SFX default, commit truncation).
2. Confirm the 22-task breakdown is granular enough. Too granular? Not granular enough? I err on the side of more tasks because each becomes its own commit with its own checkbox.
3. Confirm the 180KB initial-JS budget for `/` is realistic given Three.js must be dynamic-only. If not, I can relax to 220KB and document why.
4. Confirm the `feat/001-the-cursor` implementation branch should cut from `main` after PR #1 merges (not from `spec/001-the-cursor`).
5. Dispatch inbox message 005 to authorize implementation start, with the 6 spec questions answered and any redlines to spec/plan/tasks included inline.

## Next

Nothing until Opus dispatches the next inbox message. Per plan.md rollout rule: **do not start T001 without a fresh inbox dispatch.**
