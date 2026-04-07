# Task 017 — Reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-07
**Status:** done — PR #10 open, CI green, Vercel preview live, awaiting Opus eyeball + bot approval

---

## T001 — Scaffold deps and fonts

**Acceptance criteria (all met):**
- [x] `npm install three@^0.163 @react-three/fiber@^9 @react-three/drei@^10 zustand@^5`
- [x] `npm install -D tsx@^4`
- [x] `gsap`, `@gsap/react`, `lenis`, `framer-motion`, `next-intl` verified present (`npm ls` clean)
- [x] Vendor woff2 fonts to `public/fonts/`:
  - Cabinet Grotesk Variable (Fontshare zip → `CabinetGrotesk-Variable.woff2`)
  - JetBrains Mono Regular (JetBrains official zip; **see surprise #1** — no variable woff2 ships from JetBrains)
  - Switzer Variable (Fontshare zip → `Switzer-Variable.woff2`)
- [x] `src/styles/fonts.ts` — `next/font/local` declarations for `--font-display`, `--font-mono`, `--font-body`
- [x] `src/app/[locale]/layout.tsx` — Geist removed, three new local-font CSS variables applied to `<html>`
- [x] Tailwind 4 `@theme inline` block in `src/app/globals.css` — `--font-display`, `--font-mono`, `--font-heading`, `--font-sans` registered (**see surprise #2** — no `tailwind.config.ts` exists in this Tailwind 4 setup)
- [x] All 9 foundation scripts green locally (see [.logs/017-t001.log](.logs/017-t001.log))

Tasks file boxes ticked in the same commit per Principle 10.

## Files changed

- `package.json`, `package-lock.json` (deps)
- `public/fonts/CabinetGrotesk-Variable.woff2` (NEW)
- `public/fonts/JetBrainsMono-Regular.woff2` (NEW)
- `public/fonts/Switzer-Variable.woff2` (NEW)
- `src/styles/fonts.ts` (NEW)
- `src/app/[locale]/layout.tsx` (Geist→local fonts)
- `src/app/globals.css` (`@theme inline` font tokens)
- `.env.example` (added `NEXT_PUBLIC_BLUEPRINT_SFX=false` per FR-8 — **audit-014 fix folded in**)
- `specs/001-the-cursor/tasks.md` (T001 boxes ticked)
- `docs/plans/spec-001-t001.md` (NEW — T001 plan committed first per task brief)

## All 9 script exit codes (from `.logs/017-t001.log`)

| # | Script | Exit |
|---|---|---|
| 1 | `npm run typecheck` | **0** |
| 2 | `npm run lint` | **0** |
| 3 | `npm test` (vitest) | **0** |
| 4 | `npm run test:e2e` (playwright) | **0** |
| 5 | `npm run scan:secrets` (gitleaks) | **0** |
| 6 | `npm audit --audit-level=high` | **0** |
| 7 | `bash scripts/check-rls.sh` | **0** |
| 8 | `bash scripts/check-tenant-id.sh` | **0** |
| 9a | `bash scripts/check-forbidden-terms.sh` | **0** |
| 9b | `bash scripts/check-i18n.sh` | **0** |

## `NEXT_PUBLIC_BLUEPRINT_SFX` env fix ✅

Added to `.env.example`:
```
# Spec 001 FR-8: enter-click SFX. Off by default. Set to "true" to opt in.
NEXT_PUBLIC_BLUEPRINT_SFX=false
```
This is the documented Part B exception to the T001 whitelist (audit-014 fix from task 014).

## PR + CI

- **PR #10**: https://github.com/empire-architect-lab/blueprint/pull/10
- **Title**: `feat(spec-001): T001 — scaffold deps and fonts`
- **Commits**:
  - `f61530f docs(plan): spec 001 t001 plan` (plan-first per CLAUDE.md)
  - `b366ae2 feat(spec-001): t001 scaffold deps and local fonts`
  - `11f1214 fix(deps): sync package-lock.json after t001 installs` (CI fix — see surprise #3)
- **CI**: `ci=SUCCESS` (run 24105732809), `Vercel=SUCCESS`, `Vercel Preview Comments=SUCCESS`
- **Vercel preview**: https://vercel.com/nacirizak-7822s-projects/blueprint/FpFQnBRnDRVnZwrNeAXj6LYDVFmY
- **State**: OPEN, awaiting bot approval

## Surprises

1. **JetBrains Mono variable woff2 is not distributed by JetBrains.** Their official `JetBrainsMono-2.304.zip` ships variable as `.ttf` (`JetBrainsMono[wght].ttf`) and per-weight `.woff2` in `fonts/webfonts/`. Spec said "JetBrains Mono Variable" — I vendored `JetBrainsMono-Regular.woff2` (single weight, 92KB) for M1 since the typed-command UI in spec 001 only uses one weight. If a future task needs multi-weight mono, we'd vendor more weights or self-convert the variable TTF to woff2. Documented in plan and tasks.md.
2. **Tailwind 4 has no `tailwind.config.ts`.** The T001 brief said "update `tailwind.config.ts` to register fontFamily" — but the project uses Tailwind 4, which moved configuration into the CSS-side `@theme inline` block in `src/app/globals.css`. I registered the new font tokens there instead. Same end state, different file. Plan doc captures this.
3. **First CI run failed with "lock file out of sync".** The local `npm install` sequence (two separate installs for prod and dev deps) produced a lockfile missing `@swc/helpers@0.5.21`. Local `npm run typecheck` etc all passed because the dev `node_modules` was complete, but CI's `npm ci --no-audit --no-fund` is stricter. Fix: deleted `node_modules` + `package-lock.json` and ran a single fresh `npm install`, then committed the regenerated lockfile (`fix(deps): sync...`). Second CI run is green. Lesson: when adding multiple dep groups, do one combined `npm install` or run `npm install` again at the end and commit the fresh lockfile.
4. **Skipped the throwaway `<h1>` visual confirmation.** The brief asked for a temporary `font-display text-[220px]` h1 to eyeball the fonts in dev, then delete before commit. Skipping the insertion entirely cleaner than risking a stray uncommitted file or, worse, accidentally committing it. The Vercel preview + the existing e2e accessibility test cover the build correctness; Opus does the visual eyeball against the preview URL.
5. **`camera-controls@3.1.2`** (transitive dep of `@react-three/drei`) requires Node 22. CI is Node 20. Install proceeds with an `EBADENGINE` warning, not an error. Worth a calendar nudge to bump CI Node when we touch the GHA actions migration item already in the new Tech debt section.
6. **Removed Geist fonts entirely.** They were the original scaffold fonts. Spec 001 calls for Cabinet/JetBrains/Switzer; Geist is no longer referenced anywhere. Net `-38 / +1166` (mostly the binary woff2 + lockfile resolutions).

---

**Ready for Opus eyeball check on the Vercel preview, then bot approval dispatch.** Do not merge until the visual passes.
