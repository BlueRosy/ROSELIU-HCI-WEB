import { Suspense, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWEntryPavilion from "../research-world/RWEntryPavilion";
import RWLoopCenter from "../research-world/RWLoopCenter";
import {
  RWObservatoryPlatform,
  RWPathStones,
  RWSignalsGardenBeds,
  RWSupportSanctuary,
} from "../research-world/RWZoneAssets";
import TrailGroundScatter from "./TrailGroundScatter";
import TrailPetalField from "./TrailPetalField";
import TrailTwilightSky from "./TrailTwilightSky";
import { TRAIL_CURVE } from "./worldTrailConfig";

const GROUND_SIZE = 40;
const GROUND_CENTER_Z = -9;

function TrailGround() {
  const landTex = useTexture(researchWorldAssets.land);
  landTex.wrapS = landTex.wrapT = THREE.RepeatWrapping;
  landTex.repeat.set(5, 5);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, GROUND_CENTER_Z]}
        receiveShadow
      >
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, GROUND_CENTER_Z]}>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshBasicMaterial map={landTex} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function TrailPath() {
  const geometry = useMemo(() => {
    const points = TRAIL_CURVE.getSpacedPoints(80);
    const positions: number[] = [];
    const indices: number[] = [];
    const width = 0.7;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tangent =
        i < points.length - 1
          ? new THREE.Vector3().subVectors(points[i + 1], p).normalize()
          : new THREE.Vector3().subVectors(p, points[i - 1]).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2);
      const left = p.clone().add(side);
      const right = p.clone().sub(side);
      positions.push(left.x, 0.06, left.z, right.x, 0.06, right.z);
      if (i < points.length - 1) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={rwWonderland.pathRibbon}
        emissive={rwWonderland.pathGlow}
        emissiveIntensity={0.35}
        roughness={0.4}
      />
    </mesh>
  );
}

export default function ResearchWorldTrailScene() {
  return (
    <Suspense fallback={null}>
      <TrailTwilightSky />
      <TrailGround />
      <TrailGroundScatter />
      <TrailPath />
      <TrailPetalField />
      <RWEntryPavilion />
      <RWSignalsGardenBeds />
      <RWObservatoryPlatform />
      <RWSupportSanctuary />
      <RWPathStones />
      <RWLoopCenter trailMode />
    </Suspense>
  );
}

useGLTF.preload(researchWorldAssets.gardenDoor);
useGLTF.preload(researchWorldAssets.scholarGazebo);
useGLTF.preload(researchWorldAssets.signalBeaconOrb);
useGLTF.preload(researchWorldAssets.signalsGardenBed);
useGLTF.preload(researchWorldAssets.observatoryPlatform);
useGLTF.preload(researchWorldAssets.supportSanctuary);
useGLTF.preload(researchWorldAssets.pathStone);
useGLTF.preload(researchWorldAssets.thesisArchive);
