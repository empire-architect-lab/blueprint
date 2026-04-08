"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { latLngToXYZ } from "@/lib/three/geo";

const CASABLANCA_POSITION = latLngToXYZ(33.5731, -7.5898, 2.02);

export function Earth() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[2, 32]} />
        <meshBasicMaterial wireframe color="#4a9eff" />
      </mesh>
      <mesh position={CASABLANCA_POSITION}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          emissive="#ffaa00"
          emissiveIntensity={2}
          color="#ffaa00"
        />
      </mesh>
    </group>
  );
}
