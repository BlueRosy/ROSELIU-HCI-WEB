import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Iridescent dust tuned to the pink-blue gradient sky.
const PALETTE = [
  new THREE.Color("#6BA6FF"),
  new THREE.Color("#F3A6C8"),
  new THREE.Color("#9B8FD9"),
  new THREE.Color("#E08FB0"),
  new THREE.Color("#7EC4D8"),
  new THREE.Color("#C9A0E0"),
  new THREE.Color("#D4A574"),
] as const;

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
    // Sharp, fine sparkle: each star flickers fast at its own speed/phase,
    // and the high power makes it spend most time dim with brief bright pops.
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
    // Crisp pinpoint star: tight bright core, very small halo.
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.05, d);
    float glow = smoothstep(0.5, 0.3, d) * 0.35;
    float alpha = (core + glow) * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function Starfield({ count = 1800 }: { count?: number }) {
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

      const a = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const bColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      tmp.copy(a).lerp(bColor, 0.25 + Math.random() * 0.45);
      const bright = 0.75 + Math.random() * 0.25;
      colors.set([tmp.r * bright, tmp.g * bright, tmp.b * bright], i * 3);

      // Mostly fine dust, a few slightly bigger — strong bias toward tiny.
      scales[i] = Math.random() * Math.random() * 1.8 + 0.22;
      phases[i] = Math.random() * Math.PI * 2;
      // Varied, fairly fast flicker so the field reads as fine sparkle.
      speeds[i] = 2.5 + Math.random() * 4.5;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 58 * Math.min(1.5, window.devicePixelRatio || 1) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.01;
      const px = state.pointer.x * 0.3;
      const py = state.pointer.y * 0.2;
      group.current.position.x += (px - group.current.position.x) * 0.02;
      group.current.position.y += (py - group.current.position.y) * 0.02;
    }
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

export default function ParticleField({ active }: { active: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 11], fov: 55 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Starfield />
    </Canvas>
  );
}
