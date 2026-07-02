import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { buildPathNodes, PATH_POINTS, type PathNode } from "./rwWorldConfig";

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
    group.current.position.y = node.position[1] + Math.sin(t * 1.5 + node.t * 10) * 0.06;
    const p = playerPosRef.current;
    group.current.lookAt(p.x, group.current.position.y, p.z);
  });

  return (
    <group ref={group} position={node.position}>
      <mesh>
        <boxGeometry args={[1.4, 0.7, 0.04]} />
        <meshPhysicalMaterial
          color={rwWonderland.panelGlass}
          transparent
          opacity={near ? 0.75 : 0.5}
          roughness={0.08}
          metalness={0.05}
          transmission={0.35}
          emissive={rwWonderland.panelEmissive}
          emissiveIntensity={near ? 0.2 : 0.08}
        />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.45, 0.75, 0.02]} />
        <meshBasicMaterial
          color={rwWonderland.panelBorder}
          transparent
          opacity={near ? 0.45 : 0.2}
          wireframe
        />
      </mesh>
      <Text
        position={[0, 0.05, 0.03]}
        fontSize={0.12}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
      >
        {node.title}
      </Text>
      {near && (
        <Text
          position={[0, -0.2, 0.03]}
          fontSize={0.08}
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
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_POINTS.map((p) => new THREE.Vector3(...p))),
    [],
  );

  const nodes = useMemo(() => {
    const built = buildPathNodes(researchWorld.zones);
    return built.map((node) => {
      const p = curve.getPointAt(node.t);
      const tangent = curve.getTangentAt(node.t);
      const side = node.t % 2 < 1 ? 1 : -1;
      const offset = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(side * 1.2);
      return {
        ...node,
        position: [p.x + offset.x, 1.1, p.z + offset.z] as [number, number, number],
      };
    });
  }, [curve]);

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
