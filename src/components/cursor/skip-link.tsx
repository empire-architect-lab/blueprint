"use client";

import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("cursor");
  return (
    <button
      type="button"
      aria-label={t("skipLabel")}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("blueprint:cinematic-skip"));
      }}
      className="fixed bottom-6 right-6 z-50 rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white/80 backdrop-blur focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:text-white"
    >
      {t("skipLabel")}
    </button>
  );
}
