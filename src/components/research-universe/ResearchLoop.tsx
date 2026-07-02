import { useMemo } from "react";
import * as THREE from "three";
import { palette } from "../../theme/palette";
import { useLoopCurve } from "./useLoopCurve";

export default function ResearchLoop() {
  const curve = useLoopCurve();

  const { outer, core, glow } = useMemo(() => {
    return {
      outer: new THREE.TubeGeometry(curve, 256, 0.09, 16, true),
      core: new THREE.TubeGeometry(curve, 256, 0.025, 12, true),
      glow: new THREE.TubeGeometry(curve, 128, 0.16, 8, true),
    };
  }, [curve]);

  return (
    <group>
      {/* Outer soft halo */}
      <mesh geometry={glow}>
        <meshBasicMaterial
          color={palette.roseSoft}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Mid tube */}
      <mesh geometry={outer}>
        <meshPhysicalMaterial
          color={palette.cream}
          emissive={palette.primary}
          emissiveIntensity={0.25}
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bright core filament */}
      <mesh geometry={core}>
        <meshBasicMaterial
          color="#FFE8E0"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
