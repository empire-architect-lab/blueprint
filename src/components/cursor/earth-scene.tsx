"use client";

import { Canvas } from "@react-three/fiber";
import { Earth } from "./earth";

export function EarthScene() {
  return (
    <div data-role="earth" className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} aria-hidden="true">
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Earth />
      </Canvas>
    </div>
  );
}
