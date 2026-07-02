import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../theme/palette";
import FloatingProjectCards from "./FloatingProjectCards";
import ParticleStream from "./ParticleStream";
import ResearchLoop from "./ResearchLoop";
import ResearchNodes from "./ResearchNodes";
import ScrollCameraRig, { SceneParallaxGroup } from "./ScrollCameraRig";
import type { UniverseSceneState } from "./UniverseContext";
import { UniverseProvider } from "./UniverseContext";

function Scene() {
  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 8, 22]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} color="#FFF8F0" />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color={palette.sage} />
      <pointLight position={[0, 3, 2]} intensity={0.5} color={palette.roseSoft} />
      <ScrollCameraRig />
      <SceneParallaxGroup>
        <ResearchLoop />
        <ParticleStream />
        <ResearchNodes />
        <FloatingProjectCards />
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
        camera={{ position: [0, 2.5, 9], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        style={{ pointerEvents: "none" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </UniverseProvider>
  );
}
