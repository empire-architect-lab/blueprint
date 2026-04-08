"use client";

// IMPORTANT: this module must NOT import three / @react-three/* (transitively
// either). The mobile chunk is bundled separately and must stay GPU-free.

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TerminalTyper } from "./terminal-typer";
import { Hero } from "@/components/hero/hero";
import { PIPELINE_NODES } from "@/lib/constants/pipeline-nodes";

type Beat = "typer" | "map" | "pipeline" | "hero";

// Simplified Mercator silhouette path (inline, ~1KB) — purely decorative.
const WORLD_PATH =
  "M10,80 L40,60 L80,55 L120,70 L160,60 L200,75 L240,65 L280,80 L320,70 L360,85 L400,75 L430,90 L450,100 L430,120 L400,130 L360,125 L320,135 L280,130 L240,140 L200,135 L160,145 L120,140 L80,150 L40,145 L10,135 Z";

// Casablanca approx pixel position on the 460x200 viewBox.
const CASABLANCA_PX = { cx: 200, cy: 110 };

export function CinematicIntroMobile() {
  const t = useTranslations("cursor");
  const [beat, setBeat] = useState<Beat>("typer");
  const [litIndex, setLitIndex] = useState(-1);

  useEffect(() => {
    if (beat !== "pipeline") return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLitIndex(i - 1);
      if (i >= PIPELINE_NODES.length) {
        clearInterval(id);
        setTimeout(() => setBeat("hero"), 400);
      }
    }, 350);
    return () => clearInterval(id);
  }, [beat]);

  if (beat === "hero") {
    return <Hero />;
  }

  return (
    <main className="min-h-screen w-full bg-black text-white">
      {beat === "typer" && (
        <div className="flex min-h-screen flex-col items-start justify-center px-6">
          <TerminalTyper
            command={t("typedCommand")}
            charDelayMs={50}
            onComplete={() => setBeat("map")}
          />
          <button
            type="button"
            className="mt-6 rounded border border-white/30 px-3 py-1 text-xs"
            onClick={() => setBeat("map")}
          >
            {t("skipLabel")}
          </button>
        </div>
      )}

      {beat === "map" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <svg
            viewBox="0 0 460 200"
            className="w-full max-w-md"
            aria-hidden="true"
          >
            <path
              d={WORLD_PATH}
              fill="none"
              stroke="#4a9eff"
              strokeWidth="1.5"
            />
            <circle
              cx={CASABLANCA_PX.cx}
              cy={CASABLANCA_PX.cy}
              r="4"
              fill="#ffaa00"
            >
              <animate
                attributeName="r"
                values="4;7;4"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <button
            type="button"
            className="mt-6 rounded border border-white/30 px-3 py-1 text-xs"
            onClick={() => setBeat("pipeline")}
          >
            {t("skipLabel")}
          </button>
        </div>
      )}

      {beat === "pipeline" && (
        <ul className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          {PIPELINE_NODES.map((label, i) => (
            <li
              key={label}
              data-lit={i <= litIndex ? "true" : "false"}
              className="font-mono text-lg"
              style={{
                opacity: i <= litIndex ? 1 : 0.25,
                color: i <= litIndex ? "#ffaa00" : "#4a9eff",
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
