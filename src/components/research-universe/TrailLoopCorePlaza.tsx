import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import { RWClosedLoopCoreGlb } from "../research-world/RWZoneAssets";
import { DISC_CENTER } from "../research-world/rwWorldConfig";
import { useUniverse } from "./UniverseContext";

const LEMNISCATE_A = 2.15;
const PARTICLE_COUNT = 32;

function lemniscatePoint(t: number, a: number): THREE.Vector3 {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);
  const denom = 1 + sinT * sinT;
  return new THREE.Vector3(
    (a * Math.SQRT2 * cosT) / denom,
    0,
    (a * Math.SQRT2 * sinT * cosT) / denom,
  );
}

function buildLemniscateCurve(a: number, segments = 128) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    points.push(lemniscatePoint((i / segments) * Math.PI * 2, a));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

function ribbonFromCurve(curve: THREE.Curve<THREE.Vector3>, width: number, segments = 96) {
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
    positions.push(left.x, 0.08, left.z, right.x, 0.08, right.z);
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

export default function TrailLoopCorePlaza() {
  const [cx, , cz] = DISC_CENTER;
  const ribbonMat = useRef<THREE.MeshStandardMaterial>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);
  const particles = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const curve = useMemo(() => buildLemniscateCurve(LEMNISCATE_A), []);
  const ribbonGeo = useMemo(() => ribbonFromCurve(curve, 0.22), [curve]);
  const haloGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 128, 0.035, 8, true),
    [curve],
  );
  const { activeZone, scrollProgress } = useUniverse();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const zoneMatch = activeZone.current === "loop" ? 1 : 0;
    const scrollNear = 1 - Math.min(1, Math.abs(scrollProgress.current - 0.8) * 8);
    const boost = Math.max(zoneMatch * 0.85, scrollNear * 0.4);

    if (ribbonMat.current) {
      ribbonMat.current.emissiveIntensity = 0.32 + boost * 0.28 + Math.sin(t * 1.1) * 0.06;
    }
    if (haloMat.current) {
      haloMat.current.opacity = 0.08 + boost * 0.18 + Math.sin(t * 0.9) * 0.04;
    }

    const mesh = particles.current;
    if (!mesh) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = i / PARTICLE_COUNT;
      const u = (phase + t * 0.06) % 1;
      const p = curve.getPointAt(u);
      p.y = 0.18 + Math.sin(t * 2 + phase * Math.PI * 2) * 0.06;
      dummy.position.copy(p);
      dummy.scale.setScalar(0.55 + boost * 0.35);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[cx, 0, cz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} receiveShadow>
        <circleGeometry args={[3.35, 48]} />
        <meshStandardMaterial
          color="#F5EFE8"
          roughness={0.42}
          metalness={0.06}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh geometry={ribbonGeo} renderOrder={2}>
        <meshStandardMaterial
          ref={ribbonMat}
          color="#F0D8DC"
          emissive={rwWonderland.pathGlowBright}
          emissiveIntensity={0.38}
          transparent
          opacity={0.88}
          roughness={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={haloGeo} position={[0, 0.28, 0]} renderOrder={3}>
        <meshBasicMaterial
          ref={haloMat}
          color={rwWonderland.pathGlowBright}
          transparent
          opacity={0.12}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <RWClosedLoopCoreGlb accent />

      <instancedMesh
        ref={particles}
        args={[undefined, undefined, PARTICLE_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={rwWonderland.pathGlowBright}
          transparent
          opacity={0.75}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      <pointLight position={[0, 1.2, 0]} intensity={0.55} color="#FFE8EE" distance={12} />
    </group>
  );
}
