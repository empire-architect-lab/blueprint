# Task 003 — Run spec-kit for Spec 001: "The Cursor"

**From:** Cowork Opus
**Date:** 2026-04-07
**Goal:** Use the spec-kit workflow to produce `specs/001-the-cursor/` (spec.md + plan.md + tasks.md), then STOP and write the outbox reply. Do NOT implement yet — implementation is the next task after Opus reviews the generated artifacts.

---

## CRITICAL — Read this first

1. **You MUST write `.opus/outbox/003-reply.md` when done.** Reply must include: paths of all generated files, the slash commands you ran (with arguments), any clarifications spec-kit asked for and how you answered them, and any deviations from this brief.
2. **Do NOT implement code in this task.** Only run `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`. Implementation happens in Task 004 after Opus reviews.
3. **Branch:** create a new branch `spec/001-the-cursor` off `main`. Do NOT push or open a PR — leave it local. Opus will review the files in the workspace before authorizing the PR.

---

## Context — read before specifying

1. Read `ROADMAP.md` (just landed in `main`) — specifically the **M1 — *"The Cursor"*** section. That is the source of truth for what this spec must capture.
2. Read `memory/constitution.md` — every spec must comply with the principles.
3. Read `specs/000-foundation/tasks.md` to understand the tech that's already wired (Next.js 16, GSAP, Lenis, Three.js is NOT yet installed, Aceternity NOT yet installed, Magic UI NOT yet installed, Cabinet Grotesk NOT yet installed). This spec will need to add: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` (already wired? verify), `lenis` (verify), Cabinet Grotesk + JetBrains Mono fonts via `next/font` from Fontshare CDN.

---

## The brief to feed `/speckit.specify`

Run this exact command in Code Agent (the slash command will prompt for input — paste the brief block below as the "$ARGUMENTS" input):

```
/speckit.specify
```

**Brief to paste as input:**

