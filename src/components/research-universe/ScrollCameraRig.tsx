import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYFRAMES } from "./universeConfig";
import { useUniverse } from "./UniverseContext";

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

function sampleKeyframes(progress: number) {
  const n = CAMERA_KEYFRAMES.length - 1;
  const scaled = progress * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const t = scaled - i;
  const a = CAMERA_KEYFRAMES[i];
  const b = CAMERA_KEYFRAMES[i + 1];

  _pos.set(
    a.position[0] + (b.position[0] - a.position[0]) * t,
    a.position[1] + (b.position[1] - a.position[1]) * t,
    a.position[2] + (b.position[2] - a.position[2]) * t,
  );
  _look.set(
    a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * t,
    a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * t,
    a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * t,
  );
  const activeNode = t < 0.5 ? a.activeNode ?? null : b.activeNode ?? null;
  const showCards =
    t < 0.5 ? Boolean(a.showProjectCards) : Boolean(b.showProjectCards);

  return { activeNode, showCards };
}

export default function ScrollCameraRig() {
  const { camera } = useThree();
  const { scrollProgress, activeNode, showProjectCards } = useUniverse();

  useFrame(() => {
    const { activeNode: node, showCards } = sampleKeyframes(scrollProgress.current);

    // GSAP scrub already smooths scroll — apply camera directly to avoid double-lerp jitter
    camera.position.copy(_pos);
    camera.lookAt(_look);

    activeNode.current = node;
    showProjectCards.current = showCards;
  });

  return null;
}

export function SceneParallaxGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const { parallax } = useUniverse();
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;
    const rate = Math.min(1, delta * 3);
    smooth.current.x += (parallax.current.x - smooth.current.x) * rate;
    smooth.current.y += (parallax.current.y - smooth.current.y) * rate;

    const targetY = smooth.current.x * 0.06;
    const targetX = -smooth.current.y * 0.04;
    group.current.rotation.y += (targetY - group.current.rotation.y) * rate;
    group.current.rotation.x += (targetX - group.current.rotation.x) * rate;
  });

  return <group ref={group}>{children}</group>;
}
