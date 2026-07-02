import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYFRAMES } from "./universeConfig";
import { useUniverse } from "./UniverseContext";

function lerpKeyframes(progress: number) {
  const n = CAMERA_KEYFRAMES.length - 1;
  const scaled = progress * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const t = scaled - i;
  const a = CAMERA_KEYFRAMES[i];
  const b = CAMERA_KEYFRAMES[i + 1];

  const pos = new THREE.Vector3(
    a.position[0] + (b.position[0] - a.position[0]) * t,
    a.position[1] + (b.position[1] - a.position[1]) * t,
    a.position[2] + (b.position[2] - a.position[2]) * t,
  );
  const look = new THREE.Vector3(
    a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * t,
    a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * t,
    a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * t,
  );
  const activeNode = t < 0.5 ? a.activeNode ?? null : b.activeNode ?? null;
  const showCards =
    t < 0.5 ? Boolean(a.showProjectCards) : Boolean(b.showProjectCards);

  return { pos, look, activeNode, showCards };
}

export default function ScrollCameraRig() {
  const { camera } = useThree();
  const { scrollProgress, activeNode, showProjectCards, parallax } = useUniverse();
  const currentPos = useRef(new THREE.Vector3(0, 2.5, 9));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const sceneGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const { pos, look, activeNode: node, showCards } = lerpKeyframes(
      scrollProgress.current,
    );
    currentPos.current.lerp(pos, Math.min(1, delta * 3));
    currentLook.current.lerp(look, Math.min(1, delta * 3));

    const px = parallax.current.x * 0.35;
    const py = parallax.current.y * 0.2;
    camera.position.set(
      currentPos.current.x + px,
      currentPos.current.y + py,
      currentPos.current.z,
    );
    camera.lookAt(
      currentLook.current.x + px * 0.5,
      currentLook.current.y + py * 0.5,
      currentLook.current.z,
    );

    activeNode.current = node;
    showProjectCards.current = showCards;

    if (sceneGroup.current) {
      const tx = parallax.current.x * 0.15;
      const ty = parallax.current.y * 0.1;
      sceneGroup.current.rotation.y += (tx - sceneGroup.current.rotation.y) * delta * 0.5;
      sceneGroup.current.rotation.x += (ty * 0.3 - sceneGroup.current.rotation.x) * delta * 0.5;
    }
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

  useFrame((_, delta) => {
    if (!group.current) return;
    const tx = parallax.current.x * 0.12;
    const ty = parallax.current.y * 0.08;
    group.current.rotation.y += (tx - group.current.rotation.y) * Math.min(1, delta * 2);
    group.current.rotation.x += (ty - group.current.rotation.x) * Math.min(1, delta * 2);
  });

  return <group ref={group}>{children}</group>;
}
