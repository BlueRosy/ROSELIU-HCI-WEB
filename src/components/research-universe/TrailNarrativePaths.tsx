import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import { pathRevealT, sampleEntryCinematicCamera } from "./entryCinematic";
import { buildNarrativePaths, type NarrativePathDef } from "./trailGardenLayout";
import { useUniverse } from "./UniverseContext";

function pathCurve(path: NarrativePathDef) {
  return new THREE.CatmullRomCurve3(path.points.map((p) => new THREE.Vector3(...p)));
}

function ribbonGeometry(curve: THREE.CatmullRomCurve3, width: number, segments = 64) {
  const points = curve.getSpacedPoints(segments);
  const positions: number[] = [];
  const indices: number[] = [];
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
}

function PetalPath({ path }: { path: NarrativePathDef }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const geo = useMemo(
    () => ribbonGeometry(pathCurve(path), path.width ?? 0.5),
    [path],
  );
  const isEntry = path.id === "entry-signals";
  const {
    entryCinematicActive,
    entryCinematicDone,
    entryCinematicPhase,
    entryCinematicElapsed,
    reducedMotion,
  } = useUniverse();

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    let base = 0.28 + Math.sin(t * 1.2) * 0.08;
    let opacity = 0.82;
    const shimmer = isEntry && Math.sin(t * 0.78) > 0.92 ? 0.06 : 0;

    if (
      isEntry &&
      entryCinematicActive.current &&
      !entryCinematicDone.current
    ) {
      const phase = entryCinematicPhase.current;
      if (phase === "through" || phase === "inside" || phase === "caption") {
        const sample = sampleEntryCinematicCamera(
          entryCinematicElapsed.current,
          reducedMotion.current,
        );
        const reveal = pathRevealT(sample.position.z);
        base = 0.34 + reveal * 0.62 + shimmer;
        opacity = 0.68 + reveal * 0.3;
      }
    }

    mat.current.emissiveIntensity = base;
    mat.current.opacity = opacity;
  });

  return (
    <mesh geometry={geo} renderOrder={1}>
      <meshStandardMaterial
        ref={mat}
        color="#F5D4DC"
        emissive={rwWonderland.pathGlow}
        emissiveIntensity={0.32}
        transparent
        opacity={0.82}
        roughness={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}

function DotLightPath({ path }: { path: NarrativePathDef }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 48;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const curve = useMemo(() => pathCurve(path), [path]);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [],
  );

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const p = curve.getPointAt(i / (count - 1));
      dummy.position.set(p.x, 0.12 + Math.sin(t * 2 + offsets[i]) * 0.04, p.z);
      dummy.scale.setScalar(0.06 + Math.sin(t * 3 + offsets[i]) * 0.02);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} renderOrder={2}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#FFF5EE"
        emissive="#B9786F"
        emissiveIntensity={0.65}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function VineGlowPath({ path }: { path: NarrativePathDef }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const geo = useMemo(
    () => ribbonGeometry(pathCurve(path), path.width ?? 0.38, 48),
    [path],
  );

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.55 + Math.sin(t * 0.9) * 0.15;
    mat.current.emissiveIntensity = 0.35 + Math.sin(t * 1.1) * 0.12;
  });

  return (
    <mesh geometry={geo} renderOrder={1}>
      <meshStandardMaterial
        ref={mat}
        color="#E8CFC8"
        emissive="#C4848F"
        emissiveIntensity={0.35}
        transparent
        opacity={0.6}
        roughness={0.5}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LoopRingPath({ path }: { path: NarrativePathDef }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const geo = useMemo(
    () => ribbonGeometry(pathCurve(path), path.width ?? 0.36, 72),
    [path],
  );

  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.emissiveIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 0.7) * 0.15;
  });

  return (
    <mesh geometry={geo} renderOrder={1}>
      <meshStandardMaterial
        ref={mat}
        color={rwWonderland.pathRibbon}
        emissive={rwWonderland.pathGlowBright}
        emissiveIntensity={0.42}
        transparent
        opacity={0.75}
        roughness={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

function NarrativePath({ path }: { path: NarrativePathDef }) {
  switch (path.kind) {
    case "petal":
      return <PetalPath path={path} />;
    case "dots":
      return <DotLightPath path={path} />;
    case "vine":
      return <VineGlowPath path={path} />;
    case "loopRing":
      return <LoopRingPath path={path} />;
    default:
      return null;
  }
}

export default function TrailNarrativePaths() {
  const paths = useMemo(() => buildNarrativePaths(), []);
  return (
    <group>
      {paths.map((path) => (
        <NarrativePath key={path.id} path={path} />
      ))}
    </group>
  );
}
