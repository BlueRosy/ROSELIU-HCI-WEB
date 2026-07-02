import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { LANDMARKS, type Landmark } from "./rwWorldConfig";

function GlassPanel({
  landmark,
  active,
  near,
  playerPosRef,
}: {
  landmark: Landmark;
  active: boolean;
  near: boolean;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);
  const zone = researchWorld.zones.find((z) => z.id === landmark.zoneId);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const baseY = landmark.position[1] + landmark.panelOffset[1];
    group.current.position.y = baseY + Math.sin(t * 1.2 + landmark.position[0]) * 0.08;
    const targetScale = active ? 1.12 : near ? 1.05 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    const p = playerPosRef.current;
    group.current.lookAt(p.x, group.current.position.y, p.z);
  });

  if (!zone) return null;

  const px = landmark.position[0] + landmark.panelOffset[0];
  const pz = landmark.position[2] + landmark.panelOffset[2];

  return (
    <group ref={group} position={[px, landmark.panelOffset[1], pz]}>
      <mesh>
        <boxGeometry args={[2.8, 1.6, 0.06]} />
        <meshPhysicalMaterial
          color={rwWonderland.panelGlass}
          transparent
          opacity={active ? 0.82 : near ? 0.7 : 0.55}
          roughness={0.06}
          metalness={0.08}
          transmission={0.35}
          thickness={0.3}
          emissive={rwWonderland.panelEmissive}
          emissiveIntensity={near || active ? 0.18 : 0.08}
        />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.9, 1.7, 0.02]} />
        <meshBasicMaterial
          color={rwWonderland.panelBorder}
          transparent
          opacity={near || active ? 0.45 : 0.25}
          wireframe
        />
      </mesh>
      <Text
        position={[0, 0.15, 0.04]}
        fontSize={0.22}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
      >
        {zone.label}
      </Text>
      <Text
        position={[0, -0.35, 0.04]}
        fontSize={0.14}
        color={rwWonderland.textMuted}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {near && !active ? "Press E" : zone.title}
      </Text>
    </group>
  );
}

export default function RWTreePanels({
  activeZoneId,
  nearZoneId,
  playerPosRef,
}: {
  activeZoneId: string | null;
  nearZoneId: string | null;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  return (
    <group>
      {LANDMARKS.map((lm) => (
        <GlassPanel
          key={lm.id}
          landmark={lm}
          active={activeZoneId === lm.zoneId}
          near={nearZoneId === lm.zoneId}
          playerPosRef={playerPosRef}
        />
      ))}
    </group>
  );
}
