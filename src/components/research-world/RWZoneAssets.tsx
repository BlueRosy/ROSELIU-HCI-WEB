import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { useNormalizedGltf } from "./RWGltfModel";
import RWMilestoneBase, { PLINTH_HEIGHT } from "./RWMilestoneBase";
import { LANDMARKS, PATH_POINTS } from "./rwWorldConfig";

const DRACO = "/draco/gltf/";

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
    <>
      <RWMilestoneBase
        position={lm.position}
        index="03"
        label="States"
        accent="#C4848F"
      />
      <GltfClone
        url={researchWorldAssets.designLandmarks.statesObservatory}
        position={[lm.position[0], PLINTH_HEIGHT, lm.position[2]]}
        targetHeight={3.8}
      />
    </>
  );
}

export function RWSignalsGardenBeds() {
  const lm = LANDMARKS.find((l) => l.id === "signals");
  if (!lm) return null;
  return (
    <>
      <RWMilestoneBase
        position={lm.position}
        index="02"
        label="Signals"
        accent="#8A9275"
      />
      <GltfClone
        url={researchWorldAssets.designLandmarks.signalsGarden}
        position={[lm.position[0], PLINTH_HEIGHT, lm.position[2]]}
        targetHeight={3.6}
      />
    </>
  );
}

export function RWSupportSanctuary() {
  const lm = LANDMARKS.find((l) => l.id === "support");
  if (!lm) return null;
  return (
    <>
      <RWMilestoneBase
        position={lm.position}
        index="04"
        label="Support"
        accent="#B9786F"
      />
      <GltfClone
        url={researchWorldAssets.designLandmarks.supportSanctuary}
        position={[lm.position[0], PLINTH_HEIGHT, lm.position[2]]}
        targetHeight={3.6}
      />
    </>
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
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
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

export function RWClosedLoopCoreGlb({ accent = false }: { accent?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const archive = useNormalizedGltf(
    researchWorldAssets.designLandmarks.closedLoop,
    accent ? 0.52 : 3.6,
  );

  useFrame((state) => {
    if (accent || !group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  if (accent) {
    return (
      <group position={[0, 0.04, 0]} scale={[1, 0.14, 1]}>
        <primitive object={archive.clone(true)} />
      </group>
    );
  }

  return (
    <group ref={group}>
      <primitive object={archive.clone(true)} />
    </group>
  );
}

useGLTF.preload(researchWorldAssets.designLandmarks.signalsGarden, DRACO);
useGLTF.preload(researchWorldAssets.designLandmarks.statesObservatory, DRACO);
useGLTF.preload(researchWorldAssets.designLandmarks.supportSanctuary, DRACO);
useGLTF.preload(researchWorldAssets.designLandmarks.closedLoop, DRACO);
useGLTF.preload(researchWorldAssets.pathStone);
