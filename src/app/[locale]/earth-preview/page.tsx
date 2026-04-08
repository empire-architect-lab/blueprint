// TEMP: removed in T016. Preview-only route for T009/T010 visual verification.
"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Earth } from "@/components/cursor/earth";
import { Particles, type ParticlesHandle } from "@/components/cursor/particles";

export default function EarthPreviewPage() {
  const handleRef = useRef<ParticlesHandle | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d") handleRef.current?.dissolveFromTerminal();
      if (e.key === "r") handleRef.current?.reformAsEarth();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="w-screen h-screen bg-black">
      <div data-role="earth" className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} aria-hidden="true">
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Earth />
          <Particles handleRef={handleRef} />
        </Canvas>
      </div>
    </main>
  );
}
