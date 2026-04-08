# Task 030 — Spec 001 / T009 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15
**Product commit:** `5e0e22f` — `feat(cursor): t009 wireframe earth scene with casablanca dot`

## What shipped

- `src/lib/three/geo.ts` — `latLngToXYZ(lat, lng, radius)` per the inbox formula
  (`phi = (90-lat)·π/180`, `theta = (lng+180)·π/180`).
- `src/components/cursor/earth.tsx` — R3F group with the wireframe icosahedron
  (`args=[2, 32]`, `meshBasicMaterial wireframe color="#4a9eff"`) and the
  emissive Casablanca dot at `latLngToXYZ(33.5731, -7.5898, 2.02)`. Slow
  rotation via `useFrame` on the group ref.
- `src/components/cursor/earth-scene.tsx` — `<Canvas camera={{ position: [0,0,6], fov: 50 }} aria-hidden="true">`
  with `ambientLight`, `directionalLight`, `<Earth />`, wrapped in
  `<div data-role="earth" className="w-full h-full">`.
- `src/components/cursor/earth-scene-dynamic.tsx` — `next/dynamic` wrapper,
  `ssr: false`, `loading: () => null`. **This is the entry point** other
  tasks should import.
- `src/app/[locale]/earth-preview/page.tsx` — temporary client page,
  marked `// TEMP: removed in T016` at the top, mounts the dynamic
  `EarthScene` full-viewport on a black background.
- T009 boxes ticked in `specs/001-the-cursor/tasks.md` in the same commit.

## Casablanca xyz triple (sanity line per inbox)

`latLngToXYZ(33.5731, -7.5898, 2.02)` →

```
x ≈ 1.66828
y ≈ 1.11706
z ≈ 0.22229
```

Locked into `tests/unit/lat-lng-to-xyz.test.ts` with `toBeCloseTo(_, 4)`.

## Canvas a11y confirmation

```tsx
<Canvas camera={{ position: [0, 0, 6], fov: 50 }} aria-hidden="true">
```

`aria-hidden="true"` is set as required — the 3D scene is decorative.

## ⚠ Discrepancy in the inbox spec (resolved by following the formula)

The inbox bullet for T009.1 says:

> equator/prime meridian (0, 0, r) → (-r, 0, 0) per the formula above

But the formula it cites gives `(+r, 0, 0)`, not `(-r, 0, 0)`:

```
lat = 0, lng = 0, r = 2
phi   = (90 - 0)·π/180 = π/2     → sin(phi) = 1,  cos(phi) = 0
theta = (0 + 180)·π/180 = π      → cos(theta) = -1
x = -r · sin(phi) · cos(theta) = -2 · 1 · -1 = +2
y = r · cos(phi) = 0
z = r · sin(phi) · sin(theta) = 0
```

I followed the formula since the inbox explicitly said "per the formula
above" and the test now asserts `(2, 0, 0)` for that case (with a
comment in the test explaining the discrepancy). If you'd rather the
formula get a unary `-1` flip on `x` so the prose is the canonical truth,
I can ship a follow-up — but the visual on the preview is correct as-is
(Casablanca lands on the right side of the globe, where North Africa
should be), so I think the formula is right and the prose was the typo.

## Vitest (new file)

```
 ✓ tests/unit/lat-lng-to-xyz.test.ts (3 tests)
   ✓ north pole maps to (0, r, 0)
   ✓ equator + prime meridian maps to (r, 0, 0) per the inbox formula
   ✓ Casablanca (33.5731, -7.5898, 2.02) regression triple
```

Full vitest still 11 files / 251 tests passed.

## 9 scripts

All green. Log at [.logs/030-T009.log](.logs/030-T009.log).

- typecheck / lint / vitest (251) / playwright / gitleaks / npm audit /
  rls / tenant / forbidden / i18n: all OK.

## Local smoke

```
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/earth-preview
200
```

Page renders the dynamic-imported scene; the canvas mount and SSR-skip
happen client-side per the `ssr: false` wrapper.

## PR #15 / preview URL

The four pushed commits land in PR #15 (rolling draft). CI URL and the
Vercel preview URL for `/en/earth-preview` will be visible there once the
GitHub Actions run completes. **Per the inbox note: STOP after this and
let Chainbeard look at the preview before T010 dispatches.**

## Files committed on `feat/001-the-cursor` in this task

- `5e0e22f` — product (7 files incl. tasks.md tick)
- bookkeeping commit to follow:
  - `.opus/inbox/030-spec001-T009-earth-scene.md` → `.opus/archive/030/inbox/`
  - `.opus/outbox/030-reply.md` (this file)
  - `.logs/030-T009.log`
