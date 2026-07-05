import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRwWonderland } from "../../theme/rwWonderland";
import ResearchWorldTrailScene from "./ResearchWorldTrailScene";
import TrailAnimationDriver from "./TrailAnimationDriver";
import TrailCameraRig, { SceneParallaxGroup } from "./TrailCameraRig";
import TrailEntryCinematic from "./TrailEntryCinematic";
import { CinematicBloomPulse } from "./TrailEntryAmbience";
import type { UniverseSceneState } from "./UniverseContext";
import { UniverseProvider, useUniverse } from "./UniverseContext";

function Scene() {
  const { timeOfDay } = useUniverse();
  const palette = useMemo(
    () => getRwWonderland(timeOfDay.current),
    [timeOfDay.current],
  );
  const night = timeOfDay.current === "night";
  const moonLight = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (!moonLight.current || !night) return;
    const t = clock.getElapsedTime();
    moonLight.current.intensity = 0.62 + Math.sin(t * 0.15) * 0.06;
  });

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, palette.fogNear, palette.fogFar]} />
      <ambientLight intensity={night ? 0.22 : 0.74} color={night ? "#2A2030" : "#FFF6F0"} />
      <hemisphereLight
        args={[
          night ? "#8A6888" : "#FFF8F5",
          night ? "#0A080C" : "#F5E0DC",
          night ? 0.38 : 0.62,
        ]}
        position={[0, 20, 0]}
      />
      <directionalLight
        position={[8, 14, 10]}
        intensity={night ? 0.42 : 1.22}
        color={night ? "#FFE8F0" : "#FFF5EE"}
        castShadow={false}
      />
      <directionalLight
        ref={moonLight}
        position={[9, 18, -22]}
        intensity={night ? 0.62 : 0}
        color="#F8E8F8"
        castShadow={false}
      />
      <directionalLight
        position={[-6, 8, -4]}
        intensity={night ? 0.28 : 0.45}
        color={night ? "#FFC8D8" : "#E8B4BC"}
      />
      <pointLight
        position={[0, 4, 8]}
        intensity={night ? 0.45 : 0.35}
        color={night ? palette.pathGlowBright : "#FFE8EE"}
        distance={32}
        decay={2}
      />

      <TrailCameraRig />
      <TrailEntryCinematic />
      <CinematicBloomPulse />
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
        camera={{ position: [0, 8.2, 24], fov: 48, near: 0.1, far: 80 }}
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
          gl.toneMappingExposure = sceneState.timeOfDay.current === "night" ? 1.42 : 1.1;
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
