import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWEntryPavilion from "./RWEntryPavilion";
import RWExplorerSilhouette from "./RWExplorerSilhouette";
import RWLoopCenter from "./RWLoopCenter";
import RWPathNodes from "./RWPathNodes";
import RWTreePanels from "./RWTreePanels";
import RWZonePlazas from "./RWZonePlazas";
import {
  RWObservatoryPlatform,
  RWPathStones,
  RWSignalsGardenBeds,
  RWSupportSanctuary,
} from "./RWZoneAssets";
import {
  findNearestLandmark,
  findNearestPathNode,
  LANDMARKS,
  PATH_POINTS,
  type KeyState,
  type PathNode,
} from "./rwWorldConfig";

const GROUND_SIZE = 40;
const GROUND_CENTER_Z = -9;

function WonderlandGround() {
  const landTex = useTexture(researchWorldAssets.land);
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(GROUND_SIZE, 20, rwWonderland.grid, rwWonderland.grid);
    const mat = g.material as THREE.Material;
    mat.transparent = true;
    mat.opacity = rwWonderland.gridOpacity * 0.7;
    return g;
  }, []);

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
        <meshPhysicalMaterial
          color={rwWonderland.ground}
          roughness={0.35}
          metalness={0.08}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, GROUND_CENTER_Z]}>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshBasicMaterial map={landTex} transparent opacity={rwWonderland.groundOverlayOpacity} />
      </mesh>
      <primitive object={grid} position={[0, 0.01, GROUND_CENTER_Z]} />
    </group>
  );
}

function PathRibbon() {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_POINTS.map((p) => new THREE.Vector3(...p))),
    [],
  );
  const geometry = useMemo(() => {
    const points = curve.getSpacedPoints(64);
    const positions: number[] = [];
    const indices: number[] = [];
    const width = 0.65;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tangent =
        i < points.length - 1
          ? new THREE.Vector3().subVectors(points[i + 1], p).normalize()
          : new THREE.Vector3().subVectors(p, points[i - 1]).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2);
      const left = p.clone().add(side);
      const right = p.clone().sub(side);
      positions.push(left.x, 0.07, left.z, right.x, 0.07, right.z);
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
  }, [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={rwWonderland.pathRibbon}
        emissive={rwWonderland.pathGlow}
        emissiveIntensity={0.45}
        roughness={0.35}
        metalness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function PathParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 64;
  const positions = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      PATH_POINTS.map((p) => new THREE.Vector3(...p)),
    );
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const p = curve.getPointAt(t);
      arr[i * 3] = p.x + (Math.random() - 0.5) * 0.25;
      arr[i * 3 + 1] = 0.2 + Math.random() * 0.35;
      arr[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.25;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = 0.2 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.4) * 0.08;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={rwWonderland.pathGlowBright}
        size={0.07}
        transparent
        opacity={0.65}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
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
            position={[0, 2, 0]}
            intensity={0.85}
            color={rwWonderland.pathGlow}
            distance={9}
          />
        </group>
      ))}
    </group>
  );
}

function VinePath() {
  const { scene } = useGLTF(researchWorldAssets.vine);
  const base = useMemo(() => scene.clone(true), [scene]);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_POINTS.map((p) => new THREE.Vector3(...p))),
    [],
  );

  const vines = useMemo(() => {
    const items: { pos: THREE.Vector3; rot: number; scale: number }[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      items.push({
        pos,
        rot: Math.atan2(tangent.x, tangent.z),
        scale: 0.48 + (i % 2) * 0.05,
      });
    }
    return items;
  }, [curve]);

  return (
    <group>
      {vines.map((vine, i) => (
        <group
          key={i}
          position={[vine.pos.x, 0.35, vine.pos.z]}
          rotation={[0, vine.rot + Math.PI / 2, 0]}
          scale={vine.scale}
        >
          <primitive object={base.clone(true)} />
        </group>
      ))}
    </group>
  );
}

