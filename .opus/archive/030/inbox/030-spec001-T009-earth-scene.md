# Task 030 — Spec 001 / T009 — Earth scene (Three.js wireframe globe)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue — commits feed rolling draft PR #15)
**Depends on:** T008 (task 029) — DONE.

## Context
Spec 001 / T009 from `specs/001-the-cursor/tasks.md`. First visual slice of the cinematic intro: a Three.js wireframe earth globe with a glowing Casablanca dot. Plan reference: `specs/001-the-cursor/plan.md` — "3D engine" row of the stack table (Three.js 0.163, R3F 9, drei 10, already installed in T001).

This task produces the earth as a reusable component. It is NOT yet wired into the homepage (T015/T016 wire the router). To verify the visual, add a dev-only temporary mount point at `/earth-preview` (dev route, not shipped to prod) so Opus can see it on the Vercel preview.

## Scope (T009 checkbox list, verbatim + dev preview route)
1. `src/lib/three/geo.ts` (new):
   - `export function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number]`
   - Standard spherical-to-cartesian: `phi = (90 - lat) * (π/180); theta = (lng + 180) * (π/180); x = -radius * sin(phi) * cos(theta); z = radius * sin(phi) * sin(theta); y = radius * cos(phi)`
   - Unit test at `tests/unit/lat-lng-to-xyz.test.ts`: assert north pole (90, 0, r) → (0, r, 0), equator/prime meridian (0, 0, r) → (-r, 0, 0) per the formula above, Casablanca (33.5731, -7.5898, 2) → known expected triple (compute once, hardcode for regression). Use `toBeCloseTo` with precision 5 because of float math.

2. `src/components/cursor/earth.tsx` (new, `"use client"`):
   - Imports `IcosahedronGeometry`, `MeshBasicMaterial`, `Mesh`, `SphereGeometry`, `MeshStandardMaterial` from `three`
   - Renders an R3F `<mesh>` with `<icosahedronGeometry args={[2, 32]} />` and `<meshBasicMaterial wireframe color="#4a9eff" />` — radius 2, 32 subdivisions
   - Renders a nested `<mesh>` at the Casablanca position (use `latLngToXYZ(33.5731, -7.5898, 2.02)` so the dot sits just outside the wireframe surface): `<sphereGeometry args={[0.04, 16, 16]} />` + `<meshStandardMaterial emissive="#ffaa00" emissiveIntensity={2} color="#ffaa00" />`
   - Slow rotation via `useFrame((_, delta) => { groupRef.current.rotation.y += delta * 0.1 })` on the wrapping `<group>`
   - Component takes no props; defaults encoded inline per the spec

3. `src/components/cursor/earth-scene.tsx` (new, `"use client"`):
   - Imports `Canvas` from `@react-three/fiber`
   - Renders `<Canvas camera={{ position: [0, 0, 6], fov: 50 }} aria-hidden="true">` wrapping `<ambientLight intensity={0.4} />`, `<directionalLight position={[5, 5, 5]} intensity={1} />`, and `<Earth />`
   - The wrapping `<div data-role="earth" className="w-full h-full">` holds the canvas
   - No `<OrbitControls>` (intro is cinematic, not interactive)

4. `src/components/cursor/earth-scene-dynamic.tsx` (new, `"use client"`):
   - Dynamic import wrapper using `next/dynamic`: `const EarthScene = dynamic(() => import("./earth-scene").then(m => m.EarthScene), { ssr: false, loading: () => null })`
   - Exports the dynamic component as the default
   - This is the component other tasks should import — never import `earth-scene.tsx` directly from a server component

5. `src/app/[locale]/earth-preview/page.tsx` (new, dev preview route):
   - `"use client"` page that renders `<main className="w-screen h-screen bg-black"><EarthScene /></main>`
   - Imports the dynamic wrapper from `@/components/cursor/earth-scene-dynamic`
   - Exists so Opus can visually confirm T009 on the Vercel preview at `/en/earth-preview`. This route will be removed in T016 when the real homepage is wired. Add a comment at the top: `// TEMP: removed in T016. Preview-only route for T009 visual verification.`

6. Tick T009 boxes in `specs/001-the-cursor/tasks.md` in the same commit (Principle 10)

## Constraints
- No new dependencies. Three, R3F, drei already installed.
- Canvas MUST be `aria-hidden="true"` — the 3D scene is decorative, not content
- No OrbitControls, no mouse interaction, no stats overlay
- The dev preview route is temporary — it gets deleted in T016. Do not wire it into any navigation.
- Do not touch `src/app/[locale]/page.tsx` (the homepage). That's T016.
- Do not import `@react-three/drei` in this task — it's only needed in T011 (`<Text />`) and T014. T009 uses plain three + R3F.

## Whitelist
- `src/lib/three/geo.ts`
- `src/components/cursor/earth.tsx`
- `src/components/cursor/earth-scene.tsx`
- `src/components/cursor/earth-scene-dynamic.tsx`
- `src/app/[locale]/earth-preview/page.tsx`
- `tests/unit/lat-lng-to-xyz.test.ts`
- `specs/001-the-cursor/tasks.md` (T009 checkboxes only)
- `.opus/inbox/030-*.md`, `.opus/outbox/030-reply.md`, `.logs/030-T009.log`, `.opus/archive/030/**`

## Done when
- `latLngToXYZ` unit test green (north pole, equator, Casablanca cases)
- `npm run dev` → visit `http://localhost:3000/en/earth-preview` → see a slowly rotating wireframe blue globe with a glowing orange dot at Casablanca (North Africa, just below Gibraltar)
- 9 scripts green, log at `.logs/030-T009.log`
- Commits pushed to `feat/001-the-cursor`, PR #15 CI green
- `030-reply.md` includes: PR #15 CI run URL, the Vercel preview URL for `/en/earth-preview` (Opus will visually verify this one), the expected Casablanca xyz triple from the unit test as a sanity line, confirmation the canvas has `aria-hidden="true"`
- Bookkeeping committed per Rule 1

## Note to Opus scheduler
Task 030 is the T009 visual gate. After 030 lands and the scheduler sees the reply, verify the CI + whitelist as usual, then STOP and write `_opus-alert.md` so Chainbeard can look at the Vercel preview for `/en/earth-preview` before T010 dispatches. Do NOT auto-dispatch T010.
