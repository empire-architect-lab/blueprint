"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as Sentry from "@sentry/nextjs";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { Hero } from "@/components/hero/hero";
import { SkipLink } from "@/components/cursor/skip-link";
import { CinematicErrorBoundary } from "@/components/cursor/cinematic-error-boundary";
import { CINEMATIC_COMPLETE_EVENT } from "@/components/cursor/white-flash";
import { CINEMATIC_REPLAY_EVENT } from "@/components/hero/replay-button";
import { track } from "@/lib/analytics/plausible";

export const CINEMATIC_SKIP_EVENT = "blueprint:cinematic-skip";

// Desktop cinematic-intro.tsx is added in a follow-up task; until then, the
// router dynamic-imports the existing earth-scene preview wrapper as a
// placeholder. Both code paths are bundle-split so the unused one is not
// shipped.
const CinematicIntro = dynamic(
  async () => {
    try {
      const m = await import("./earth-scene-dynamic");
      return { default: m.default };
    } catch (err) {
      console.error("[cinematic] earth-scene-dynamic import failed", err);
      Sentry.captureException(err, {
        tags: { component: "cinematic-intro", phase: "import" },
      });
      throw err;
    }
  },
  { ssr: false, loading: () => <Hero /> },
);

const CinematicIntroMobile = dynamic(
  async () => {
    try {
      const m = await import("./cinematic-intro-mobile");
      return { default: m.CinematicIntroMobile };
    } catch (err) {
      console.error("[cinematic] cinematic-intro-mobile import failed", err);
      Sentry.captureException(err, {
        tags: { component: "cinematic-intro-mobile", phase: "import" },
      });
      throw err;
    }
  },
  { ssr: false, loading: () => <Hero /> },
);

type Mode = "cinematic" | "hero";

export function CinematicRouter() {
  const t = useTranslations("cursor");
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<Mode>("cinematic");

  useEffect(() => {
    const onSkip = () => {
      track("cinematic_skipped");
      setMode("hero");
    };
    const onComplete = () => {
      track("cinematic_completed");
      setMode("hero");
    };
    const onReplay = () => setMode("cinematic");
    window.addEventListener(CINEMATIC_SKIP_EVENT, onSkip);
    window.addEventListener(CINEMATIC_COMPLETE_EVENT, onComplete);
    window.addEventListener(CINEMATIC_REPLAY_EVENT, onReplay);
    return () => {
      window.removeEventListener(CINEMATIC_SKIP_EVENT, onSkip);
      window.removeEventListener(CINEMATIC_COMPLETE_EVENT, onComplete);
      window.removeEventListener(CINEMATIC_REPLAY_EVENT, onReplay);
    };
  }, []);

  if (reduced) {
    return (
      <>
        <Hero />
        <p
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60"
        >
          {t("reducedMotionNotice")}
        </p>
      </>
    );
  }

  if (mode === "hero") {
    return <Hero />;
  }

  return (
    <>
      <CinematicErrorBoundary>
        {isMobile ? <CinematicIntroMobile /> : <CinematicIntro />}
      </CinematicErrorBoundary>
      <SkipLink />
    </>
  );
}
