# Plan 057 — Cinematic Landing

## Architecture

10 server-rendered primitives in `components/cinematic/`, composed by
`app/[locale]/page.tsx`. Motion is CSS-driven (`@keyframes` + class
toggles via IntersectionObserver). No GSAP runtime, no Framer Motion
for these primitives — Astro-style "HTML-first, hydrate tiny islands"
discipline, but inside Next. Each primitive that needs JS is a client
component wrapping pure DOM; everything else is RSC.

## Component inventory

| File                                         | Client? | Role                                         |
| -------------------------------------------- | ------- | -------------------------------------------- |
| `components/cinematic/SplitHeading.tsx`      | No      | Server-split letters into spans; CSS reveal  |
| `components/cinematic/ScrollReveal.tsx`      | Yes     | IO-triggered `.in-view` class toggle wrapper |
| `components/cinematic/EditorialCard.tsx`     | No      | Image + label + title + body + arrow link    |
| `components/cinematic/ManifestoBlock.tsx`    | No      | Centered stacked-line "We believe in…" block |
| `components/cinematic/TestimonialGrid.tsx`   | No      | 2×2 card grid, data via props                |
| `components/cinematic/StatCounter.tsx`       | Yes     | IO + rAF count-up                            |
| `components/cinematic/LogoMarquee.tsx`       | No      | Infinite CSS marquee, doubled list           |
| `components/cinematic/ClosingCTA.tsx`        | No      | SplitHeading + paragraph + link              |
| `components/cinematic/WordmarkFooter.tsx`    | No      | Massive wordmark + nav columns               |
| `components/hero/CinematicHero.tsx` (extend) | Yes     | Add bg video slot + split-letter overlay     |

All client components are under 200 lines. No file exceeds 500.

## Assets

- `public/video/hero.mp4` — 1 Pexels/Coverr CC0 clip, <10MB, 1080p
- `public/images/editorial/{builder,process}.jpg` — Unsplash CC0
- `public/images/avatars/{01..04}.jpg` — Unsplash CC0
- `public/logos/*.svg` — simpleicons.org (MIT): next, supabase, vercel,
  tailwindcss, sentry, playwright, vitest, github, typescript, framer
- Fraunces via `next/font/google` in `app/[locale]/layout.tsx`
  (if already present, reuse; else add under font whitelist comment)

## Motion techniques

- **Split letters**: server render `text.split('')` → spans with
  `style={{'--i': index}}`. CSS animation delay `calc(var(--i) * 30ms)`.
- **Reveal on scroll**: one small client component with an IO that
  adds `.in-view` to children on first intersection. Root margin -10%.
- **Counters**: `useEffect` IO + `requestAnimationFrame` ease-out.
- **Marquee**: `@keyframes translate3d(0) → translate3d(-50%)` on a
  container with the logo list duplicated; `animation-play-state: paused`
  on `:hover`.

## i18n

New namespace: `landing` in all 4 locale files. ~35 keys (headlines,
body copy, CTAs, manifesto lines, testimonial names/roles, stat labels,
footer nav). Arabic gets RTL-friendly layout (flex flip already
handled globally).

## Risks

- **Pexels/Unsplash hotlink policy**: download to `public/`, never
  hotlink. Check file size stays <10MB for hero video.
- **CinematicHero regression**: task 056 is mid-fix. Extending it
  risks re-introducing the silent failure. Mitigation: keep the new
  `backgroundVideoSrc` prop **optional**; only the new landing page
  passes it. Existing callers unchanged.
- **Split-letter a11y**: per-letter spans break screen readers. Fix:
  wrap the whole heading in `aria-label={text}` and give each span
  `aria-hidden="true"`.
- **Marquee perf**: use `will-change: transform` sparingly; only the
  moving container. No box-shadows on logos.
- **RTL in Arabic**: marquee direction should flip. Use `dir="ltr"` on
  marquee container so it scrolls consistently.
- **Lighthouse perf budget**: hero video autoplay is the risk. Use
  `preload="metadata"`, `poster` image, `playsInline muted loop`.

## Whitelist (only files I may touch)

```
app/[locale]/page.tsx
components/cinematic/**
components/hero/CinematicHero.tsx     (careful — extend, don't rebuild)
messages/en.json
messages/fr.json
messages/ar.json
messages/nl.json
public/video/hero.mp4                 (new)
public/images/editorial/*.jpg         (new)
public/images/avatars/*.jpg           (new)
public/logos/*.svg                    (new)
specs/057-cinematic-landing/*
.logs/057.log
.opus/outbox/057-reply.md
.opus/inbox/057-cinematic-landing-sequel-clone.md   (bookkeeping consume)
```

Everything else is out of scope. If a linked fix is needed outside
the whitelist, stop and raise a blocker in `.opus/blockers/`.
