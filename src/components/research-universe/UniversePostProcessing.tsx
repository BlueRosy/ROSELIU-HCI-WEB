import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

export default function UniversePostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.85}
        intensity={0.65}
        mipmapBlur
      />
      <Vignette eskil offset={0.08} darkness={0.28} />
    </EffectComposer>
  );
}
