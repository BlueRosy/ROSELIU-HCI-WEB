import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { UniverseNodeId } from "../../content/site";
import { researchUniverse } from "../../content/site";
import { NODE_POSITIONS } from "./universeConfig";
import { useUniverse } from "./UniverseContext";
import NodeSatellites from "./NodeSatellites";

function GlassOrb({
  id,
  color,
  position,
}: {
  id: UniverseNodeId;
  color: string;
  position: [number, number, number];
}) {
  const shell = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const satellites = useRef<THREE.Group>(null);
  const { activeNode } = useUniverse();
  const col = new THREE.Color(color);

  useFrame((state, delta) => {
    const active = activeNode.current === id;
    const target = active ? 1.22 : 1;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.02;

    if (shell.current) {
      const s = shell.current.scale.x;
      shell.current.scale.setScalar((s + (target - s) * Math.min(1, delta * 3)) * pulse);
    }
    if (core.current) {
      const mat = core.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.95 : 0.55;
    }
    if (halo.current) {
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.18 : 0.06;
      halo.current.scale.setScalar(active ? 1.35 : 1.15);
    }
    if (satellites.current) {
      satellites.current.visible = active;
    }
  });

  return (
    <group position={position}>
      {/* Outer additive halo */}
      <mesh ref={halo} scale={1.15}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Luminous core */}
      <mesh ref={core} scale={0.38}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.55} />
      </mesh>

      {/* Glass shell — Codrops / Olivier Larose transmission style */}
      <mesh ref={shell}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.35}
          thickness={0.65}
          chromaticAberration={0.045}
          anisotropy={0.25}
          distortion={0.12}
          distortionScale={0.15}
          temporalDistortion={0.08}
          iridescence={0.35}
          iridescenceIOR={1.2}
          roughness={0.04}
          transmission={1}
          ior={1.15}
          color="#FFFDF8"
          attenuationColor={col}
          attenuationDistance={0.85}
          samples={6}
          resolution={256}
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
        <GlassOrb
          key={node.id}
          id={node.id}
          color={node.color}
          position={NODE_POSITIONS[node.id]}
        />
      ))}
    </group>
  );
}
