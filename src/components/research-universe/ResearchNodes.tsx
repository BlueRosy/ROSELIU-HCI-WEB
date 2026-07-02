import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { UniverseNodeId } from "../../content/site";
import { researchUniverse } from "../../content/site";
import { NODE_POSITIONS } from "./universeConfig";
import { useUniverse } from "./UniverseContext";
import NodeSatellites from "./NodeSatellites";

function GlassNode({
  id,
  color,
  position,
}: {
  id: UniverseNodeId;
  color: string;
  position: [number, number, number];
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const satellites = useRef<THREE.Group>(null);
  const { activeNode } = useUniverse();
  const col = new THREE.Color(color);

  useFrame((_, delta) => {
    const active = activeNode.current === id;
    const targetScale = active ? 1.35 : 1;
    if (mesh.current) {
      const s = mesh.current.scale.x;
      mesh.current.scale.setScalar(s + (targetScale - s) * Math.min(1, delta * 4));
      const mat = mesh.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = active ? 0.85 : 0.35;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.3;
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.65 : 0.25;
    }
    if (satellites.current) {
      satellites.current.visible = active;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          emissive={col}
          emissiveIntensity={0.35}
          transparent
          opacity={0.72}
          roughness={0.15}
          metalness={0.05}
          transmission={0.35}
          thickness={0.5}
        />
      </mesh>
      <group ref={satellites} visible={false}>
        <NodeSatellites nodeId={id} color={color} />
      </group>
    </group>
  );
}

export default function ResearchNodes() {
  return (
    <group>
      {researchUniverse.nodes.map((node) => (
        <GlassNode
          key={node.id}
          id={node.id}
          color={node.color}
          position={NODE_POSITIONS[node.id]}
        />
      ))}
    </group>
  );
}
