import { Text } from "@react-three/drei";
import { loop } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { RWClosedLoopCoreGlb } from "./RWZoneAssets";
import { LANDMARKS } from "./rwWorldConfig";

export default function RWLoopCenter() {
  const lm = LANDMARKS.find((l) => l.id === "loop");
  if (!lm) return null;

  return (
    <group position={lm.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshPhysicalMaterial
          color="#F0E8E4"
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.12}
          transparent
          opacity={0.7}
          roughness={0.25}
        />
      </mesh>
      <RWClosedLoopCoreGlb />
      {loop.map((node, i) => {
        const angle = (i / loop.length) * Math.PI * 2 - Math.PI / 2;
        const r = 2.8;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        return (
          <group key={node.key} position={[x, 0, z]}>
            <Text
              position={[0, 1.8, 0]}
              fontSize={0.08}
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
