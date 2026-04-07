# Blueprint Lab — Roadmap

> **Vision:** A single cinematic scrolling website that proves a non-technical solo founder, with the right process and the right AI agents, can ship things that look like they came out of a 30-person San Francisco studio.
>
> **The one-line pitch:** _"This entire website was built by the process it documents — and you can watch it being built, in real time, as you scroll."_
>
> Every animation, every component, every word on the page has a `spec_id` attribute. Hover anything → a tooltip shows you the spec, the PR, the commit hash, the CI run, the Vercel deploy that brought it into existence. **The site is its own receipt.**

---

## Why this exists

The Blueprint is the rehearsal before the NissMatch web rebuild. If we can't ship this with the spec-driven process, we can't ship NissMatch with it. But it's also more than a rehearsal — it becomes Chainbeard's single most valuable sales asset for the next decade. When a future investor, employee, or NissMatch user asks _"who built this?"_, the answer is: _"My AI agents, supervised by me, using a process I can show you live. Watch."_ Scroll once. Argument over.

---

## Source of truth

This file is one of two sources of truth (the other is `.specify/memory/constitution.md`). If anything contradicts this, this document wins.

---

## The six chapters

The site is one document, scrolled top to bottom. It has six chapters. Each chapter is a milestone. Each chapter is a wow moment that costs effort. Each chapter ends with a _"look behind the curtain"_ button that opens the actual spec / PR / CI run that built it.

### M1 — _"The Cursor"_ — the opening 12 seconds

The first 8 seconds of the experience. Black screen, silent. A blinking monospace cursor types `$ git log --oneline | head -1`. Hits enter. A real commit hash + message appears, pulled live from the GitHub API — visitors just watched the page query its own repo. The terminal then dissolves into thousands of particles that reform into a 3D wireframe Mercator earth with one glowing dot in Casablanca. Lenis scroll engages. As the visitor scrolls, particles flow upward through a 3D pipeline of glowing nodes labeled `SPECIFY → PLAN → TASKS → IMPLEMENT → PR → CI → PREVIEW → DEPLOY`. Each node lights up. Final node is a Vercel logo. White flash. Smash cut to a hero line set in 220px Cabinet Grotesk: **"Built by the process it teaches."** Below it in mono: `commit <sha> · <N> specs · <N> tasks · 0 lies`.

**Stack:** Three.js (particle system + earth), GSAP ScrollTrigger (timeline), Lenis (smooth scroll), Cabinet Grotesk + JetBrains Mono (typography), GitHub API (live commit data).

**Spec:** `specs/001-the-cursor/`

---

### M2 — _"The Process, Animated"_

A scroll-jacked horizontal journey across the screen. Each of the 8 process steps (Vision → Roadmap → /specify → /plan → /tasks → /implement → PR → CI → Deploy) is a glassmorphic card with live data: how many specs we've written, how many PRs are open, average CI time, last deploy timestamp. The cards flip on hover to reveal the _why_ of that step. Built with GSAP ScrollTrigger horizontal pinning + Tremor charts.

**Stack:** GSAP ScrollTrigger horizontal pinning, Aceternity glassmorphic cards, Tremor for inline data, Framer Motion for hover flips.

**Spec:** `specs/002-process-animated/`

---

### M3 — _"The Receipts"_ — the part that converts skeptics

A bento grid of live widgets, all pulling real data:

- **GitHub Actions badge wall** — last 20 CI runs as a green/red heatmap, hover to see commit
- **Sentry error pulse** — a heartbeat that beats once per error in the last 24h (normally 0)
- **Vercel deploy timeline** — a horizontal river of every prod deploy with hover-to-inspect
- **Plausible visitor counter** — live page views today
- **Supabase row count by table** — proof the database is real
- **Spec velocity chart** — specs shipped per week as a sparkline

Every widget pulls live data from real APIs. Every widget has a _"view source spec"_ link that opens the spec that built it.

**Stack:** Tremor + Recharts for charts, GitHub Actions API, Sentry API, Vercel API, Plausible API, Supabase client.

**Spec:** `specs/003-receipts/`

---

### M4 — _"The Spec Browser"_ — the practical part that teaches

A searchable, filterable, beautifully-typeset reader for every spec we've written. Like a documentation site but with motion. Each spec has its plan, tasks, PR, CI run, preview URL, and commit history — all linked, all live. Built like the Linear changelog page with command-K search. People will actually learn the spec-driven process by reading this.

**Stack:** MDX for spec rendering, Fuse.js for client-side search, cmdk for command palette, Aceternity timeline component.

**Spec:** `specs/004-spec-browser/`

---

### M5 — _"The Glossary & Constitution"_

Every technical term in the site is hover-highlighted (BDD, ATDD, RLS, CI/CD, spec-kit, etc). Hover → a card slides in from the right with a 1-sentence definition + a link to the constitution principle that governs it. The constitution itself becomes an 11-card stacked-paper view (Aceternity card stack effect) where each principle flips open to show real examples drawn from our specs.

**Stack:** Aceternity card stack, Radix tooltip, custom MDX directive for term highlighting.

