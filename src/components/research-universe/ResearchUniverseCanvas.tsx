import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "../../theme/palette";
import AmbientDust from "./AmbientDust";
import FloatingProjectCards from "./FloatingProjectCards";
import ParticleStream from "./ParticleStream";
import ResearchLoop from "./ResearchLoop";
import ResearchNodes from "./ResearchNodes";
import ScrollCameraRig, { SceneParallaxGroup } from "./ScrollCameraRig";
import UniverseBackdrop from "./UniverseBackdrop";
import UniversePostProcessing from "./UniversePostProcessing";
import type { UniverseSceneState } from "./UniverseContext";
import { UniverseProvider } from "./UniverseContext";

function Scene() {
  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={["#F5EBE0", 12, 28]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 8]} intensity={1.4} color="#FFF5EE" />
      <directionalLight position={[-5, 4, -4]} intensity={0.5} color={palette.sage} />
      <pointLight position={[0, 4, 3]} intensity={0.8} color={palette.roseSoft} distance={20} />
      <pointLight position={[-3, -2, 2]} intensity={0.35} color={palette.sage} distance={15} />

      <Suspense fallback={null}>
        <Environment preset="dawn" environmentIntensity={0.45} />
      </Suspense>

      <UniverseBackdrop />
      <AmbientDust />
      <ScrollCameraRig />

      <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.12}>
        <SceneParallaxGroup>
          <ResearchLoop />
          <ParticleStream />
          <ResearchNodes />
          <FloatingProjectCards />
        </SceneParallaxGroup>
      </Float>

      <UniversePostProcessing />
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
        camera={{ position: [0, 1.2, 10], fov: 42, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </UniverseProvider>
  );
}
