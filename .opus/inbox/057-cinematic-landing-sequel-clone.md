# Task 057 — Cinematic Landing (sequel.co 1:1 structural clone)

## Context
Blueprint is a PRIVATE practice project. This task is pure UI practice.
Clone the **structure, motion, and feel** of https://sequel.co 1:1.
Content is Blueprint-flavored placeholder — invent freely, fetch any free
stock assets you need. No real data, no backend wiring. Labeled PRACTICE.

Stack on top of current `fix/056-cinematic-silent-failure` branch. Do not
wait for 056 to merge. Branch from it: `feat/057-cinematic-landing`.

## Goal
Rebuild `app/[locale]/page.tsx` as a 1:1 section-for-section clone of
sequel.co, using 10 new reusable cinematic primitives. Dark luxury palette,
display serif (Fraunces), typography-first, zero illustrations.

## Sections (in order, matching sequel.co exactly)
1. **Hero** — full-bleed background video + custom player chrome
   (play/pause, mute, timer, fullscreen, restart). Split-letter headline
   "The process is the product." Two CTAs: "Watch the film" / "Read the spec".
2. **Mission** — huge split-word scroll-reveal heading pulled/adapted from
   `.specify/memory/constitution.md`.
3. **Two-card editorial row** — "For the builder" + "For the process",
   image + label + H2 + one line + arrow.
4. **Manifesto block** — centered "We believe in…" 5 stacked lines, adapted
   from constitution.md. "Read the constitution" CTA.
5. **Value section** — split-letter heading + 4-card testimonial grid
   (placeholder quotes, Unsplash avatars, fake names/roles, tagged
   "Spec 001" / "Spec 023" etc).
6. **Stats + logo marquee** — split-letter heading + 4 counters animating
   from 0 (Specs shipped / Tasks merged / Green CI runs / Scripts enforced —
   hardcoded practice numbers, `// PRACTICE` comment) + infinite horizontal
   marquee of our real stack logos.
7. **Closing CTA** — split-letter headline + paragraph + link.
8. **Footer** — massive "Blueprint" wordmark + 2 nav columns + email + socials.

## Components to build (`components/cinematic/`)
- `SplitHeading.tsx` — server-renders each letter in its own `<span>`,
  reveals via IntersectionObserver + CSS `@keyframes` staggered by index.
  Props: `text`, `as` (h1/h2), `className`.
- `ScrollReveal.tsx` — word-by-word reveal wrapper, same IO pattern.
- `EditorialCard.tsx` — `image`, `label`, `title`, `body`, `href`.
- `ManifestoBlock.tsx` — centered stacked-line block, lines from constitution.
- `TestimonialGrid.tsx` — 4-card grid with placeholder content.
- `StatCounter.tsx` — IntersectionObserver + requestAnimationFrame count-up.
  Props: `from`, `to`, `prefix`, `suffix`, `label`, `duration`.
- `LogoMarquee.tsx` — infinite CSS marquee, doubled list, pauseable on hover.
- `ClosingCTA.tsx` — split-letter headline + paragraph + link.
- `WordmarkFooter.tsx` — display-serif wordmark + nav columns.
- Extend existing `CinematicHero` from task 056 — do not rebuild. Add
  background video slot, custom controls, split-letter headline overlay.

## Assets to fetch (free, CC0, no attribution required)
- **Hero video**: 1 cinematic clip from Pexels Videos or Coverr. Slow
  abstract motion or hands-typing or night-city. MP4, <10MB, 1920x1080.
  Save to `public/video/hero.mp4`.
- **Editorial card images**: 2 from Unsplash (CC0). Save to
  `public/images/editorial/*.jpg`.
- **Testimonial avatars**: 4 from Unsplash (CC0). Save to
  `public/images/avatars/*.jpg`.
- **Stack logos**: pull SVGs from simpleicons.org (MIT licensed) for
  Next.js, Supabase, Vercel, Tailwind, Sentry, Playwright, Vitest, GitHub,
  TypeScript, Framer Motion. Save to `public/logos/*.svg`.
- **Font**: Fraunces from Google Fonts via `next/font`.

## Content rules
- All strings go through `t()` — i18n discipline is non-negotiable.
  Add keys to `messages/en.json`, `fr.json`, `ar.json`, `nl.json`.
- Placeholder copy is fine. Invent Blueprint-flavored lines. Keep it
  short, editorial, tight leading. Examples:
  - Hero: "The process is the product."
  - Mission: "Specs, not guesses. Scripts, not claims. Green, not hope."
  - Manifesto lines: pull real sentences from `.specify/memory/constitution.md`.
- Testimonials are clearly fake (e.g., "— Alex R., Spec 014"). Do not
  impersonate real people.
- Stats are hardcoded with `// PRACTICE — not wired to Supabase` comment.

## Process
1. `git checkout -b feat/057-cinematic-landing fix/056-cinematic-silent-failure`
2. Write `specs/057-cinematic-landing/spec.md`, `plan.md`, `tasks.md`.
3. Fetch assets.
4. Build the 10 components.
5. Rewrite `app/[locale]/page.tsx` using them in sequel.co order.
6. Add i18n keys in all 4 locales.
7. Run all 9 scripts. Save logs to `.logs/057.log`.
8. Open PR against `main` (or against `fix/056...` if 056 hasn't merged).
9. Wait for Vercel preview. Paste preview URL + green CI badge in
   `.opus/outbox/057-reply.md`.
10. Bookkeeping commit: `.logs/057.log` + `.opus/outbox/057-reply.md` +
    this inbox file, on the same task branch. Remember task 018.

## Forbidden
- Do not touch any file outside `app/[locale]/page.tsx`,
  `components/cinematic/*`, `messages/*.json`, `public/video/*`,
  `public/images/*`, `public/logos/*`, `specs/057-*/*`, `.logs/057.log`,
  `.opus/outbox/057-reply.md`.
- No `console.log`, no `@ts-ignore`, no files over 500 lines.
- Do not type the PEM BEGIN/END dashes-RSA-dashes wrapper anywhere.
  Paraphrase if you reference key formats.
- Do not mark done. Opus verifies the Vercel preview in Chrome and marks done.

## Acceptance
- Vercel preview loads, hero video plays, split-letter headline reveals on
  load, scroll reveals fire, counters count up, marquee scrolls, all 4
  locales switch without layout break, Lighthouse perf > 85, a11y > 95,
  no console errors, no network 404s. All 9 scripts green. CI green.

Dispatched by Opus, 2026-04-08.
