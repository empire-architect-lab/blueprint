# Task 027 — Spec 001 / T004 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft for spec 001)
**Product commit:** `2fc49ed` — `feat(i18n): t004 cursor and hero strings in en/fr/ar/nl`

## What shipped

- `messages/en.json` — canonical `cursor.*` + `hero.*` namespaces, 6 keys.
- `messages/fr.json`, `messages/ar.json`, `messages/nl.json` — same 6 keys with
  verbatim English stub copy.
- `messages/_review.md` — index of every stubbed key per non-English locale
  (index only, no translations live in this file).
- `specs/001-the-cursor/tasks.md` — T004 boxes ticked in the same commit.
- **No component file touched.** **No `src/i18n/*` change** (middleware already
  covered all four locales from foundation T007). **No `[locale]/layout.tsx`
  change** — `dir={locale === "ar" ? "rtl" : "ltr"}` was already wired.

## English copy pulled verbatim from spec.md

| Key                             | Value                                                             | Source in spec.md |
|---------------------------------|-------------------------------------------------------------------|-------------------|
| `cursor.typedCommand`           | `$ git log --oneline \| head -1`                                  | Scenario A line 148 |
| `cursor.skipLabel`              | `Skip cinematic intro`                                            | US-3 line 67 |
| `cursor.replayLabel`            | `Replay cinematic intro`                                          | US-4 line 75 |
| `cursor.reducedMotionSubtitle`  | `Cinematic intro disabled per your motion preferences.`           | US-2 line 61 |
| `hero.headline`                 | `Built by the process it teaches.`                                | Beat 12 line 43 / Overview line 14 |
| `hero.metadata`                 | `commit {sha} · {specs} specs · {tasks} tasks · {lies} lies`      | Beat 12 line 43 (ICU placeholders for the 4 build-time numbers) |

## `dir="rtl"` DOM proof (dev, `/ar`)

```
$ curl -s http://localhost:3000/ar | grep -o '<html[^>]*>' | head -1
<html lang="ar" dir="rtl" class="… h-full antialiased">
```

All four locales resolve with 200:

```
/en → 200
/fr → 200
/ar → 200   (dir="rtl")
/nl → 200
```

## `check-i18n.sh` exit 0

```
$ bash scripts/check-i18n.sh
check-i18n: OK
$ echo $?
0
```

## 9 scripts

All green. Full log at [.logs/027-T004.log](.logs/027-T004.log).

- typecheck: OK
- lint (eslint + prettier): OK
- vitest: 4 files / 12 tests passed
- playwright: `home.spec.ts` passed
- gitleaks: no leaks (39 commits scanned)
- npm audit: 0 vulnerabilities
- check-rls: OK
- check-tenant-id: OK
- check-forbidden-terms + check-i18n: OK

## PR #15 CI run URL

Will be attached once GitHub Actions finishes on this push.

## Files committed on `feat/001-the-cursor` in this task

- `2fc49ed` — product (6 files)
- bookkeeping commit to follow:
  - `.opus/inbox/027-spec001-T004-i18n-strings.md` → `.opus/archive/027/inbox/`
  - `.opus/outbox/027-reply.md` (this file)
  - `.logs/027-T004.log`
