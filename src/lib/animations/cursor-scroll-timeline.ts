import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { PIPELINE_NODES } from "@/lib/constants/pipeline-nodes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NODE_SPACING = 4;

export type CursorScrollTimelineOptions = {
  lenis: Lenis;
  scroller: HTMLElement;
  cameraY: { value: number };
  onLitIndexChange: (index: number) => void;
};

export function createCursorScrollTimeline({
  lenis,
  scroller,
  cameraY,
  onLitIndexChange,
}: CursorScrollTimelineOptions) {
  // Lenis → ScrollTrigger sync
  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length && typeof value === "number") {
        lenis.scrollTo(value, { immediate: true });
      }
      return window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  const totalNodes = PIPELINE_NODES.length;
  const totalDistance = (totalNodes - 1) * NODE_SPACING;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scroller,
      start: "top top",
      end: "+=4000",
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.floor(self.progress * totalNodes);
        onLitIndexChange(Math.min(idx, totalNodes - 1));
      },
    },
  });

  tl.to(cameraY, { value: -totalDistance, ease: "none" });

  ScrollTrigger.refresh();

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
