import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWExplorerSilhouette from "./RWExplorerSilhouette";
import RWPathNodes from "./RWPathNodes";
import RWTreePanels from "./RWTreePanels";
import {
  findNearestLandmark,
  findNearestPathNode,
  LANDMARKS,
  PATH_POINTS,
  type KeyState,
  type PathNode,
} from "./rwWorldConfig";

function WonderlandGround() {
  const landTex = useTexture(researchWorldAssets.land);
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(70, 35, rwWonderland.grid, rwWonderland.grid);
    const mat = g.material as THREE.Material;
    mat.transparent = true;
    mat.opacity = rwWonderland.gridOpacity;
    return g;
  }, []);

  landTex.wrapS = landTex.wrapT = THREE.RepeatWrapping;
  landTex.repeat.set(8, 8);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -12]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshPhysicalMaterial
          color={rwWonderland.ground}
          roughness={0.35}
          metalness={0.08}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -12]}>
        <planeGeometry args={[70, 70]} />
        <meshBasicMaterial map={landTex} transparent opacity={rwWonderland.groundOverlayOpacity} />
      </mesh>
      <primitive object={grid} position={[0, 0.01, -12]} />
    </group>
  );
}

function PathRibbon() {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_POINTS.map((p) => new THREE.Vector3(...p))),
    [],
  );
  const geometry = useMemo(() => {
    const points = curve.getSpacedPoints(80);
    const positions: number[] = [];
    const indices: number[] = [];
    const width = 0.55;
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
  }, [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={rwWonderland.pathRibbon}
        emissive={rwWonderland.pathGlow}
        emissiveIntensity={0.35}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function PathParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 80;
  const positions = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      PATH_POINTS.map((p) => new THREE.Vector3(...p)),
    );
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const p = curve.getPointAt(t);
      arr[i * 3] = p.x + (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 1] = 0.25 + Math.random() * 0.4;
      arr[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = 0.25 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.4) * 0.08;
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
        size={0.06}
        transparent
        opacity={0.6}
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
            intensity={0.8}
            color={rwWonderland.pathGlow}
            distance={10}
          />
        </group>
      ))}
    </group>
  );
}

function LoopRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) ring.current.rotation.z = state.clock.elapsedTime * 0.12;
  });
  const lm = LANDMARKS.find((l) => l.id === "loop");
  if (!lm) return null;
  return (
    <group position={lm.position}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <torusGeometry args={[2.2, 0.04, 16, 64]} />
        <meshBasicMaterial color={rwWonderland.pathGlowBright} transparent opacity={0.7} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={0.6} color={rwWonderland.pathGlow} distance={12} />
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
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      items.push({
        pos,
        rot: Math.atan2(tangent.x, tangent.z),
        scale: 0.5 + (i % 2) * 0.06,
      });
    }
    return items;
  }, [curve]);

  return (
    <group>
      {vines.map((vine, i) => (
        <group
          key={i}
          position={[vine.pos.x, 0.4, vine.pos.z]}
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
    const desired = new THREE.Vector3(p.x * 0.25, p.y + 4.5, p.z + 7.5);
    camera.position.lerp(desired, 0.06);
    camera.lookAt(p.x, p.y + 1.4, p.z - 2);
  });
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
      <color attach="background" args={[rwWonderland.background]} />
      <fog attach="fog" args={[rwWonderland.fog, rwWonderland.fogNear, rwWonderland.fogFar]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[8, 16, 6]} intensity={1.1} color="#FFF8F0" castShadow />
      <directionalLight position={[-10, 8, -8]} intensity={0.35} color={rwWonderland.rim} />
      <hemisphereLight args={["#FFF8F0", "#E8DDD4", 0.55]} />
      <WonderlandGround />
      <PathRibbon />
      <PathParticles />
      <MilestoneTrees />
      <LoopRing />
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
