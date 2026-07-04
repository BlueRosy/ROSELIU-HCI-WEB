import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import TrailModel from "./TrailModel";
import { TRAIL_CURVE } from "./worldTrailConfig";

type Placed = {
  position: [number, number, number];
  rotationY: number;
};

/** Gateway arches that straddle the path at a few points between zones. */
function archLayout(): Placed[] {
  return [0.15, 0.42, 0.74].map((t) => {
    const p = TRAIL_CURVE.getPointAt(t);
    const tan = TRAIL_CURVE.getTangentAt(t);
    return {
      position: [p.x, 0, p.z],
      rotationY: Math.atan2(tan.x, tan.z),
    };
  });
}

/** Benches set just off the path, angled back toward the trail. */
function benchLayout(): Placed[] {
  return [
    { t: 0.23, side: 1 },
    { t: 0.55, side: -1 },
    { t: 0.83, side: 1 },
  ].map(({ t, side }) => {
    const p = TRAIL_CURVE.getPointAt(t);
    const tan = TRAIL_CURVE.getTangentAt(t);
    const normal = new THREE.Vector3(-tan.z, 0, tan.x).multiplyScalar(side * 2.4);
    const x = p.x + normal.x;
    const z = p.z + normal.z;
    return {
      position: [x, 0, z] as [number, number, number],
      rotationY: Math.atan2(p.x - x, p.z - z),
    };
  });
}

const MEADOWS: [number, number, number][] = [
  [-9.5, 0, -3],
  [9.5, 0, -13],
  [-8, 0, -20.5],
];

export default function TrailDecor() {
  const arches = useMemo(archLayout, []);
  const benches = useMemo(benchLayout, []);

  return (
    <group>
      {arches.map((a, i) => (
        <TrailModel
          key={`arch-${i}`}
          url={researchWorldAssets.trellisArch}
          position={a.position}
          rotationY={a.rotationY}
          targetY={4.6}
        />
      ))}

      {benches.map((b, i) => (
        <TrailModel
          key={`bench-${i}`}
          url={researchWorldAssets.petalBench}
          position={b.position}
          rotationY={b.rotationY}
          targetY={1.0}
        />
      ))}

      <TrailModel
        url={researchWorldAssets.roseFountain}
        position={[5.8, 0, -5.5]}
        targetY={2.8}
      />

      {MEADOWS.map((pos, i) => (
        <TrailModel
          key={`meadow-${i}`}
          url={researchWorldAssets.wildflowerMeadow}
          position={pos}
          rotationY={i * 1.3}
          targetXZ={9}
        />
      ))}
    </group>
  );
}

useGLTF.preload(researchWorldAssets.trellisArch);
useGLTF.preload(researchWorldAssets.petalBench);
useGLTF.preload(researchWorldAssets.roseFountain);
useGLTF.preload(researchWorldAssets.wildflowerMeadow);
