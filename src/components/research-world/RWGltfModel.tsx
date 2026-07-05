import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const DRACO_PATH = "/draco/gltf/";

function needsDraco(url: string) {
  return url.includes("new-landmarks") || url.includes("new-design-landmarks");
}

export function useNormalizedGltf(url: string, targetHeight = 2, warmStone = false) {
  const { scene } = useGLTF(url, needsDraco(url) ? DRACO_PATH : undefined);
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
    if (warmStone) warmStoneMaterials(clone);
    return clone;
  }, [scene, targetHeight, warmStone]);
}

const WARM_STONE = new THREE.Color("#EFE6DE");

/** Pull purple/mauve GLB materials back to warm ivory stone (States observatory). */
export function warmStoneMaterials(root: THREE.Object3D, strength = 0.38) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of materials) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const hsl = { h: 0, s: 0, l: 0 };
      raw.color.getHSL(hsl);
      const looksPurple = hsl.s > 0.06 && hsl.h > 0.62 && hsl.h < 0.93;
      if (looksPurple) {
        raw.color.lerp(WARM_STONE, strength);
      }
      if (raw.emissive) {
        raw.emissive.getHSL(hsl);
        if (hsl.s > 0.08 && hsl.h > 0.62 && hsl.h < 0.93) {
          raw.emissive.set("#000000");
          raw.emissiveIntensity = 0;
        }
      }
    }
  });
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
