// TEMP: removed in T016. Preview-only route for T009/T010/T011 visual verification.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Lenis from "lenis";
import { Earth } from "@/components/cursor/earth";
import { Particles, type ParticlesHandle } from "@/components/cursor/particles";
import { PipelineScene } from "@/components/cursor/pipeline-scene";
import {
  WhiteFlash,
  type WhiteFlashHandle,
  CINEMATIC_COMPLETE_EVENT,
} from "@/components/cursor/white-flash";
import { createCursorScrollTimeline } from "@/lib/animations/cursor-scroll-timeline";

function CameraRig({ y }: { y: { value: number } }) {
  useFrame(({ camera }) => {
    camera.position.y = y.value;
  });
  return null;
}

export default function EarthPreviewPage() {
  const handleRef = useRef<ParticlesHandle | null>(null);
  const flashRef = useRef<WhiteFlashHandle>(null);
  const cameraY = useMemo(() => ({ value: 0 }), []);
  const [litIndex, setLitIndex] = useState(-1);

  useEffect(() => {
    const onComplete = () => {
      // Hero handoff hook (T013 will mount the real hero here).
    };
    window.addEventListener(CINEMATIC_COMPLETE_EVENT, onComplete);
    return () =>
      window.removeEventListener(CINEMATIC_COMPLETE_EVENT, onComplete);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d") handleRef.current?.dissolveFromTerminal();
      if (e.key === "r") handleRef.current?.reformAsEarth();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const cleanup = createCursorScrollTimeline({
      lenis,
      scroller: document.documentElement,
      cameraY: cameraY,
      onLitIndexChange: setLitIndex,
      onFlashTrigger: () => flashRef.current?.trigger(),
    });

    return () => {
      cleanup();
      lenis.destroy();
    };
  }, [cameraY]);

  return (
    <main className="w-screen h-screen bg-black">
      <div data-role="earth" className="w-full h-full fixed inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} aria-hidden="true">
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <CameraRig y={cameraY} />
          <Earth />
          <Particles handleRef={handleRef} />
          <PipelineScene litIndex={litIndex} />
        </Canvas>
      </div>
      <div style={{ height: "500vh" }} aria-hidden="true" />
      <WhiteFlash ref={flashRef} />
    </main>
  );
}
