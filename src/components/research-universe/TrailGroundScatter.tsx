import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { heroPetalPalette } from "../../theme/palette";
import { rwWonderland } from "../../theme/rwWonderland";
import { LANDMARKS } from "../research-world/rwWorldConfig";
import { TRAIL_CURVE } from "./worldTrailConfig";

const petalShape = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

const LANDMARK_EXCLUSION = 5.5;

type ScatterTree = {
  position: [number, number, number];
  scale: number;
  rot: number;
};

type ScatterVine = {
  position: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

type GroundPetal = {
  position: [number, number, number];
  scale: number;
  rot: number;
  phase: number;
  color: string;
};

type RoseCluster = {
  position: [number, number, number];
  scale: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function nearLandmark(x: number, z: number): boolean {
  for (const lm of LANDMARKS) {
    const dx = x - lm.position[0];
    const dz = z - lm.position[2];
    if (Math.sqrt(dx * dx + dz * dz) < LANDMARK_EXCLUSION) return true;
  }
  if (Math.sqrt(x * x + (z - 3.2) ** 2) < 4) return true;
  return false;
}

function buildScatterLayout() {
  const trees: ScatterTree[] = [];
  let seed = 0;
  while (trees.length < 22 && seed < 80) {
    seed++;
    const side = seed % 2 === 0 ? 1 : -1;
    const t = 0.04 + seededRandom(seed * 3.7) * 0.92;
    const pt = TRAIL_CURVE.getPointAt(t);
    const tangent = TRAIL_CURVE.getTangentAt(t);
    const dist = 2.8 + seededRandom(seed * 5.1) * 4.5;
    const off = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(side * dist);
    const x = pt.x + off.x;
    const z = pt.z + off.z;
    if (nearLandmark(x, z)) continue;
    trees.push({
      position: [x, 0, z],
      scale: 0.35 + seededRandom(seed * 2.3) * 0.45,
      rot: seededRandom(seed * 1.9) * Math.PI * 2,
    });
  }

  const vines: ScatterVine[] = [];
  for (let i = 0; i < 14; i++) {
    const t = 0.06 + (i / 14) * 0.88;
    const pt = TRAIL_CURVE.getPointAt(t);
    const side = i % 2 === 0 ? 1.6 : -1.8;
    const x = pt.x + side;
    const z = pt.z + (seededRandom(i * 2.1) - 0.5) * 1.2;
    if (nearLandmark(x, z)) continue;
    vines.push({
      position: [x, 0, z],
      rot: [0, seededRandom(i * 4.2) * Math.PI, 0],
      scale: 0.4 + seededRandom(i * 6.1) * 0.25,
    });
  }

  const petals: GroundPetal[] = [];
  for (let i = 0; i < 40; i++) {
    const x = (seededRandom(i * 7.3) - 0.5) * 22;
    const z = -1 - seededRandom(i * 5.5) * 26;
    if (nearLandmark(x, z)) continue;
    petals.push({
      position: [x, 0.04 + seededRandom(i * 2.8) * 0.08, z],
      scale: 0.18 + seededRandom(i * 3.1) * 0.16,
      rot: seededRandom(i * 8.2) * Math.PI * 2,
      phase: seededRandom(i * 1.4) * Math.PI * 2,
      color: heroPetalPalette[i % heroPetalPalette.length],
    });
  }

  const roseClusters: RoseCluster[] = [];
  for (let i = 0; i < 6; i++) {
    const x = (seededRandom(i * 13.3) - 0.5) * 20;
    const z = -2 - seededRandom(i * 9.1) * 24;
    if (nearLandmark(x, z)) continue;
    roseClusters.push({
      position: [x, 0.05, z],
      scale: 0.5 + seededRandom(i * 4.4) * 0.4,
    });
  }

  const fireflyPositions = new Float32Array(35 * 3);
  for (let i = 0; i < 35; i++) {
    fireflyPositions[i * 3] = (seededRandom(i * 11.1) - 0.5) * 20;
    fireflyPositions[i * 3 + 1] = 0.3 + seededRandom(i * 9.3) * 1.6;
    fireflyPositions[i * 3 + 2] = -2 - seededRandom(i * 7.7) * 24;
  }

  return { trees, vines, petals, roseClusters, fireflyPositions };
}

function ScatterPetal({ spec }: { spec: GroundPetal }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = spec.rot + Math.sin(t * 0.2 + spec.phase) * 0.1;
    ref.current.position.y = spec.position[1] + Math.sin(t * 0.35 + spec.phase) * 0.025;
  });

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      <primitive object={petalShape} attach="geometry" />
      <meshBasicMaterial
        color={spec.color}
        transparent
        opacity={0.42}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function RoseBush({ position, scale }: RoseCluster) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#8A9275" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.2, 0.28, Math.sin(a) * 0.2]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial
              color="#E8A0BC"
              emissive="#D4A59E"
              emissiveIntensity={0.25}
              roughness={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Fireflies({ positions }: { positions: Float32Array }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const basePositions = useMemo(() => positions.slice(), [positions]);
  const baseY = useMemo(() => {
    const y = new Float32Array(35);
    for (let i = 0; i < 35; i++) y[i] = basePositions[i * 3 + 1];
    return y;
  }, [basePositions]);

  useFrame(({ clock }) => {
    if (!mat.current || !points.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.5 + Math.sin(t * 1.4) * 0.25;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < 35; i++) {
      arr[i * 3 + 1] = baseY[i] + Math.sin(t * 0.9 + i * 1.7) * 0.18;
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.5 + i) * 0.08;
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
        size={0.14}
        transparent
        opacity={0.55}
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
      <mesh position={[-13, 0.35, -5]} scale={[7, 0.55, 5]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
      <mesh position={[12, 0.3, -18]} scale={[6, 0.5, 4]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
      <mesh position={[-8, 0.28, -22]} scale={[5, 0.45, 3.5]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
      <mesh position={[9, 0.32, -8]} scale={[4.5, 0.42, 3]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
    </group>
  );
}

useGLTF.preload(researchWorldAssets.tree);
useGLTF.preload(researchWorldAssets.vine);