function CameraRig({ playerPosRef }: { playerPosRef: React.MutableRefObject<THREE.Vector3> }) {
  useFrame(({ camera }) => {
    const p = playerPosRef.current;
    const desired = new THREE.Vector3(p.x * 0.2, p.y + 4.2, p.z + 6.5);
    camera.position.lerp(desired, 0.07);
    camera.lookAt(p.x, p.y + 1.2, p.z - 3);
  });
  return null;
}

function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function RWWorldScene({
  keysRef,
  playerPosRef,
  onNearZoneChange,
  onNearNodeChange,
  activeZoneId,
  nearZoneId,
  nearNodeId,
  onMovingChange,
  teleportTargetRef,
  pathNodesRef,
  onSceneReady,
}: {
  keysRef: React.MutableRefObject<KeyState>;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  onNearZoneChange: (zoneId: string | null) => void;
  onNearNodeChange: (nodeId: string | null) => void;
  activeZoneId: string | null;
  nearZoneId: string | null;
  nearNodeId: string | null;
  onMovingChange: (moving: boolean) => void;
  teleportTargetRef: React.MutableRefObject<THREE.Vector3 | null>;
  pathNodesRef: React.MutableRefObject<PathNode[]>;
  onSceneReady?: () => void;
}) {
  const lastNear = useRef<string | null>(null);
  const lastNearNode = useRef<string | null>(null);

  useFrame(() => {
    const p = playerPosRef.current;
    const near = findNearestLandmark(p.x, p.z);
    const zoneId = near?.landmark.zoneId ?? null;
    if (zoneId !== lastNear.current) {
      lastNear.current = zoneId;
      onNearZoneChange(zoneId);
    }

    const nearNode = findNearestPathNode(pathNodesRef.current, p.x, p.z);
    const nodeId = nearNode?.id ?? null;
    if (nodeId !== lastNearNode.current) {
      lastNearNode.current = nodeId;
      onNearNodeChange(nodeId);
    }
  });

  return (
    <>
      <SceneReady onReady={onSceneReady} />
      <color attach="background" args={[rwWonderland.background]} />
      <fog attach="fog" args={[rwWonderland.fog, rwWonderland.fogNear, rwWonderland.fogFar]} />
      <ambientLight intensity={0.68} />
      <directionalLight position={[8, 16, 6]} intensity={1.15} color="#FFF8F0" castShadow />
      <directionalLight position={[-10, 8, -8]} intensity={0.38} color={rwWonderland.rim} />
      <hemisphereLight args={["#FFF8F0", "#E8DDD4", 0.58]} />
      <WonderlandGround />
      <RWZonePlazas />
      <PathRibbon />
      <PathParticles />
      <RWEntryPavilion />
      <MilestoneTrees />
      <RWObservatoryPlatform />
      <RWSignalsGardenBeds />
      <RWSupportSanctuary />
      <RWPathStones />
      <RWLoopCenter />
      <VinePath />
      <RWPathNodes
        nearNodeId={nearNodeId}
        playerPosRef={playerPosRef}
        nodesRef={pathNodesRef}
      />
      <RWTreePanels
        activeZoneId={activeZoneId}
        nearZoneId={nearZoneId}
        playerPosRef={playerPosRef}
      />
      <RWExplorerSilhouette
        keysRef={keysRef}
        playerPosRef={playerPosRef}
        onMovingChange={onMovingChange}
        teleportTargetRef={teleportTargetRef}
      />
      <CameraRig playerPosRef={playerPosRef} />
    </>
  );
}

useGLTF.preload(researchWorldAssets.tree);
useGLTF.preload(researchWorldAssets.vine);
useGLTF.preload(researchWorldAssets.explorerCloak);
useGLTF.preload(researchWorldAssets.entryPavilion);
useGLTF.preload(researchWorldAssets.observatoryPlatform);
useGLTF.preload(researchWorldAssets.signalsGardenBed);
useGLTF.preload(researchWorldAssets.supportSanctuary);
useGLTF.preload(researchWorldAssets.pathStone);
useGLTF.preload(researchWorldAssets.closedLoopCore);
useGLTF.preload(researchWorldAssets.loopRelief);
useGLTF.preload(researchWorldAssets.signalNodeIcon);
