# Spec 057 — Cinematic Landing (sequel.co structural clone)

## Intent

Rebuild `app/[locale]/page.tsx` as a 1:1 section-for-section structural
clone of https://sequel.co, using 10 new reusable cinematic primitives.
PRACTICE project — Blueprint-flavored placeholder content, no backend
wiring, no real data. Pure UI/motion practice.

## Non-goals

- No Supabase integration. No real stats. No real testimonials.
- No real sequel.co copy (trademark / voice). Invent Blueprint lines.
- No rebuild of `CinematicHero` from task 056 — extend it.
- No touching product code outside the whitelist in `tasks.md`.

## Sections (in order)

1. **Hero** — full-bleed background video, custom player chrome,
   split-letter headline "The process is the product.", two CTAs.
2. **Mission** — huge split-word scroll-reveal heading adapted from
   `.specify/memory/constitution.md`.
3. **Two-card editorial row** — "For the builder" + "For the process".
4. **Manifesto block** — centered "We believe in…" 5 stacked lines.
5. **Value section** — split-letter heading + 4-card testimonial grid
   (clearly fake names, tagged with spec IDs).
6. **Stats + logo marquee** — 4 counters (PRACTICE values, commented)
   - infinite marquee of real stack logos.
7. **Closing CTA** — split-letter headline + paragraph + link.
8. **Footer** — "Blueprint" wordmark + 2 nav columns + email + socials.

## Content rules

- All strings through `t()`. Keys added to `messages/{en,fr,ar,nl}.json`.
- Fake testimonials tagged "— Alex R., Spec 014" etc. No real people.
- Stats hardcoded with `// PRACTICE — not wired to Supabase` comment.
- Typography: Fraunces (display serif) via `next/font`.
- Palette: dark luxury (near-black background, ivory text, one accent).

## Acceptance

- Vercel preview loads without error.
- Hero video plays, split-letter headline reveals on mount.
- Scroll reveals fire on entry (word-by-word).
- Counters animate 0 → target on viewport enter.
- Logo marquee scrolls infinitely, pauses on hover.
- All 4 locales switch without layout break.
- Lighthouse perf > 85, a11y > 95.
- No console errors, no 404s.
- All 9 Blueprint scripts green. CI green on PR.

## Source

Dispatched via `.opus/inbox/057-cinematic-landing-sequel-clone.md`
(2026-04-08). This spec is the canonical contract for task 057.
