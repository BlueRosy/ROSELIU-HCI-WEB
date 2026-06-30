import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useHeroParallax } from "../hooks/useHeroParallax.tsx";
import PetalField from "../three/PetalField";

function usePetalEffectsEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return enabled;
}

function HeroBotanicalCanvasInner() {
  const parallax = useHeroParallax();

  return (
    <Canvas
      className="hero-botanical__canvas"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <PetalField parallax={parallax} />
      </Suspense>
    </Canvas>
  );
}

export default function HeroBotanicalCanvas() {
  const enabled = usePetalEffectsEnabled();

  if (!enabled) return null;

  return (
    <div className="hero-botanical__canvas-wrap">
      <HeroBotanicalCanvasInner />
    </div>
  );
}
