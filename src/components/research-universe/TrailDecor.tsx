import { useGLTF } from "@react-three/drei";
import { researchWorldAssets } from "../../content/site";
import TrailModel from "./TrailModel";

/** Wildflower meadows kept far off to the sides so the trail + landmarks stay
 * legible. No arches over the path, no roadside benches — those crowded the
 * walkway and buried the landmarks. */
const MEADOWS: [number, number, number][] = [
  [-11.5, 0, -4],
  [11.5, 0, -14],
  [-9.5, 0, -21],
];

export default function TrailDecor() {
  return (
    <group>
      <TrailModel
        url={researchWorldAssets.roseFountain}
        position={[7.5, 0, -6]}
        targetY={2.6}
      />

      {MEADOWS.map((pos, i) => (
        <TrailModel
          key={`meadow-${i}`}
          url={researchWorldAssets.wildflowerMeadow}
          position={pos}
          rotationY={i * 1.3}
          targetXZ={4.2}
        />
      ))}
    </group>
  );
}

useGLTF.preload(researchWorldAssets.roseFountain);
useGLTF.preload(researchWorldAssets.wildflowerMeadow);
