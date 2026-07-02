import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../theme/palette";
import { useLoopCurve } from "./useLoopCurve";

export default function ResearchLoop() {
  const curve = useLoopCurve();
  const tubeRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, 0.04, 12, true);
  }, [curve]);

  useFrame((state) => {
    if (!tubeRef.current) return;
    const mat = tubeRef.current.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = 0.35 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshPhysicalMaterial
        color={palette.roseSoft}
        emissive={palette.primary}
        emissiveIntensity={0.35}
        transparent
        opacity={0.55}
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
