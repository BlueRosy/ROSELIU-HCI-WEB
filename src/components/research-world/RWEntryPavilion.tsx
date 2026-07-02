import { Text } from "@react-three/drei";
import { rwWonderland } from "../../theme/rwWonderland";

export default function RWEntryPavilion() {
  return (
    <group position={[0, 0, 3.2]}>
      <mesh position={[-1.1, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 2.2, 8]} />
        <meshStandardMaterial color="#F5EFE8" roughness={0.5} />
      </mesh>
      <mesh position={[1.1, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 2.2, 8]} />
        <meshStandardMaterial color="#F5EFE8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[2.6, 0.18, 0.35]} />
        <meshStandardMaterial
          color={rwWonderland.pathGlowBright}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.2}
          roughness={0.4}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshPhysicalMaterial
          color="#F8F1E8"
          transparent
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>
      <Text
        position={[0, 1.6, 0.2]}
        fontSize={0.16}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        Welcome
      </Text>
      <Text
        position={[0, 1.25, 0.2]}
        fontSize={0.09}
        color={rwWonderland.textMuted}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
      >
        Follow the trail ahead
      </Text>
    </group>
  );
}
