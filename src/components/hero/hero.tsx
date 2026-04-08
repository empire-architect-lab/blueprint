"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BUILD_METADATA } from "@/content/build-metadata";
import { FALLBACK_COMMIT } from "@/content/fallback-commit";
import { SplitHeading } from "../cinematic/split-heading";
import { ReplayButton } from "./replay-button";

type HeadCommit = {
  sha: string;
  shortSha: string;
  message: string;
  source: "github" | "fallback";
};

const FALLBACK_HEAD: HeadCommit = { ...FALLBACK_COMMIT, source: "fallback" };

export type HeroProps = {
  backgroundVideoSrc?: string;
  splitHeadline?: boolean;
  customControls?: boolean;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

export function Hero(props: HeroProps = {}) {
  const {
    backgroundVideoSrc,
    splitHeadline,
    customControls,
    ctaPrimary,
    ctaSecondary,
  } = props;
  const t = useTranslations("hero");
  const [head, setHead] = useState<HeadCommit>(FALLBACK_HEAD);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  const headline = t("headline");
  const metadata = t("metadata", {
    sha: head.shortSha,
    specs: BUILD_METADATA.specCount,
    tasks: BUILD_METADATA.taskCount,
    lies: BUILD_METADATA.lieCount,
  });

  // DEFAULT PATH — byte-identical to prior implementation when no props passed.
  if (
    !backgroundVideoSrc &&
    !splitHeadline &&
    !customControls &&
    !ctaPrimary &&
    !ctaSecondary
  ) {
    return (
      <section
        data-spec-id="001-the-cursor"
        className="relative min-h-screen w-full bg-black text-white"
      >
        <div className="flex min-h-screen flex-col justify-center px-8">
          <h1 className="font-display text-[220px] leading-none">{headline}</h1>
          <p className="font-mono text-[18px]">{metadata}</p>
        </div>
        <ReplayButton />
      </section>
    );
  }

  return (
    <section
      data-spec-id="001-the-cursor"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {backgroundVideoSrc ? (
        <>
          <video
            ref={videoRef}
            src={backgroundVideoSrc}
            playsInline
            muted
            loop
            autoPlay
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        </>
      ) : null}

      <div className="relative flex min-h-screen flex-col justify-center px-8">
        {splitHeadline ? (
          <SplitHeading
            as="h1"
            text={headline}
            className="font-display text-[clamp(64px,12vw,220px)] leading-[0.9]"
          />
        ) : (
          <h1 className="font-display text-[220px] leading-none">{headline}</h1>
        )}
        <p className="font-mono text-[18px]">{metadata}</p>

        {(ctaPrimary || ctaSecondary) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-50/40 px-6 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-50/10"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {customControls && backgroundVideoSrc ? (
        <div className="absolute bottom-6 right-6 z-10 flex gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full border border-neutral-50/40 px-3 py-1 text-neutral-50 hover:bg-neutral-50/10"
          >
            {playing ? "pause" : "play"}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full border border-neutral-50/40 px-3 py-1 text-neutral-50 hover:bg-neutral-50/10"
          >
            {muted ? "unmute" : "mute"}
          </button>
          <button
            type="button"
            onClick={() => {
              const v = videoRef.current;
              if (v) {
                v.currentTime = 0;
                v.play().catch(() => {});
                setPlaying(true);
              }
            }}
            className="rounded-full border border-neutral-50/40 px-3 py-1 text-neutral-50 hover:bg-neutral-50/10"
          >
            restart
          </button>
        </div>
      ) : null}

      <ReplayButton />
    </section>
  );
}
