"use client";

import { useTranslations } from "next-intl";

export function ReplayButton() {
  const t = useTranslations("cursor");
  return (
    <button
      type="button"
      aria-label={t("replayLabel")}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("blueprint:cinematic-replay"));
      }}
      className="fixed bottom-6 right-6 z-50 rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white/60 opacity-60 backdrop-blur transition hover:opacity-100 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:opacity-100"
    >
      {t("replayLabel")}
    </button>
  );
}
