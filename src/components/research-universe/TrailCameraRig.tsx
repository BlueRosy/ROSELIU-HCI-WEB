import { useRef } from "react";
import type * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { sampleTrailCamera } from "./worldTrailConfig";
import { useUniverse } from "./UniverseContext";

export default function TrailCameraRig() {
  const { camera } = useThree();
  const { scrollProgress, activeZone, showProjectCards } = useUniverse();

  useFrame(() => {
    const sample = sampleTrailCamera(scrollProgress.current);
    camera.position.copy(sample.position);
    camera.lookAt(sample.lookAt);
    activeZone.current = sample.activeZone;
    showProjectCards.current = sample.showProjects;
  });

  return null;
}

export function SceneParallaxGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { parallax } = useUniverse();
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;
    const rate = Math.min(1, delta * 2.5);
    smooth.current.x += (parallax.current.x - smooth.current.x) * rate;
    smooth.current.y += (parallax.current.y - smooth.current.y) * rate;
    group.current.rotation.y = smooth.current.x * 0.025;
    group.current.rotation.x = -smooth.current.y * 0.015;
  });

  return <group ref={group}>{children}</group>;
}
