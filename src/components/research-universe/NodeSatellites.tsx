import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { UniverseNodeId } from "../../content/site";
import { researchUniverse } from "../../content/site";

export default function NodeSatellites({
  nodeId,
  color,
}: {
  nodeId: UniverseNodeId;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);

  const satellites = useMemo(() => {
    const node = researchUniverse.nodes.find((n) => n.id === nodeId);
    if (!node) return [];
    const count = node.satellites.length;
    return node.satellites.map((label, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.25 + (i % 2) * 0.35;
      return { label, angle, r, y: Math.sin(angle * 2) * 0.2 };
    });
  }, [nodeId]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  const col = new THREE.Color(color);

  return (
    <group ref={group}>
      {satellites.map((sat) => (
        <group
          key={sat.label}
          position={[
            Math.cos(sat.angle) * sat.r,
            sat.y,
            Math.sin(sat.angle) * sat.r,
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial
              color={col}
              toneMapped={false}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
