import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function useNormalizedGltf(url: string, targetHeight = 2) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = targetHeight / Math.max(size.y, 0.001);
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);
    const grounded = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    grounded.getCenter(center);
    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= grounded.min.y;
    return clone;
  }, [scene, targetHeight]);
}

export default function RWGltfModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  targetHeight = 2,
}: {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  targetHeight?: number;
}) {
  const model = useNormalizedGltf(url, targetHeight);
  return (
    <group position={position} rotation={rotation}>
      <primitive object={model.clone(true)} />
    </group>
  );
}
