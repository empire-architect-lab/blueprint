"use client";

import { useTranslations } from "next-intl";

export const CINEMATIC_REPLAY_EVENT = "blueprint:cinematic-replay";

export function ReplayButton() {
  const t = useTranslations("cursor");
  return (
    <button
      type="button"
      aria-label={t("replayLabel")}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(CINEMATIC_REPLAY_EVENT));
      }}
      className="absolute bottom-6 right-6 z-50 rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white/60 backdrop-blur transition hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {t("replayLabel")}
    </button>
  );
}
