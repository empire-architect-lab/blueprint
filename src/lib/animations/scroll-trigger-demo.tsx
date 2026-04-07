"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollTriggerDemo() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="py-12">
      <p className="text-sm text-muted-foreground">
        ScrollTrigger demo — fades in on scroll.
      </p>
    </div>
  );
}
