"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export const CINEMATIC_COMPLETE_EVENT = "blueprint:cinematic-complete";

export type WhiteFlashHandle = {
  trigger: () => void;
};

export const WhiteFlash = forwardRef<WhiteFlashHandle>(
  function WhiteFlash(_props, ref) {
    const divRef = useRef<HTMLDivElement>(null);
    const firedRef = useRef(false);
    const reducedMotion = useReducedMotion();

    const dispatchOnce = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      window.dispatchEvent(new CustomEvent(CINEMATIC_COMPLETE_EVENT));
    };

    useImperativeHandle(
      ref,
      () => ({
        trigger: () => {
          if (firedRef.current) return;
          if (reducedMotion) {
            dispatchOnce();
            return;
          }
          const el = divRef.current;
          if (!el) {
            dispatchOnce();
            return;
          }
          gsap
            .timeline()
            .to(el, { opacity: 1, duration: 0.06, ease: "none" })
            .to(el, {
              opacity: 0,
              duration: 0.06,
              ease: "none",
              onComplete: dispatchOnce,
            });
        },
      }),
      [reducedMotion],
    );

    useEffect(() => {
      const el = divRef.current;
      return () => {
        gsap.killTweensOf(el);
      };
    }, []);

    return (
      <div
        ref={divRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-white"
        style={{ opacity: 0, zIndex: 9999 }}
      />
    );
  },
);
