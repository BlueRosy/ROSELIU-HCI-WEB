import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import ResearchWorldTrailScene from "./ResearchWorldTrailScene";
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
      <ambientLight intensity={0.65} color="#FFF8F0" />
      <hemisphereLight
        args={["#FFF5EE", rwWonderland.ground, 0.55]}
        position={[0, 20, 0]}
      />
      <directionalLight
        position={[8, 14, 10]}
        intensity={1.1}
        color="#FFFAF5"
        castShadow={false}
      />
      <directionalLight position={[-6, 8, -4]} intensity={0.35} color={rwWonderland.rim} />

      <TrailCameraRig />
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
  return (
    <UniverseProvider value={sceneState}>
      <Canvas
        camera={{ position: [0, 4, 9], fov: 48, near: 0.1, far: 80 }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </UniverseProvider>
  );
}