> Build the opening 12-second cinematic sequence of the Blueprint Lab homepage, codenamed "The Cursor." This is M1 in ROADMAP.md.
>
> **Visitor experience (the only thing that matters):**
>
> A first-time visitor lands on `/`. The screen is pure black. After 400ms a single blinking monospace cursor appears, centered. The cursor types out the literal string `$ git log --oneline | head -1` character by character at ~80ms per character. After typing completes, there's a 600ms pause, then the cursor "presses enter" (a soft click sound, optional, feature-flagged off by default). On the next line, a real commit hash and message appears — fetched live from the GitHub API for the `empire-architect-lab/blueprint` repo at request time. The line uses the format `<short-sha> <commit message>`. After 1.2 seconds of letting the visitor read it, the entire terminal scene dissolves: every character disintegrates into thousands of glowing particles that scatter, swirl, and reform into a 3D wireframe Mercator projection of Earth. The earth has exactly one glowing dot at the latitude/longitude of Casablanca (33.5731°N, 7.5898°W). At this moment, Lenis smooth scroll engages and the page becomes scrollable. As the visitor scrolls down, the camera flies upward through the earth and into a 3D pipeline of 8 glowing nodes labeled `SPECIFY → PLAN → TASKS → IMPLEMENT → PR → CI → PREVIEW → DEPLOY`, each lighting up sequentially as the camera passes. The final node is a Vercel logo. When the camera passes the Vercel node, the screen flashes pure white for 120ms then smash-cuts to a hero section: a single line of 220px Cabinet Grotesk reading "Built by the process it teaches." Below it, in 18px JetBrains Mono: `commit <real-sha> · <real-spec-count> specs · <real-task-count> tasks · 0 lies`. All four numbers are real, fetched from the GitHub API and the local `specs/` folder at build time.
>
> **Functional requirements:**
> - The GitHub API call must be cached at the edge for 60 seconds (Vercel edge function or Next.js fetch cache).
> - If the GitHub API fails, fall back to a hardcoded recent commit so the experience never breaks.
> - The whole sequence must be skippable: a small "skip intro" link in the bottom-right corner from the moment the cursor appears, which jumps directly to the hero section.
> - The sequence must be replayable: a small "replay intro" button in the hero section's bottom-right.
> - The whole experience must respect `prefers-reduced-motion`: if the visitor's OS has reduced motion enabled, the cinematic is replaced with a static fade-in of the hero section + a subtitle "Cinematic intro disabled per your motion preferences."
> - The page must be fully accessible: keyboard navigable, screen reader friendly (the hero text is real DOM text, not canvas), all interactive elements have aria labels.
> - Mobile fallback: on screens narrower than 768px, the 3D earth and pipeline are replaced with a vertical 2D SVG version of the same animation. Same beats, same payoff, no Three.js on mobile.
>
> **Non-functional requirements:**
> - First Contentful Paint under 1.5s on a 4G connection.
> - Lighthouse performance score >= 85 on mobile, >= 95 on desktop.
> - Total JavaScript bundle for this page must be code-split such that the Three.js portion lazy-loads after the first paint.
> - Zero console errors or warnings.
> - All text content for the sequence must be in `messages/en.json` (i18n-ready, even though only en is wired right now).
>
> **Out of scope for this spec:**
> - The other 5 chapters of the homepage (M2-M6).
> - The "spec_id hover tooltip" system (that's spec 005).
> - Any Supabase-backed content.
> - Authentication.
>
> **Acceptance scenario for the BDD test:**
> Given a first-time visitor on a desktop Chrome browser with motion enabled, when they navigate to `/`, then they see a black screen, then a typing cursor, then a real commit hash, then a particle dissolve into a 3D earth, then a scroll-driven flythrough of 8 glowing pipeline nodes, then a white flash, then a hero section with the line "Built by the process it teaches" and a real metadata line below it — and the whole sequence completes within 14 seconds of page load.

---

## After `/speckit.specify` finishes

1. Read the generated `specs/001-the-cursor/spec.md`.
2. If spec-kit asked for clarifications during `/speckit.specify`, answer them using the brief above as your reference. Document each Q&A in the outbox reply.
3. Run `/speckit.plan`. Spec-kit will read the spec and produce `plan.md` outlining the technical approach. If it asks for stack decisions, the answers are: Three.js + @react-three/fiber + @react-three/drei for the 3D scene; GSAP + ScrollTrigger for the timeline; Lenis for smooth scroll; Cabinet Grotesk + JetBrains Mono via `next/font` from Fontshare; Next.js edge runtime for the GitHub API proxy with 60s revalidate; Tailwind 4 for non-3D styling.
4. Run `/speckit.tasks`. Spec-kit will produce `tasks.md` with a numbered task list. Do NOT execute the tasks — leave them for Task 004.
5. Verify all three files exist: `specs/001-the-cursor/spec.md`, `specs/001-the-cursor/plan.md`, `specs/001-the-cursor/tasks.md`.
6. Run `git status` to confirm only those three files (plus the new branch) are changed.
7. Commit them locally on `spec/001-the-cursor` with message: `docs(spec-001): generate spec, plan, tasks for "The Cursor" via spec-kit`. Do NOT push.
8. Write `.opus/outbox/003-reply.md`.

---

## Reply file required structure

```markdown
# Task 003 Reply

**Status:** done | partial | blocked
**Branch:** spec/001-the-cursor (local only, not pushed)
**Local commit:** <full sha>

## Files generated
- specs/001-the-cursor/spec.md (NN lines)
- specs/001-the-cursor/plan.md (NN lines)
- specs/001-the-cursor/tasks.md (NN tasks)

## Slash commands run
1. /speckit.specify — input: <first 100 chars of the brief>... — output: specs/001-the-cursor/spec.md
2. /speckit.plan — output: specs/001-the-cursor/plan.md
3. /speckit.tasks — output: specs/001-the-cursor/tasks.md

## Clarifications spec-kit asked + how I answered
- Q: <question>
  A: <answer + which part of the brief I used>

## Notable decisions in the generated artifacts
- <e.g. "spec.md broke the experience into 4 user stories P1-P4">
- <e.g. "plan.md proposed Three.js r163 (latest stable)">
- <e.g. "tasks.md generated 22 tasks">

## Deviations from the brief
- <none | list>

## Open questions for Opus
- <none | list>
```

Once this file exists, Opus will read all three generated artifacts, redline them if needed, and dispatch Task 004 (implementation) — or send back a clarification round if the artifacts miss the vision.
