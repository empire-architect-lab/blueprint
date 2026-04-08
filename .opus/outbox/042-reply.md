## Task 042 — Spec 001 / T018 Scenario C reply — **BLOCKED, no product commit**

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft, no new product commit on this task)
**Status:** STOPPED — gap in product wiring, see below.

## The gap

The inbox says *"Skip link + hero exist already (T013/T015)"* and forbids source changes. The skip-link **component** does exist:

- `src/components/cursor/skip-link.tsx` — exports `<SkipLink />`, dispatches `blueprint:cinematic-skip` on click, has `aria-label={t("cursor.skipLabel")}`, has `focus-visible:ring-2`. T008 shipped it.

But the skip-link **mount** does not. I grepped the entire `src/` tree for `SkipLink` / `skip-link` references and the only hit is the file itself:

```
$ grep -r "SkipLink\|skip-link" src/
src/components/cursor/skip-link.tsx:5:export function SkipLink() {
```

`<CinematicRouter />` does not import or render `<SkipLink />`. `src/app/[locale]/page.tsx` does not render it. `src/app/[locale]/earth-preview/page.tsx` does not render it. The reduced-motion notice path renders a `<p role="status">` but no skip control. **There is no DOM node that the Scenario C "Tab to the skip-intro link, press Enter" instructions can land on**, so the acceptance criteria are physically impossible to satisfy without editing product code — which the whitelist explicitly forbids.

This is the same shape as the T040 / T041 stop condition: a missing DOM affordance, not a missing test selector. Per the established pattern (and the standing "STOP and reply with the gap" rule from prior T018 dispatches), I have **not committed the test, not ticked the T018 third checkbox, and not modified any source file**.

## What I need from you

One of the following follow-up dispatches will unblock T018c:

1. **A tiny side task whose whitelist is `src/components/cursor/cinematic-router.tsx`** that mounts `<SkipLink />` at the cinematic level (alongside or above the dynamic-imported intro). The router already owns event listening for `CINEMATIC_SKIP_EVENT`; this is a one-line `<SkipLink />` JSX add inside the early `if (!reduced && mode === "cinematic")` branch, and a one-line import. Once the skip link is in the DOM on `/en`, the Scenario C spec will be a 5-line Playwright test I can ship in the next dispatch.
2. **A redo of T042 that explicitly authorises editing `cinematic-router.tsx`** to mount the skip link in this same task. Same code change, just folded in.
3. **A redo of T042 that drops the Tab+Enter requirement** and replaces it with `page.evaluate(() => window.dispatchEvent(new CustomEvent("blueprint:cinematic-skip")))` — i.e. test the router's skip-handler-→-hero handoff at the event layer instead of the DOM layer. Same shape as the T040 happy-path workaround. Less faithful to "real keyboard user", but verifies the production code path that *does* exist.

I would lean toward option 1, then re-dispatch T042. The skip link is a primary accessibility surface and shipping it un-mounted is itself a bug — Scenario C catching it is exactly the kind of cinematic-vs-skeleton drift this PR is supposed to surface.

## Required scripts — not run

I did not run the required scripts because there is nothing new to test. The repo is unchanged from `f735e0a` (last green commit on this branch) except for `.opus/inbox/042-spec001-T018c-skip.md` and the bookkeeping artifacts below. Last green readout:

- typecheck OK
- lint OK
- playwright 3 passed (`home`, `cursor-happy-path`, `cursor-reduced-motion`)
- gitleaks OK, 69 commits scanned
- check-forbidden + check-i18n OK

[.logs/042-T018c.log](.logs/042-T018c.log) is a one-liner explaining the stop.

## Bookkeeping commit to follow

Even though there is no product commit, the same task-018 rule applies: this inbox file, this reply, and the (one-line) log get committed on the task branch so the dispatch is auditable.

- `.logs/042-T018c.log`
- `.opus/outbox/042-reply.md` (this file)
- `.opus/inbox/042-spec001-T018c-skip.md`

## Standby

Awaiting your call on options 1 / 2 / 3 above. Standing by.
