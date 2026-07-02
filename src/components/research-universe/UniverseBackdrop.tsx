import * as THREE from "three";
import { Backdrop, GradientTexture } from "@react-three/drei";

/** Soft warm studio backdrop — gives glass orbs something to reflect. */
export default function UniverseBackdrop() {
  return (
    <Backdrop receiveShadow scale={[24, 14, 8]} position={[0, 0, -6]}>
      <meshBasicMaterial side={THREE.BackSide}>
        <GradientTexture
          stops={[0, 0.45, 1]}
          colors={["#FFFDF8", "#F5EBE0", "#E8DDD4"]}
        />
      </meshBasicMaterial>
    </Backdrop>
  );
}
