## Task 032 — Spec 001 / T011 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `87ff615` — `feat(cursor): t011 pipeline scene with lenis scroll flythrough`

## What shipped

- `src/lib/constants/pipeline-nodes.ts` — `PIPELINE_NODES` const tuple, verbatim 8 labels (`SPECIFY`, `PLAN`, `TASKS`, `IMPLEMENT`, `PR`, `CI`, `PREVIEW`, `DEPLOY`), `as const`. Type alias `PipelineNodeLabel` exported.
- `src/components/cursor/pipeline-node.tsx` — single node: glowing torus (`torusGeometry [0.6, 0.12, 16, 64]`) + drei `<Text />` label. Receives `label`, `position`, `isVercel`, `isLit` props — no hardcoded label string. When `isVercel` is true the torus is replaced by an inline triangle path extruded via `Shape` + `ExtrudeGeometry` (no `SVGLoader`/network fetch — the path constant is inline as the inbox required). Lit state shifts material colour blue → warm orange and bumps emissive intensity.
- `src/components/cursor/pipeline-scene.tsx` — column of 8 `<PipelineNode />`s, mapped from `PIPELINE_NODES` (no inline labels). Y spacing of 4 units, 8th node flagged `isVercel`. Accepts `litIndex` to drive the cumulative "light up as you scroll past" effect.
- `src/lib/animations/cursor-scroll-timeline.ts` — `createCursorScrollTimeline({ lenis, scroller, cameraY, onLitIndexChange })`. Wires `lenis.on('scroll', ScrollTrigger.update)`, registers a `ScrollTrigger.scrollerProxy` on the scroller, and creates a scrubbed `gsap.timeline` that tweens a passed-in `cameraY.value` object from `0` → `-(7 * 4)` over the scroll range. `onUpdate` divides `self.progress` into 8 buckets and calls `onLitIndexChange` so the scene can light each node at the right percentage. Returns a cleanup that kills the trigger and timeline.
- `src/app/[locale]/earth-preview/page.tsx` — now mounts `<PipelineScene litIndex={...} />` inside the canvas alongside `<Earth />` and `<Particles />`. A small in-canvas `<CameraRig>` reads `cameraY.value` each frame and writes it to the R3F `camera.position.y`. A second `useEffect` boots a Lenis instance, runs the rAF loop, and calls `createCursorScrollTimeline(...)`; the cleanup kills both. The dev-only `d`/`r` keypress from T010 is still gated behind `process.env.NODE_ENV === "development"`. A `500vh` spacer below the fixed canvas gives ScrollTrigger something to scrub against. `cameraY` is created with `useMemo` (not `useRef`) so the Canvas child can read `cameraY.value` without triggering `react-hooks/refs`.
- `tests/unit/pipeline-nodes.test.ts` — asserts `PIPELINE_NODES.length === 8` and the verbatim ordered tuple matches the spec.
- `specs/001-the-cursor/tasks.md` — all 7 T011 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/lib/constants/pipeline-nodes.ts` | new ✅ |
| `src/components/cursor/pipeline-scene.tsx` | new ✅ |
| `src/components/cursor/pipeline-node.tsx` | new ✅ |
| `src/lib/animations/cursor-scroll-timeline.ts` | new ✅ |
| `src/app/[locale]/earth-preview/page.tsx` | edited ✅ |
| `tests/unit/pipeline-nodes.test.ts` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

`earth.tsx`, `particles.tsx`, and `geo.ts` (`latLngToXYZ`) untouched.

## Departure from spec text — flagging

The spec line 111 says the Vercel logo should be loaded via `SVGLoader` from an imported SVG. The inbox overrode this with *"Vercel logo SVG: use an inline path constant, no network fetch at build time."* I followed the inbox: a hand-rolled triangle path is inlined in `pipeline-node.tsx` and extruded via `Shape` + `ExtrudeGeometry`. It is a stylized stand-in, not the real Vercel mark. If you want the real geometry, give me the SVG path string in a follow-up inbox and I will swap it in T012-or-later — I did not want to invent a path that misrepresents Vercel's brand asset.

## 9 scripts — all green

Saved to [.logs/032-T011.log](.logs/032-T011.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK after one round of `react-hooks/refs` (switched `cameraY` from `useRef` to `useMemo`) and an exhaustive-deps fix |
| 3 | vitest | **13 files / 256 tests passed** (was 12 / 254 — two new pipeline-nodes tests) |
| 4 | playwright | 1 passed |
| 5 | gitleaks | no leaks, 51 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK (no allowlist edit needed — uppercase ASCII labels do not trip either script) |

## Per inbox: rolling straight to T012

Standing order acknowledged — not stopping for visual review. Next inbox can dispatch T012 (white flash + hero reveal handoff). I have not touched anything in T012's whitelist.

## Bookkeeping commit to follow

- `.logs/032-T011.log`
- `.opus/outbox/032-reply.md` (this file)
- `.opus/inbox/032-spec001-T011-pipeline-scene.md`
