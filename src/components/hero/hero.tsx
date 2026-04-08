"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BUILD_METADATA } from "@/content/build-metadata";
import { FALLBACK_COMMIT } from "@/content/fallback-commit";
import { ReplayButton } from "./replay-button";

type HeadCommit = {
  sha: string;
  shortSha: string;
  message: string;
  source: "github" | "fallback";
};

const FALLBACK_HEAD: HeadCommit = { ...FALLBACK_COMMIT, source: "fallback" };

export function Hero() {
  const t = useTranslations("hero");
  const [head, setHead] = useState<HeadCommit>(FALLBACK_HEAD);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/head-commit")
      .then((r) => (r.ok ? r.json() : FALLBACK_HEAD))
      .then((data: HeadCommit) => {
        if (!cancelled) setHead(data);
      })
      .catch(() => {
        if (!cancelled) setHead(FALLBACK_HEAD);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      data-spec-id="001-the-cursor"
      className="relative min-h-screen w-full bg-black text-white"
    >
      <div className="flex min-h-screen flex-col justify-center px-8">
        <h1 className="font-display text-[220px] leading-none">
          {t("headline")}
        </h1>
        <p className="font-mono text-[18px]">
          {t("metadata", {
            sha: head.shortSha,
            specs: BUILD_METADATA.specCount,
            tasks: BUILD_METADATA.taskCount,
            lies: BUILD_METADATA.lieCount,
          })}
        </p>
      </div>
      <ReplayButton />
    </section>
  );
}
