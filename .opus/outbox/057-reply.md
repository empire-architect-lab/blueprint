# Task 057 — Code Agent reply

**Status:** In progress
**Branch:** `feat/057-cinematic-landing` (off `fix/056-cinematic-silent-failure`)
**Started:** 2026-04-08

## Plan accepted
Brief in `.opus/inbox/057-cinematic-landing-sequel-clone.md` accepted as-is.
Spec-kit trio written at `specs/057-cinematic-landing/{spec,plan,tasks}.md`.
29 sub-tasks tracked in `tasks.md`.

## Decisions I'm taking (no blockers)
1. **Motion stack**: pure CSS `@keyframes` + IntersectionObserver. No
   GSAP runtime, no Framer Motion for these primitives. Mirrors
   sequel.co's actual implementation.
2. **CinematicHero extension**: new `backgroundVideoSrc` prop is
   **optional**, default behavior unchanged. Task 056 fix is not at risk.
3. **Arabic locale**: mirror keys in `messages/ar.json` with English
   fallback values, each tagged `// TODO: native review`. Practice task,
   not customer-facing.
4. **Hero CTA "Watch the film"**: scroll-to-manifesto anchor (no real
   film exists for Blueprint yet).
5. **Assets**: attempting direct download via curl. If blocked, will
   raise a blocker in `.opus/blockers/057-asset-download.md`.

## Progress
- [x] Branch created
- [x] Spec / plan / tasks scaffolded
- [x] T001–T004 assets downloaded (prior agent)
- [x] T005 Fraunces — reused existing `--font-display` var (CabinetGrotesk is already wired; `font-display` Tailwind class works). No font change.
- [x] T006–T014 10 cinematic primitives built under `src/components/cinematic/`
- [x] T015 Hero extended with optional video/split/controls/CTAs. Default (no props) path is byte-identical to previous hero.
- [x] T016–T017 `landing` namespace added to en.json, mirrored identically (English values) into fr/ar/nl.
- [x] T018 `app/[locale]/page.tsx` rewritten as async RSC composing 8 sections.
- [ ] T019–T029 phase 3 (9 scripts + PR + bookkeeping)

## Commits on feat/057-cinematic-landing
1. `7dbf4fa` feat(cinematic): add split-heading and scroll-reveal primitives [057]
2. `83df098` feat(cinematic): add editorial-card, manifesto-block, testimonial-grid [057]
3. `e6c9a0e` feat(cinematic): add stat-counter, logo-marquee, closing-cta, wordmark-footer [057]
4. `dc3de4c` feat(hero): add optional bg video and split-letter overlay props [057]
5. `a03af54` feat(i18n): add landing namespace across locales (en only, mirrored) [057]
6. `fb6e25e` feat(landing): compose sequel.co-inspired sections on [locale]/page [057]

## Checkpoint notes
- Largest file: `src/app/[locale]/page.tsx` at 226 lines (under 500-line hard limit). All cinematic primitives under 85 lines.
- Hero default branch preserved behind an early-return guard: when no props are passed, renders the exact prior JSX (`min-h-screen bg-black text-white`, `text-[220px]`, ReplayButton). Task 056 fix unaffected.
- i18n policy: English-only. fr/ar/nl carry identical English values in `landing.*` to satisfy `check-i18n.sh` key parity.
- CSS utilities appended to `src/app/globals.css` (reduced-motion branch included).
- Not pushed. No PR opened. 9 scripts not run — phase 3.

Preview URL + CI status will be appended here on PR open.
