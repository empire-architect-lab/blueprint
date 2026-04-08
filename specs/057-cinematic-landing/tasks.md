# Tasks 057 — Cinematic Landing

- [ ] **T001** Fetch hero video (Pexels/Coverr CC0, <10MB) → `public/video/hero.mp4`
- [ ] **T002** Fetch editorial images (2 Unsplash CC0) → `public/images/editorial/`
- [ ] **T003** Fetch avatars (4 Unsplash CC0) → `public/images/avatars/`
- [ ] **T004** Fetch stack logo SVGs (10 from simpleicons) → `public/logos/`
- [x] **T005** Ensure Fraunces via `next/font/google` (reuse or add) — reused existing `font-display` var (CabinetGrotesk wired to `--font-display`)
- [x] **T006** Build `components/cinematic/SplitHeading.tsx` (server, a11y-safe)
- [x] **T007** Build `components/cinematic/ScrollReveal.tsx` (client, IO)
- [x] **T008** Build `components/cinematic/EditorialCard.tsx` (server)
- [x] **T009** Build `components/cinematic/ManifestoBlock.tsx` (server)
- [x] **T010** Build `components/cinematic/TestimonialGrid.tsx` (server)
- [x] **T011** Build `components/cinematic/StatCounter.tsx` (client, IO+rAF)
- [x] **T012** Build `components/cinematic/LogoMarquee.tsx` (server, CSS marquee)
- [x] **T013** Build `components/cinematic/ClosingCTA.tsx` (server)
- [x] **T014** Build `components/cinematic/WordmarkFooter.tsx` (server)
- [x] **T015** Extend `CinematicHero` with optional `backgroundVideoSrc` + split headline overlay (no regression)
- [x] **T016** Add `landing.*` i18n keys to `messages/en.json`
- [x] **T017** Mirror keys to `messages/{fr,ar,nl}.json`
- [x] **T018** Rewrite `app/[locale]/page.tsx` composing the 8 sections in sequel.co order
- [ ] **T019** Run `tsc --noEmit` → log
- [ ] **T020** Run `eslint` + `prettier` → log
- [ ] **T021** Run `vitest` unit → log
- [ ] **T022** Run `playwright` e2e (landing smoke) → log
- [ ] **T023** Run `gitleaks` → log
- [ ] **T024** Run `npm audit` → log
- [ ] **T025** Run `check-rls.sh` + `check-tenant-id.sh` + `check-forbidden-terms.sh` + `check-i18n.sh` → log
- [ ] **T026** Commit product changes in logical groups on `feat/057-cinematic-landing`
- [ ] **T027** Open PR against `main` (or `fix/056-...` if not merged)
- [ ] **T028** Capture Vercel preview URL + green CI → `.opus/outbox/057-reply.md`
- [ ] **T029** Bookkeeping commit: `.logs/057.log` + outbox reply + consumed inbox file

## Definition of done

All boxes checked, PR green, preview URL captured in outbox. Opus
verifies and marks done. This task file is NOT marked done by Code Agent.
