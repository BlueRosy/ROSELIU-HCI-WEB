import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { buildPathNodes, type PathNode } from "./rwWorldConfig";

function PathNodeCard({
  node,
  near,
  playerPosRef,
}: {
  node: PathNode;
  near: boolean;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = node.position[1] + Math.sin(t * 1.5 + node.position[0]) * 0.05;
    const p = playerPosRef.current;
    group.current.lookAt(p.x, group.current.position.y, p.z);
  });

  return (
    <group ref={group} position={node.position}>
      <mesh>
        <boxGeometry args={[1.25, 0.62, 0.04]} />
        <meshPhysicalMaterial
          color={rwWonderland.panelGlass}
          transparent
          opacity={near ? 0.88 : 0.72}
          roughness={0.06}
          metalness={0.04}
          transmission={0.25}
          emissive={rwWonderland.panelEmissive}
          emissiveIntensity={near ? 0.15 : 0.06}
        />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.3, 0.66, 0.02]} />
        <meshBasicMaterial
          color={rwWonderland.panelBorder}
          transparent
          opacity={near ? 0.5 : 0.28}
        />
      </mesh>
      <Text
        position={[0, 0.22, 0.03]}
        fontSize={0.07}
        color={rwWonderland.pathGlowBright}
        anchorX="center"
        anchorY="middle"
      >
        {node.category}
      </Text>
      <Text
        position={[0, -0.02, 0.03]}
        fontSize={0.1}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.05}
      >
        {node.title}
      </Text>
      {near && (
        <Text
          position={[0, -0.22, 0.03]}
          fontSize={0.07}
          color={rwWonderland.pathGlowBright}
          anchorX="center"
          anchorY="middle"
        >
          Press E
        </Text>
      )}
    </group>
  );
}

export default function RWPathNodes({
  nearNodeId,
  playerPosRef,
  nodesRef,
}: {
  nearNodeId: string | null;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  nodesRef: React.MutableRefObject<PathNode[]>;
}) {
  const nodes = useMemo(() => buildPathNodes(researchWorld.zones), []);
  nodesRef.current = nodes;

  return (
    <group>
      {nodes.map((node) => (
        <PathNodeCard
          key={node.id}
          node={node}
          near={nearNodeId === node.id}
          playerPosRef={playerPosRef}
        />
      ))}
    </group>
  );
}
