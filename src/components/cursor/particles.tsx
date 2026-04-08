"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Points,
  ShaderMaterial,
} from "three";
import { latLngToXYZ } from "@/lib/three/geo";

const PARTICLE_COUNT = 3000;
const EARTH_RADIUS = 2;

const VERTEX_SHADER = /* glsl */ `
  uniform float uProgress;
  attribute vec3 aTerminal;
  attribute vec3 aEarth;
  varying float vGlow;

  void main() {
    vec3 pos = mix(aTerminal, aEarth, uProgress);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(2.0, 4.0, uProgress) * (300.0 / -mv.z);
    vGlow = uProgress;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(0.29, 0.62, 1.0), vec3(1.0, 0.67, 0.0), vGlow);
    gl_FragColor = vec4(col, alpha);
  }
`;

function buildPositions() {
  const terminal = new Float32Array(PARTICLE_COUNT * 3);
  const earth = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Terminal cluster: roughly box-shaped near origin (where the typer sits).
    const tx = (Math.random() - 0.5) * 3.2;
    const ty = (Math.random() - 0.5) * 0.6;
    const tz = (Math.random() - 0.5) * 0.4;
    terminal[i * 3] = tx;
    terminal[i * 3 + 1] = ty;
    terminal[i * 3 + 2] = tz;

    // Earth shell: uniform points on a sphere of radius EARTH_RADIUS.
    const lat = Math.acos(2 * Math.random() - 1) * (180 / Math.PI) - 90;
    const lng = Math.random() * 360 - 180;
    const [x, y, z] = latLngToXYZ(lat, lng, EARTH_RADIUS);
    earth[i * 3] = x;
    earth[i * 3 + 1] = y;
    earth[i * 3 + 2] = z;
  }
  return { terminal, earth };
}

export function createParticleMaterial() {
  return new ShaderMaterial({
    uniforms: { uProgress: { value: 0 } },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

export function tweenProgress(
  material: ShaderMaterial,
  to: number,
  duration = 1.6,
) {
  return gsap.to(material.uniforms.uProgress, {
    value: to,
    duration,
    ease: "power2.inOut",
  });
}

export type ParticlesHandle = {
  dissolveFromTerminal: () => void;
  reformAsEarth: () => void;
};

export function Particles({
  handleRef,
}: {
  handleRef?: React.MutableRefObject<ParticlesHandle | null>;
}) {
  const pointsRef = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const { terminal, earth } = buildPositions();
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(terminal, 3));
    geo.setAttribute("aTerminal", new BufferAttribute(terminal, 3));
    geo.setAttribute("aEarth", new BufferAttribute(earth, 3));
    const mat = createParticleMaterial();
    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    if (!handleRef) return;
    handleRef.current = {
      dissolveFromTerminal: () => {
        tweenProgress(material, 1);
      },
      reformAsEarth: () => {
        tweenProgress(material, 0);
      },
    };
    return () => {
      handleRef.current = null;
    };
  }, [handleRef, material]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
