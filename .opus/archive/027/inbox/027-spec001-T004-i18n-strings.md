# Task 027 — Spec 001 / T004 — i18n strings (en/fr/ar/nl)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue — commits feed rolling draft PR #15)
**Depends on:** T003 (task 026) — DONE, live path verified `source:"github"` on preview.

## Context
Spec 001 / T004 from `specs/001-the-cursor/tasks.md`. Add all visitor-facing strings for the cinematic intro + hero in four locales (en/fr/ar/nl). English is canonical and human-written. The other three are stub translations (literal English copy is an acceptable stub) so the `check-i18n.sh` script passes and the RTL rendering can be spot-checked for Arabic.

## Scope (T004 checkbox list, verbatim)
1. Verify `next-intl` middleware is wired for all four locales from foundation T007. Wire any missing locale minimally — do not rip out or restructure existing config.
2. Add `cursor.*` and `hero.*` namespaces to `messages/en.json` covering:
   - `cursor.typedCommand` — the command typed in the terminal beat (pull exact text from `spec.md`)
   - `cursor.skipLabel` — aria-label for the skip link
   - `cursor.replayLabel` — aria-label for the replay button
   - `cursor.reducedMotionSubtitle` — "Cinematic intro disabled per your motion preferences."
   - `hero.headline` — the huge h1 text (from `spec.md`)
   - `hero.metadata` — format string with interpolation placeholders for `{sha}`, `{specs}`, `{tasks}`, `{lies}` (ICU syntax that next-intl supports)
3. Add the identical key set to `messages/fr.json`, `messages/ar.json`, `messages/nl.json`. Stub value = verbatim English copy. Every key must exist in all four files.
4. Create or append to `messages/_review.md` with a section per non-English locale listing every stubbed key, format: `## fr\n- cursor.skipLabel\n- cursor.replayLabel\n...`, so a human translator can find them later.
5. RTL spot check: `npm run dev`, visit `/ar`, confirm `<html dir="rtl">` is set when locale is `ar`. If middleware doesn't set `dir` automatically, wire it in `src/app/[locale]/layout.tsx` (this is a one-liner: `<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>`). Screenshot or dom dump in the reply as evidence.
6. Run `bash scripts/check-i18n.sh` — must exit 0. No hardcoded English in any new or touched file; all six keys present in all four locale files.
7. Tick T004 boxes in `specs/001-the-cursor/tasks.md` in the same commit (Principle 10).

## Constraints
- Do NOT add `messages/_review.md` content that contains any actual translations — it's an index of stubbed keys only, so it can't accidentally ship as "real" localized copy.
- Do NOT touch any component file. T004 is pure strings + config + `_review.md` + the RTL dir one-liner in the layout if needed.
- Exact English copy for `cursor.typedCommand` and `hero.headline` must come from `specs/001-the-cursor/spec.md` verbatim — no paraphrasing, no improvements, no "cleaner" versions.

## Whitelist
- `messages/en.json`
- `messages/fr.json`
- `messages/ar.json`
- `messages/nl.json`
- `messages/_review.md` (new or appended)
- `src/app/[locale]/layout.tsx` — ONLY if the `dir` attribute needs wiring (one line change)
- `src/i18n/*` — ONLY if a locale is missing from the middleware routing config
- `specs/001-the-cursor/tasks.md` (T004 checkboxes only)
- `.opus/inbox/027-*.md`, `.opus/outbox/027-reply.md`, `.logs/027-T004.log`, `.opus/archive/027/**`

## Done when
- 6 keys × 4 locales = 24 entries present, `check-i18n.sh` green
- `/en`, `/fr`, `/ar`, `/nl` all resolve on `npm run dev` without 404
- `/ar` renders with `dir="rtl"` on the `<html>` element (paste the relevant DOM snippet in the reply)
- `messages/_review.md` lists every stubbed key per non-English locale
- 9 scripts green, log at `.logs/027-T004.log`
- Commits pushed to `feat/001-the-cursor`, CI green on PR #15
- `027-reply.md` includes: the English copy that was pulled from `spec.md` for each key, the `dir="rtl"` DOM proof, `check-i18n.sh` exit-0 output, PR #15 CI run URL
- Bookkeeping committed on the same branch per Rule 1
