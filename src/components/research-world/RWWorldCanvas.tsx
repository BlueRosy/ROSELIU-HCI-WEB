import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type * as THREE from "three";
import RWWorldScene from "./RWWorldScene";
import type { KeyState, PathNode } from "./rwWorldConfig";

export default function RWWorldCanvas({
  keysRef,
  playerPosRef,
  onNearZoneChange,
  onNearNodeChange,
  activeZoneId,
  nearZoneId,
  nearNodeId,
  onMovingChange,
  teleportTargetRef,
  pathNodesRef,
  onSceneReady,
}: {
  keysRef: React.MutableRefObject<KeyState>;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  onNearZoneChange: (zoneId: string | null) => void;
  onNearNodeChange: (nodeId: string | null) => void;
  activeZoneId: string | null;
  nearZoneId: string | null;
  nearNodeId: string | null;
  onMovingChange: (moving: boolean) => void;
  teleportTargetRef: React.MutableRefObject<THREE.Vector3 | null>;
  pathNodesRef: React.MutableRefObject<PathNode[]>;
  onSceneReady?: () => void;
}) {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.25]}
      camera={{ position: [0, 4, 11], fov: 44 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full"
      tabIndex={0}
    >
      <Suspense fallback={null}>
        <RWWorldScene
          keysRef={keysRef}
          playerPosRef={playerPosRef}
          onNearZoneChange={onNearZoneChange}
          onNearNodeChange={onNearNodeChange}
          activeZoneId={activeZoneId}
          nearZoneId={nearZoneId}
          nearNodeId={nearNodeId}
          onMovingChange={onMovingChange}
          teleportTargetRef={teleportTargetRef}
          pathNodesRef={pathNodesRef}
          onSceneReady={onSceneReady}
        />
      </Suspense>
    </Canvas>
  );
}
