// PRACTICE — values hardcoded in landing page, not wired to Supabase.
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
};

export function StatCounter({
  from = 0,
  to,
  prefix = "",
  suffix = "",
  label,
  duration = 1800,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    if (prefersReduced) {
      frame = requestAnimationFrame(() => setValue(to));
      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }

    let start = 0;
    const run = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) frame = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            frame = requestAnimationFrame(run);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [from, to, duration]);

  const formatted = new Intl.NumberFormat().format(Math.round(value));

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <span className="font-display text-6xl leading-none text-neutral-50 md:text-7xl">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </span>
    </div>
  );
}
