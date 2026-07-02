import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { loop } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { LANDMARKS } from "./rwWorldConfig";

export default function RWLoopCenter() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const lm = LANDMARKS.find((l) => l.id === "loop");
  if (!lm) return null;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current) outer.current.rotation.y = t * 0.08;
    if (inner.current) inner.current.rotation.y = -t * 0.12;
  });

  return (
    <group position={lm.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshPhysicalMaterial
          color="#F0E8E4"
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.15}
          transparent
          opacity={0.75}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={outer} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.6, 0]}>
        <torusGeometry args={[2.4, 0.05, 16, 64]} />
        <meshStandardMaterial
          color={rwWonderland.pathGlowBright}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.75, 0]}>
        <torusGeometry args={[1.6, 0.03, 12, 48]} />
        <meshBasicMaterial color={rwWonderland.rim} transparent opacity={0.6} />
      </mesh>
      {loop.map((node, i) => {
        const angle = (i / loop.length) * Math.PI * 2 - Math.PI / 2;
        const r = 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        return (
          <group key={node.key} position={[x, 0, z]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 1, 8]} />
              <meshStandardMaterial
                color="#FFF8F0"
                emissive={rwWonderland.pathGlow}
                emissiveIntensity={node.current ? 0.35 : 0.12}
              />
            </mesh>
            <Text
              position={[0, 1.15, 0]}
              fontSize={0.09}
              color={node.current ? rwWonderland.pathGlowBright : rwWonderland.textMuted}
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
      <pointLight position={[0, 3, 0]} intensity={0.9} color={rwWonderland.pathGlow} distance={14} />
    </group>
  );
}
