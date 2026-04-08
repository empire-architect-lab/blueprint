"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { Hero } from "@/components/hero/hero";
import { CINEMATIC_COMPLETE_EVENT } from "@/components/cursor/white-flash";
import { CINEMATIC_REPLAY_EVENT } from "@/components/hero/replay-button";

export const CINEMATIC_SKIP_EVENT = "blueprint:cinematic-skip";

// Desktop cinematic-intro.tsx is added in a follow-up task; until then, the
// router dynamic-imports the existing earth-scene preview wrapper as a
// placeholder. Both code paths are bundle-split so the unused one is not
// shipped.
const CinematicIntro = dynamic(
  async () => {
    const m = await import("./earth-scene-dynamic");
    return { default: m.default };
  },
  { ssr: false, loading: () => null },
);

const CinematicIntroMobile = dynamic(
  async () => {
    const m = await import("./cinematic-intro-mobile");
    return { default: m.CinematicIntroMobile };
  },
  { ssr: false, loading: () => null },
);

type Mode = "cinematic" | "hero";

export function CinematicRouter() {
  const t = useTranslations("cursor");
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<Mode>("cinematic");

  useEffect(() => {
    const onSkip = () => setMode("hero");
    const onComplete = () => setMode("hero");
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

  return isMobile ? <CinematicIntroMobile /> : <CinematicIntro />;
}
