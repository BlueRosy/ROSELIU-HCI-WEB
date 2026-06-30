import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useHeroParallax } from "../hooks/useHeroParallax.tsx";
import HeroSkyScene from "../three/HeroSkyScene";

function useSkyEffectsEnabled(): boolean {
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

function starCountForDevice(): number {
  if (typeof navigator === "undefined") return 0;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores < 4) return 0;
  if (cores < 8) return 1100;
  return 1600;
}

function HeroSkyCanvasInner() {
  const parallax = useHeroParallax();
  const starCount = starCountForDevice();

  if (starCount === 0) return null;

  return (
    <Canvas
      className="hero-sky__canvas"
      camera={{ position: [0, 0, 11], fov: 55 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <HeroSkyScene parallax={parallax} starCount={starCount} />
      </Suspense>
    </Canvas>
  );
}

export default function HeroSkyCanvas() {
  const enabled = useSkyEffectsEnabled();

  if (!enabled) return null;

  return (
    <div className="hero-sky__canvas-wrap">
      <HeroSkyCanvasInner />
    </div>
  );
}
