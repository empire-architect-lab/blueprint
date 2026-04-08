"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { DoubleSide, ExtrudeGeometry, Shape, type BufferGeometry } from "three";

// Minimal stylized "V" path (Vercel-style triangle), inline so no network fetch.
const VERCEL_TRIANGLE: [number, number][] = [
  [0, 1],
  [1, -0.6],
  [-1, -0.6],
];

function buildVercelGeometry(): BufferGeometry {
  const shape = new Shape();
  const [first, ...rest] = VERCEL_TRIANGLE;
  shape.moveTo(first[0], first[1]);
  for (const [x, y] of rest) shape.lineTo(x, y);
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
}

export function PipelineNode({
  label,
  position,
  isVercel = false,
  isLit = false,
}: {
  label: string;
  position: [number, number, number];
  isVercel?: boolean;
  isLit?: boolean;
}) {
  const vercelGeo = useMemo(
    () => (isVercel ? buildVercelGeometry() : null),
    [isVercel],
  );

  const color = isLit ? "#ffaa00" : "#4a9eff";

  return (
    <group position={position}>
      {isVercel && vercelGeo ? (
        <mesh geometry={vercelGeo}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isLit ? 1.5 : 0.4}
            side={DoubleSide}
          />
        </mesh>
      ) : (
        <mesh>
          <torusGeometry args={[0.6, 0.12, 16, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isLit ? 1.5 : 0.4}
          />
        </mesh>
      )}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
