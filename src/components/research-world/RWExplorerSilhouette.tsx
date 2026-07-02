import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import {
  MOVE_SPEED,
  SPAWN_POSITION,
  WORLD_BOUNDS,
  type KeyState,
} from "./rwWorldConfig";

function WalkTrail({ position }: { position: THREE.Vector3 }) {
  const trail = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(9), []);

  useFrame(() => {
    if (!trail.current) return;
    const attr = trail.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 6; i >= 3; i -= 3) {
      arr[i] = arr[i - 3];
      arr[i + 1] = arr[i - 2];
      arr[i + 2] = arr[i - 1];
    }
    arr[0] = position.x;
    arr[1] = 0.15;
    arr[2] = position.z;
    attr.needsUpdate = true;
  });

  return (
    <points ref={trail} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={rwWonderland.pathGlow}
        size={0.06}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

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
  const [moving, setMoving] = useState(false);
  const bobRef = useRef(0);
  const trailPos = useMemo(() => new THREE.Vector3(), []);

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

    const moving = dx !== 0 || dz !== 0;
    if (movingRef.current !== moving) {
      movingRef.current = moving;
      setMoving(moving);
      onMovingChange(moving);
    }

    if (moving) {
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
    root.current.position.y = moving ? Math.sin(bobRef.current) * 0.04 : 0;

    playerPosRef.current.copy(root.current.position);
    trailPos.copy(root.current.position);
  });

  return (
    <group ref={root} position={SPAWN_POSITION}>
      {moving && <WalkTrail position={trailPos} />}
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.48, 4, 8]} />
        <meshStandardMaterial
          color="#F5EFE8"
          emissive="#EDE4DA"
          emissiveIntensity={0.15}
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0, 0.95, -0.06]} rotation={[0.15, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.52, 6]} />
        <meshStandardMaterial
          color="#FFF8F0"
          transparent
          opacity={0.92}
          emissive="#F5EFE8"
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.01}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.06, 12]} />
        <meshStandardMaterial
          color={rwWonderland.pathGlowBright}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.35}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.55, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.32, 16]} />
        <meshBasicMaterial color={rwWonderland.pathGlowBright} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
