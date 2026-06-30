import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Warm botanical dust for Research backdrop. */
export const HERO_GALAXY_PALETTE = [
  new THREE.Color("#8F514C"),
  new THREE.Color("#B9786F"),
  new THREE.Color("#D4A59E"),
  new THREE.Color("#8A9275"),
  new THREE.Color("#A8AD98"),
  new THREE.Color("#C4C9B8"),
  new THREE.Color("#E8E2D8"),
  new THREE.Color("#F8F1E8"),
  new THREE.Color("#FFFDF8"),
  new THREE.Color("#FFFFFF"),
] as const;

export const RESEARCH_GALAXY_PALETTE = HERO_GALAXY_PALETTE;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    float s = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
    vTwinkle = 0.18 + 0.42 * pow(s, 3.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.05, d);
    float glow = smoothstep(0.5, 0.3, d) * 0.35;
    float alpha = (core + glow) * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function Starfield({
  count = 1600,
  palette = HERO_GALAXY_PALETTE,
  parallax,
  rotationSpeed = 0.01,
}: {
  count?: number;
  palette?: readonly THREE.Color[];
  parallax?: { x: number; y: number };
  rotationSpeed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 17;
      const z = (Math.random() - 0.5) * 10 - 3;
      positions.set([x, y, z], i * 3);

      const a = palette[Math.floor(Math.random() * palette.length)];
      const b = palette[Math.floor(Math.random() * palette.length)];
      tmp.copy(a).lerp(b, 0.25 + Math.random() * 0.45);
      const bright = 0.75 + Math.random() * 0.25;
      colors.set([tmp.r * bright, tmp.g * bright, tmp.b * bright], i * 3);

      scales[i] = Math.random() * Math.random() * 1.8 + 0.22;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 2.5 + Math.random() * 4.5;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count, palette]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: {
        value: 58 * Math.min(1.5, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (!group.current) return;

    group.current.rotation.y += delta * rotationSpeed;

    const px = parallax ? parallax.x * 0.3 : state.pointer.x * 0.3;
    const py = parallax ? parallax.y * 0.2 : state.pointer.y * 0.2;
    group.current.position.x += (px - group.current.position.x) * 0.02;
    group.current.position.y += (py - group.current.position.y) * 0.02;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}