**Spec:** `specs/005-glossary-constitution/`

---

### M6 — _"The Mirror"_ — the closer

The final scroll section. The page asks: _"Want to see how this page was built?"_. Clicking it triggers a **scroll replay** — the visitor watches the entire page rebuild itself in fast-forward, with each component fading in alongside its spec ID, commit hash, and CI badge floating beside it. Then the closing line: _"Now build yours."_ with a single CTA button to the GitHub repo. Outro: a slow zoom out of the 3D earth, back to the blinking cursor.

**Stack:** GSAP timeline replay, custom DOM walker that reads `data-spec-id` attributes from every element, Three.js scene reuse from M1.

**Spec:** `specs/006-the-mirror/`

---

## Inspiration sources (the studied references)

These are the sites and libraries we'll be studying frame-by-frame and stealing patterns from. Each one is on this list for a specific reason.

**For the cinematic scroll language:**

- [linear.app](https://linear.app) — gold standard for "tech product as cinema"
- [vercel.com](https://vercel.com) — monospace numbers, live data widgets, deploy state animations
- [rauno.me](https://rauno.me) — technical brutalism + craft
- [igloo.inc](https://igloo.inc) and [lusion.co](https://lusion.co) — the WebGL flex
- [bruno-simon.com](https://bruno-simon.com) — audacity benchmark
- [stripe.com](https://stripe.com) — gradient mesh + parallax depth
- [Awwwards Site of the Day archive](https://www.awwwards.com/websites/) — micro-interaction studies
- [Codrops](https://tympanus.net/codrops/) — GSAP/ScrollTrigger tutorials

**For the components:**

- [21st.dev](https://21st.dev) — the new community-curated component library; we lift hero variants, bento grids, terminal components, marquees
- [Aceternity UI](https://ui.aceternity.com) — already in stack; background beam, spotlight card, 3D card hover, card stack, glowing border
- [Magic UI](https://magicui.design) — already in stack; animated counters, marquees, dock, particles
- [Once UI](https://once-ui.com) — beautiful typography defaults
- [shadcn/ui](https://ui.shadcn.com) — base layer, locked

**For typography:**

- [Fontshare](https://fontshare.com) — Cabinet Grotesk (display), JetBrains Mono (code), Switzer (body) — all free pro fonts
- [Pangram Pangram](https://pangrampangram.com/) — optional one-time $80 statement display font

**For data viz:**

- [Tremor](https://tremor.so) — Vercel/Linear-grade charts, pairs with shadcn
- [Recharts](https://recharts.org) — already in stack via shadcn

**For motion specifically:**

- [GSAP showcase](https://gsap.com/showcase/) — already in stack; the bible
- [Framer Motion examples](https://www.framer.com/motion/examples/) — already in stack; component-level
- [Lenis demos](https://lenis.darkroom.engineering/) — already in stack; smooth scroll foundation

---

## Asset plan

We need almost no traditional assets because the cinematic stack generates beauty from code. The full asset budget is:

| Asset                                            | Source                                     | Cost               |
| ------------------------------------------------ | ------------------------------------------ | ------------------ |
| Cabinet Grotesk + Switzer + JetBrains Mono fonts | [fontshare.com](https://fontshare.com)     | Free               |
| Hero gradient mesh background (1 SVG)            | [meshgradient.in](https://meshgradient.in) | Free               |
| Favicon + OG image                               | Code Agent generates from a Lucide icon    | Free               |
| Optional: Casablanca night photo for M6          | [Unsplash](https://unsplash.com)           | Free + attribution |
| Optional: 2 short demo videos for M3+            | Chainbeard's Windows screen recorder       | Free, 2 min each   |

**Total: $0.** Everything else is procedurally generated, code-driven, or live data. This is part of the proof — the site is impressive _because_ a solo founder shipped it without a designer.

---

## What's NOT in this roadmap (and why)

- **A blog.** The spec browser (M4) is the blog. Every spec is an essay.
- **Marketing pages (pricing, features, testimonials).** This is not a SaaS landing page. It's a single document.
- **Multiple themes.** One direction, executed perfectly. Dark mode is the default and only mode.
- **Animations for animation's sake.** Every motion serves the message "this is real."
- **Stock illustrations or 3D mascots.** They cheapen the craft.

---

## Status

| Milestone                        | Status                |
| -------------------------------- | --------------------- |
| M0 — Foundation (PR #1)          | ✅ shipped 2026-04-07 |
| M1 — The Cursor                  | 📝 spec being written |
| M2 — The Process, Animated       | ⏳ queued             |
| M3 — The Receipts                | ⏳ queued             |
| M4 — The Spec Browser            | ⏳ queued             |
| M5 — The Glossary & Constitution | ⏳ queued             |
| M6 — The Mirror                  | ⏳ queued             |

---

## Pace

There is no deadline. Each chapter ships when its spec is green and Chainbeard says _"wow."_ If a chapter doesn't make him say wow, it gets re-spec'd, not shipped. **The Blueprint is allowed to take as long as it takes.** The point is the proof, not the speed.
