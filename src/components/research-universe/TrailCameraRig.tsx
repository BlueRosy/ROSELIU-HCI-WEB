import { useRef } from "react";
import type * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { sampleEntryCinematicCamera } from "./entryCinematic";
import { sampleTrailCamera } from "./worldTrailConfig";
import { useUniverse } from "./UniverseContext";

const BASE_FOV = 48;
const THROUGH_FOV = 44;

const _offset = { x: 0, y: 0, z: 0 };
const _lookOffset = { x: 0, y: 0, z: 0 };

export default function TrailCameraRig() {
  const { camera } = useThree();
  const {
    scrollProgress,
    activeZone,
    showProjectCards,
    reducedMotion,
    entryCinematicActive,
    entryCinematicDone,
    entryCinematicElapsed,
    invalidate,
  } = useUniverse();

  const fovRestored = useRef(false);

  useFrame(({ clock }) => {
    if (!entryCinematicDone.current) {
      const sample = sampleEntryCinematicCamera(
        entryCinematicActive.current ? entryCinematicElapsed.current : 0,
        reducedMotion.current,
      );
      camera.position.copy(sample.position);
      camera.lookAt(sample.lookAt);
      if ("fov" in camera) {
        const persp = camera as THREE.PerspectiveCamera;
        persp.fov = BASE_FOV - (BASE_FOV - THROUGH_FOV) * sample.fovT;
        persp.updateProjectionMatrix();
      }
      fovRestored.current = false;
      activeZone.current = "entry";
      showProjectCards.current = false;
      invalidate.current();
      return;
    }

    if ("fov" in camera && !fovRestored.current) {
      const persp = camera as THREE.PerspectiveCamera;
      persp.fov = BASE_FOV;
      persp.updateProjectionMatrix();
      fovRestored.current = true;
    }

    const sample = sampleTrailCamera(scrollProgress.current);
    let px = sample.position.x;
    let py = sample.position.y;
    let pz = sample.position.z;
    let lx = sample.lookAt.x;
    let ly = sample.lookAt.y;
    let lz = sample.lookAt.z;

    if (scrollProgress.current < 0.1 && !reducedMotion.current) {
      const t = clock.getElapsedTime();
      _offset.y = Math.sin(t * 0.28) * 0.12;
      _offset.z = Math.sin(t * 0.22 + 1.2) * 0.18;
      _lookOffset.y = Math.sin(t * 0.24 + 0.6) * 0.06;
      px += _offset.x;
      py += _offset.y;
      pz += _offset.z;
      ly += _lookOffset.y;
    }

    camera.position.set(px, py, pz);
    camera.lookAt(lx, ly, lz);
    activeZone.current = sample.activeZone;
    showProjectCards.current = sample.showProjects;
  });

  return null;
}

export function SceneParallaxGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { parallax, entryCinematicActive, entryCinematicDone } = useUniverse();
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;
    if (entryCinematicActive.current && !entryCinematicDone.current) return;
    const rate = Math.min(1, delta * 2.5);
    smooth.current.x += (parallax.current.x - smooth.current.x) * rate;
    smooth.current.y += (parallax.current.y - smooth.current.y) * rate;
    group.current.rotation.y = smooth.current.x * 0.025;
    group.current.rotation.x = -smooth.current.y * 0.015;
  });

  return <group ref={group}>{children}</group>;
}
