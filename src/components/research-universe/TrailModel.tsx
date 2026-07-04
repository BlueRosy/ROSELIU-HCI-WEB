import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type NormalizeOpts = {
  /** Scale so the model's height equals this (world units). */
  targetY?: number;
  /** Scale so the model's largest horizontal span equals this. Overrides targetY. */
  targetXZ?: number;
  /** Correct a model's authored orientation (radians), baked in before measuring. */
  tiltX?: number;
  tiltZ?: number;
};

/**
 * Clone + normalize a GLB once: apply any orientation correction, scale to a
 * target size, drop onto the ground (min.y = 0), and centre it on x/z. Wide,
 * flat pieces (plazas, ponds, meadows) can be sized by footprint (targetXZ)
 * instead of height (targetY).
 */
export function useTrailModel(url: string, opts: NormalizeOpts) {
  const { scene } = useGLTF(url);
  const { targetY, targetXZ, tiltX = 0, tiltZ = 0 } = opts;
  return useMemo(() => {
    const clone = scene.clone(true);
    // Bake orientation correction first so sizing + grounding use the final pose.
    clone.rotation.set(tiltX, 0, tiltZ);
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    const scale =
      targetXZ !== undefined
        ? targetXZ / Math.max(size.x, size.z, 0.001)
        : (targetY ?? 2) / Math.max(size.y, 0.001);

    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);

    const grounded = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    grounded.getCenter(center);
    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= grounded.min.y;
    return clone;
  }, [scene, targetY, targetXZ, tiltX, tiltZ]);
}

export default function TrailModel({
  url,
  position,
  rotationY = 0,
  targetY,
  targetXZ,
  tiltX,
  tiltZ,
}: {
  url: string;
  position: [number, number, number];
  rotationY?: number;
} & NormalizeOpts) {
  const model = useTrailModel(url, { targetY, targetXZ, tiltX, tiltZ });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <primitive object={model} />
    </group>
  );
}
