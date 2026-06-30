import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = ["#2F80ED", "#56CCF2"] as const;

type ParticleData = {
  positions: Float32Array;
  velocities: Float32Array;
  linePairs: [number, number][];
};

function buildParticles(count: number): ParticleData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const linePairs: [number, number][] = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    velocities[i * 3] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 1] = 0.004 + Math.random() * 0.006;
    velocities[i * 3 + 2] = 0;
  }

  for (let i = 0; i < count; i += 5) {
    const j = (i + 2 + Math.floor(Math.random() * 3)) % count;
    linePairs.push([i, j]);
  }

  return { positions, velocities, linePairs };
}

export default function SignalParticles({
  count = 100,
  parallax,
}: {
  count?: number;
  parallax: { x: number; y: number };
}) {
  const data = useMemo(() => buildParticles(count), [count]);
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions.slice(), 3));
    return g;
  }, [data]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(data.linePairs.length * 6), 3),
    );
    return g;
  }, [data.linePairs.length]);

  useFrame((_, delta) => {
    if (!points.current || !lines.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += data.velocities[i * 3] * delta * 60;
      arr[i * 3 + 1] += data.velocities[i * 3 + 1] * delta * 60;

      if (arr[i * 3 + 1] > 7) {
        arr[i * 3 + 1] = -7;
        arr[i * 3] = (Math.random() - 0.5) * 22;
      }
      if (arr[i * 3] > 12) arr[i * 3] = -12;
      if (arr[i * 3] < -12) arr[i * 3] = 12;
    }
    attr.needsUpdate = true;

    const lineAttr = lines.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const lineArr = lineAttr.array as Float32Array;
    data.linePairs.forEach(([a, b], idx) => {
      const o = idx * 6;
      lineArr[o] = arr[a * 3];
      lineArr[o + 1] = arr[a * 3 + 1];
      lineArr[o + 2] = arr[a * 3 + 2];
      lineArr[o + 3] = arr[b * 3];
      lineArr[o + 4] = arr[b * 3 + 1];
      lineArr[o + 5] = arr[b * 3 + 2];
    });
    lineAttr.needsUpdate = true;

    if (group.current) {
      const tx = parallax.x * 1.1;
      const ty = parallax.y * 0.7;
      group.current.position.x += (tx - group.current.position.x) * Math.min(1, delta * 2.5);
      group.current.position.y += (ty - group.current.position.y) * Math.min(1, delta * 2.5);
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={pointGeo}>
        <pointsMaterial
          color={COLORS[0]}
          size={0.035}
          transparent
          opacity={0.1}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial color={COLORS[1]} transparent opacity={0.05} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
