import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { heroPetalPalette } from "../../theme/palette";
import {
  buildCGardenBoundary,
  buildEntryAccents,
  buildLandmarkIslands,
  buildNarrativePaths,
  samplePathEdgePoints,
  type RoseCluster,
} from "./trailGardenLayout";

const petalShape = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

type GroundPetal = {
  position: [number, number, number];
  scale: number;
  rot: number;
  phase: number;
  color: string;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function buildScatterLayout() {
  const cGarden = buildCGardenBoundary();
  const islands = buildLandmarkIslands(cGarden.nextSeed);
  const entryTrees = buildEntryAccents();
  const paths = buildNarrativePaths();

  const pathEdgeClusters: RoseCluster[] = [];
  let seed = islands.nextSeed;
  for (const path of paths) {
    if (path.kind === "loopRing") continue;
    for (const pt of samplePathEdgePoints(path, 0.85, 0.75, seed++)) {
      pathEdgeClusters.push({
        position: pt,
        scale: 0.24 + seededRandom(seed++ * 2.1) * 0.12,
      });
    }
  }

  const petals: GroundPetal[] = [];
  for (let i = 0; i < 40; i++) {
    const a = seededRandom(i * 7.3) * Math.PI * 2;
    const r = 8 + seededRandom(i * 5.5) * 6;
    petals.push({
      position: [
        Math.sin(a) * r,
        0.04 + seededRandom(i * 2.8) * 0.06,
        -10 + Math.cos(a) * r,
      ],
      scale: 0.14 + seededRandom(i * 3.1) * 0.1,
      rot: seededRandom(i * 8.2) * Math.PI * 2,
      phase: seededRandom(i * 1.4) * Math.PI * 2,
      color: heroPetalPalette[i % heroPetalPalette.length],
    });
  }

  const fireflyPositions = new Float32Array(32 * 3);
  for (let i = 0; i < 32; i++) {
    const a = seededRandom(i * 11.1) * Math.PI * 2;
    const r = 10 + seededRandom(i * 9.3) * 8;
    fireflyPositions[i * 3] = Math.sin(a) * r;
    fireflyPositions[i * 3 + 1] = 0.35 + seededRandom(i * 4.1) * 1.2;
    fireflyPositions[i * 3 + 2] = -10 + Math.cos(a) * r;
  }

  return {
    trees: [...entryTrees, ...cGarden.trees],
    vines: [...cGarden.vines, ...islands.vines],
    roseClusters: [...cGarden.roseClusters, ...islands.roseClusters, ...pathEdgeClusters],
    petals,
    fireflyPositions,
  };
}

function ScatterPetal({ spec }: { spec: GroundPetal }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = spec.rot + Math.sin(t * 0.2 + spec.phase) * 0.1;
    ref.current.position.y = spec.position[1] + Math.sin(t * 0.35 + spec.phase) * 0.02;
  });

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      <primitive object={petalShape} attach="geometry" />
      <meshBasicMaterial
        color={spec.color}
        transparent
        opacity={0.38}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function RoseBush({ position, scale }: RoseCluster) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.28, 8, 6]} />
        <meshStandardMaterial color="#8A9275" roughness={0.75} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.16, 0.22, Math.sin(a) * 0.16]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial
              color="#E8A0BC"
              emissive="#D4A59E"
              emissiveIntensity={0.2}
              roughness={0.55}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Fireflies({ positions }: { positions: Float32Array }) {
  const count = positions.length / 3;
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const basePositions = useMemo(() => positions.slice(), [positions]);
  const baseY = useMemo(() => {
    const y = new Float32Array(count);
    for (let i = 0; i < count; i++) y[i] = basePositions[i * 3 + 1];
    return y;
  }, [basePositions, count]);

  useFrame(({ clock }) => {
    if (!mat.current || !points.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.45 + Math.sin(t * 1.4) * 0.2;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = baseY[i] + Math.sin(t * 0.9 + i * 1.7) * 0.15;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[basePositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#D4E8A0"
        size={0.12}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function TrailGroundScatter() {
  const layout = useMemo(() => buildScatterLayout(), []);
  const { scene: treeScene } = useGLTF(researchWorldAssets.tree);
  const { scene: vineScene } = useGLTF(researchWorldAssets.vine);

  const treeInstances = useMemo(
    () => layout.trees.map((t) => ({ ...t, obj: treeScene.clone(true) })),
    [layout.trees, treeScene],
  );

  const vineInstances = useMemo(
    () => layout.vines.map((v) => ({ ...v, obj: vineScene.clone(true) })),
    [layout.vines, vineScene],
  );

  return (
    <group>
      {treeInstances.map((t, i) => (
        <group key={`tree-${i}`} position={t.position} rotation={[0, t.rot, 0]}>
          <primitive object={t.obj} scale={t.scale} />
        </group>
      ))}
      {vineInstances.map((v, i) => (
        <group key={`vine-${i}`} position={v.position} rotation={v.rot}>
          <primitive object={v.obj} scale={v.scale} />
        </group>
      ))}
      {layout.petals.map((p, i) => (
        <ScatterPetal key={`petal-${i}`} spec={p} />
      ))}
      {layout.roseClusters.map((r, i) => (
        <RoseBush key={`rose-${i}`} {...r} />
      ))}
      <Fireflies positions={layout.fireflyPositions} />
    </group>
  );
}

useGLTF.preload(researchWorldAssets.tree);
useGLTF.preload(researchWorldAssets.vine);
