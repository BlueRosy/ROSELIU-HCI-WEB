import { Suspense, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWEntryPavilion from "../research-world/RWEntryPavilion";
import RWLoopCenter from "../research-world/RWLoopCenter";
import RWZonePlazas from "../research-world/RWZonePlazas";
import {
  RWObservatoryPlatform,
  RWPathStones,
  RWSignalsGardenBeds,
  RWSupportSanctuary,
} from "../research-world/RWZoneAssets";
import { LANDMARKS } from "../research-world/rwWorldConfig";
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

function MilestoneTrees() {
  const { scene } = useGLTF(researchWorldAssets.tree);
  const base = useMemo(() => scene.clone(true), [scene]);

  return (
    <group>
      {LANDMARKS.filter((lm) => lm.id !== "loop").map((lm) => (
        <group key={lm.id} position={lm.position}>
          <primitive object={base.clone(true)} scale={lm.treeScale} />
          <pointLight
            position={[0, 2.5, 0]}
            intensity={0.7}
            color={rwWonderland.pathGlow}
            distance={10}
          />
        </group>
      ))}
    </group>
  );
}

function TrailVines() {
  const { scene } = useGLTF(researchWorldAssets.vine);
  const vine = useMemo(() => scene.clone(true), [scene]);
  const placements = useMemo(() => {
    const pts = TRAIL_CURVE.getSpacedPoints(6);
    return pts.slice(1, -1).map((p, i) => ({
      position: [p.x + (i % 2 ? 0.8 : -0.8), 0, p.z] as [number, number, number],
      rot: [0, i * 0.9, 0] as [number, number, number],
      scale: 0.55 + (i % 3) * 0.1,
    }));
  }, []);

  return (
    <group>
      {placements.map((pl, i) => (
        <group key={i} position={pl.position} rotation={pl.rot}>
          <primitive object={vine.clone(true)} scale={pl.scale} />
        </group>
      ))}
    </group>
  );
}

function WarmSky() {
  return (
    <mesh position={[0, 0, GROUND_CENTER_Z]} scale={[-1, 1, 1]}>
      <sphereGeometry args={[55, 32, 32]} />
      <meshBasicMaterial color={rwWonderland.fog} side={THREE.BackSide} />
    </mesh>
  );
}

export default function ResearchWorldTrailScene() {
  return (
    <Suspense fallback={null}>
      <WarmSky />
      <TrailGround />
      <TrailPath />
      <TrailVines />
      <MilestoneTrees />
      <RWZonePlazas />
      <RWEntryPavilion />
      <RWSignalsGardenBeds />
      <RWObservatoryPlatform />
      <RWSupportSanctuary />
      <RWPathStones />
      <RWLoopCenter />
    </Suspense>
  );
}

useGLTF.preload(researchWorldAssets.tree);
useGLTF.preload(researchWorldAssets.vine);
useGLTF.preload(researchWorldAssets.entryPavilion);
useGLTF.preload(researchWorldAssets.signalsGardenBed);
useGLTF.preload(researchWorldAssets.observatoryPlatform);
useGLTF.preload(researchWorldAssets.supportSanctuary);
useGLTF.preload(researchWorldAssets.pathStone);
useGLTF.preload(researchWorldAssets.closedLoopCore);
