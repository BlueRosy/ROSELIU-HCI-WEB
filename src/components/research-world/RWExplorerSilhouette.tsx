import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { useNormalizedGltf } from "./RWGltfModel";
import {
  MOVE_SPEED,
  SPAWN_POSITION,
  WORLD_BOUNDS,
  type KeyState,
} from "./rwWorldConfig";

export default function RWExplorerSilhouette({
  keysRef,
  playerPosRef,
  onMovingChange,
  teleportTargetRef,
}: {
  keysRef: React.MutableRefObject<KeyState>;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  onMovingChange: (moving: boolean) => void;
  teleportTargetRef?: React.MutableRefObject<THREE.Vector3 | null>;
}) {
  const root = useRef<THREE.Group>(null);
  const movingRef = useRef(false);
  const bobRef = useRef(0);
  const model = useNormalizedGltf(researchWorldAssets.explorerCloak, 1.35);

  useFrame((_, delta) => {
    if (!root.current) return;

    if (teleportTargetRef?.current) {
      root.current.position.copy(teleportTargetRef.current);
      teleportTargetRef.current = null;
    }

    const keys = keysRef.current;
    let dx = 0;
    let dz = 0;
    if (keys.forward) dz -= 1;
    if (keys.back) dz += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    const isMoving = dx !== 0 || dz !== 0;
    if (movingRef.current !== isMoving) {
      movingRef.current = isMoving;
      onMovingChange(isMoving);
    }

    if (isMoving) {
      const len = Math.hypot(dx, dz) || 1;
      dx /= len;
      dz /= len;
      root.current.position.x += dx * MOVE_SPEED * delta;
      root.current.position.z += dz * MOVE_SPEED * delta;
      root.current.rotation.y = Math.atan2(dx, dz);
      bobRef.current += delta * 8;
    }

    root.current.position.x = THREE.MathUtils.clamp(
      root.current.position.x,
      WORLD_BOUNDS.xMin,
      WORLD_BOUNDS.xMax,
    );
    root.current.position.z = THREE.MathUtils.clamp(
      root.current.position.z,
      WORLD_BOUNDS.zMin,
      WORLD_BOUNDS.zMax,
    );
    root.current.position.y = isMoving ? Math.sin(bobRef.current) * 0.04 : 0;

    playerPosRef.current.copy(root.current.position);
  });

  return (
    <group ref={root} position={SPAWN_POSITION}>
      <primitive object={model.clone(true)} />
    </group>
  );
}
