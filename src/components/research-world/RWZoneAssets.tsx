import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { useNormalizedGltf } from "./RWGltfModel";
import { LANDMARKS, PATH_POINTS } from "./rwWorldConfig";

function GltfClone({
  url,
  position,
  rotation = [0, 0, 0],
  targetHeight = 2,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetHeight?: number;
}) {
  const model = useNormalizedGltf(url, targetHeight);
  return (
    <group position={position} rotation={rotation}>
      <primitive object={model.clone(true)} />
    </group>
  );
}

export function RWObservatoryPlatform() {
  const lm = LANDMARKS.find((l) => l.id === "states");
  if (!lm) return null;
  return (
    <GltfClone
      url={researchWorldAssets.observatoryPlatform}
      position={[lm.position[0], 0, lm.position[2] - 0.5]}
      targetHeight={2.8}
    />
  );
}

export function RWSignalsGardenBeds() {
  const lm = LANDMARKS.find((l) => l.id === "signals");
  if (!lm) return null;
  const offsets: [number, number, number][] = [
    [-1.8, 0, 1.2],
    [1.6, 0, 0.8],
    [-0.5, 0, 2],
    [1.2, 0, -1.5],
  ];
  return (
    <group position={lm.position}>
      {offsets.map((off, i) => (
        <GltfClone
          key={i}
          url={researchWorldAssets.signalsGardenBed}
          position={off}
          rotation={[0, i * 0.9, 0]}
          targetHeight={0.9}
        />
      ))}
    </group>
  );
}

export function RWSupportSanctuary() {
  const lm = LANDMARKS.find((l) => l.id === "support");
  if (!lm) return null;
  return (
    <GltfClone
      url={researchWorldAssets.supportSanctuary}
      position={[lm.position[0], 0, lm.position[2] - 0.3]}
      targetHeight={2.6}
    />
  );
}

export function RWPathStones() {
  const base = useNormalizedGltf(researchWorldAssets.pathStone, 0.25);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_POINTS.map((p) => new THREE.Vector3(...p))),
    [],
  );

  const stones = useMemo(() => {
    const items: { pos: THREE.Vector3; rot: number }[] = [];
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      items.push({
        pos,
        rot: Math.atan2(tangent.x, tangent.z),
      });
    }
    return items;
  }, [curve]);

  return (
    <group>
      {stones.map((stone, i) => (
        <group
          key={i}
          position={[stone.pos.x, 0.02, stone.pos.z]}
          rotation={[0, stone.rot, 0]}
        >
          <primitive object={base.clone(true)} />
        </group>
      ))}
    </group>
  );
}

export function RWClosedLoopCoreGlb() {
  const group = useRef<THREE.Group>(null);
  const ring = useNormalizedGltf(researchWorldAssets.closedLoopCore, 3.2);
  const relief = useNormalizedGltf(researchWorldAssets.loopRelief, 1.8);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={group}>
      <primitive object={ring.clone(true)} />
      <group position={[0, 0.2, 0]} scale={[0.85, 0.85, 0.85]}>
        <primitive object={relief.clone(true)} />
      </group>
    </group>
  );
}

useGLTF.preload(researchWorldAssets.observatoryPlatform);
useGLTF.preload(researchWorldAssets.signalsGardenBed);
useGLTF.preload(researchWorldAssets.supportSanctuary);
useGLTF.preload(researchWorldAssets.pathStone);
useGLTF.preload(researchWorldAssets.closedLoopCore);
useGLTF.preload(researchWorldAssets.loopRelief);
useGLTF.preload(researchWorldAssets.entryPavilion);
useGLTF.preload(researchWorldAssets.signalNodeIcon);
