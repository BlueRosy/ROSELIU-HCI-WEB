import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { heroPetalPalette } from "../../theme/palette";
import { rwWonderland } from "../../theme/rwWonderland";
import { TRAIL_CURVE } from "./worldTrailConfig";

const petalShape = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

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

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function buildScatterLayout() {
  const trees: ScatterTree[] = [];
  for (let i = 0; i < 8; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const t = 0.08 + seededRandom(i * 3.7) * 0.84;
    const pt = TRAIL_CURVE.getPointAt(t);
    const tangent = TRAIL_CURVE.getTangentAt(t);
    const off = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(
      side * (3.5 + seededRandom(i * 5.1) * 2.5),
    );
    trees.push({
      position: [pt.x + off.x, 0, pt.z + off.z],
      scale: 0.4 + seededRandom(i * 2.3) * 0.3,
      rot: seededRandom(i * 1.9) * Math.PI * 2,
    });
  }

  const vines: ScatterVine[] = [];
  for (let i = 0; i < 5; i++) {
    const t = 0.12 + (i / 5) * 0.76;
    const pt = TRAIL_CURVE.getPointAt(t);
    const side = i % 2 === 0 ? 1.2 : -1.4;
    vines.push({
      position: [pt.x + side, 0, pt.z + (i % 3) * 0.4 - 0.4],
      rot: [0, seededRandom(i * 4.2) * Math.PI, 0],
      scale: 0.45 + seededRandom(i * 6.1) * 0.15,
    });
  }

  const petals: GroundPetal[] = [];
  for (let i = 0; i < 14; i++) {
    petals.push({
      position: [
        (seededRandom(i * 7.3) - 0.5) * 18,
        0.04 + seededRandom(i * 2.8) * 0.06,
        -2 - seededRandom(i * 5.5) * 22,
      ],
      scale: 0.22 + seededRandom(i * 3.1) * 0.12,
      rot: seededRandom(i * 8.2) * Math.PI * 2,
      phase: seededRandom(i * 1.4) * Math.PI * 2,
      color: heroPetalPalette[i % heroPetalPalette.length],
    });
  }

  const fireflyPositions = new Float32Array(15 * 3);
  for (let i = 0; i < 15; i++) {
    fireflyPositions[i * 3] = (seededRandom(i * 11.1) - 0.5) * 16;
    fireflyPositions[i * 3 + 1] = 0.4 + seededRandom(i * 9.3) * 1.2;
    fireflyPositions[i * 3 + 2] = -3 - seededRandom(i * 7.7) * 20;
  }

  return { trees, vines, petals, fireflyPositions };
}

function ScatterPetal({ spec }: { spec: GroundPetal }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = spec.rot + Math.sin(t * 0.2 + spec.phase) * 0.08;
    ref.current.position.y = spec.position[1] + Math.sin(t * 0.35 + spec.phase) * 0.02;
  });

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      <primitive object={petalShape} attach="geometry" />
      <meshBasicMaterial
        color={spec.color}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Fireflies({ positions }: { positions: Float32Array }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const basePositions = useMemo(() => positions.slice(), [positions]);
  const baseY = useMemo(() => {
    const y = new Float32Array(15);
    for (let i = 0; i < 15; i++) y[i] = basePositions[i * 3 + 1];
    return y;
  }, [basePositions]);

  useFrame(({ clock }) => {
    if (!mat.current || !points.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.45 + Math.sin(t * 1.4) * 0.2;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < 15; i++) {
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
        color="#C8D4A0"
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
      <Fireflies positions={layout.fireflyPositions} />
      <mesh position={[-12, 0.3, -6]} scale={[6, 0.5, 4]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
      <mesh position={[11, 0.25, -20]} scale={[5, 0.45, 3.5]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.55} />
      </mesh>
    </group>
  );
}

useGLTF.preload(researchWorldAssets.tree);
useGLTF.preload(researchWorldAssets.vine);
