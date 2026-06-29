import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PRIMARY = new THREE.Color("#6BA6FF");
const ACCENT = new THREE.Color("#F3A6C8");

/**
 * Concept: fragmented conversational and behavioral signals gradually
 * forming interpretable patterns of wellbeing. Low density, low speed,
 * gentle mouse parallax — never a starfield, never neon.
 */
function Signals({ count = 240 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // Loose horizontal band so it reads as "drifting signals", not space.
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 9;
      const z = (Math.random() - 0.5) * 6;
      positions.set([x, y, z], i * 3);

      const t = Math.min(1, Math.max(0, (x + 8) / 16 + (Math.random() - 0.5) * 0.3));
      tmp.copy(PRIMARY).lerp(ACCENT, t);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);

      scales[i] = Math.random();
    }
    return { positions, colors, scales };
  }, [count]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Very slow ambient rotation.
    group.current.rotation.y += delta * 0.04;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    // Gentle mouse parallax.
    const px = state.pointer.x * 0.35;
    const py = state.pointer.y * 0.25;
    group.current.position.x += (px - group.current.position.x) * 0.03;
    group.current.position.y += (py - group.current.position.y) * 0.03;

    // Soft vertical breathing of individual points.
    if (points.current) {
      const arr = points.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        const yi = i * 3 + 1;
        arr[yi] += Math.sin(state.clock.elapsedTime * 0.4 + scales[i] * 6) * 0.0009;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.13}
          sizeAttenuation
          transparent
          opacity={0.85}
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
      <Signals />
    </Canvas>
  );
}
