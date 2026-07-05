import { Text } from "@react-three/drei";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";

/** Height of the shared stone plinth. Landmark models are seated on top of it
 * (offset by this amount) so the three zones read as one matched set. */
export const PLINTH_HEIGHT = 0.2;

/**
 * A unified circular plinth + accent rim + stamped number, placed under each of
 * the three tripod landmarks so they look like a coordinated milestone set
 * (rather than three unrelated models scattered on the ground).
 */
export default function RWMilestoneBase({
  position,
  index,
  label,
  accent,
  radius = 2.3,
}: {
  position: [number, number, number];
  index: string;
  label: string;
  accent: string;
  radius?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, PLINTH_HEIGHT / 2, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius + 0.18, PLINTH_HEIGHT, 56]} />
        <meshStandardMaterial color="#EFE6DE" roughness={0.72} metalness={0.04} />
      </mesh>
      {/* accent rim glow around the plinth top */}
      <mesh position={[0, PLINTH_HEIGHT + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.14, radius + 0.02, 56]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* number stamped flat on the plinth front edge (reads from the arc + overhead) */}
      <Text
        position={[0, PLINTH_HEIGHT + 0.012, radius - 0.62]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.014}
        outlineColor="#FFFFFF"
      >
        {index}
      </Text>
      <Text
        position={[0, PLINTH_HEIGHT + 0.012, radius - 1.18]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.19}
        color={rwWonderland.textMuted}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {label.toUpperCase()}
      </Text>
    </group>
  );
}
