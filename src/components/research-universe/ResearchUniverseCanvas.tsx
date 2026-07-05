import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import ResearchWorldTrailScene from "./ResearchWorldTrailScene";
import TrailAnimationDriver from "./TrailAnimationDriver";
import TrailCameraRig, { SceneParallaxGroup } from "./TrailCameraRig";
import type { UniverseSceneState } from "./UniverseContext";
import { UniverseProvider } from "./UniverseContext";

function Scene() {
  return (
    <>
      <color attach="background" args={[rwWonderland.background]} />
      <fog
        attach="fog"
        args={[rwWonderland.fog, rwWonderland.fogNear, rwWonderland.fogFar]}
      />
      <ambientLight intensity={0.74} color="#FFF6F0" />
      <hemisphereLight
        args={["#FFF8F5", "#F5E0DC", 0.62]}
        position={[0, 20, 0]}
      />
      <directionalLight
        position={[8, 14, 10]}
        intensity={1.22}
        color="#FFF5EE"
        castShadow={false}
      />
      <directionalLight position={[-6, 8, -4]} intensity={0.45} color="#E8B4BC" />
      <pointLight position={[0, 4, 8]} intensity={0.35} color="#FFE8EE" distance={28} decay={2} />

      <TrailCameraRig />
      <TrailAnimationDriver />
      <SceneParallaxGroup>
        <ResearchWorldTrailScene />
      </SceneParallaxGroup>
    </>
  );
}

export default function ResearchUniverseCanvas({
  sceneState,
}: {
  sceneState: UniverseSceneState;
}) {
  const invalidateBound = useRef(false);

  return (
    <UniverseProvider value={sceneState}>
      <Canvas
        camera={{ position: [0, 4, 9], fov: 48, near: 0.1, far: 80 }}
        dpr={[1, 1.25]}
        frameloop="demand"
        style={{ pointerEvents: "none" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, invalidate }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          if (!invalidateBound.current) {
            sceneState.invalidate.current = invalidate;
            invalidateBound.current = true;
            invalidate();
          }
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </UniverseProvider>
  );
}
