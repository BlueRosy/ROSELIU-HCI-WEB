import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRwWonderland } from "../../theme/rwWonderland";
import { RWClosedLoopCoreGlb } from "../research-world/RWZoneAssets";
import { DISC_CENTER } from "../research-world/rwWorldConfig";
import { landmarkFocus, landmarkGlowBoost } from "./landmarkFocus";
import { useUniverse } from "./UniverseContext";
import { zoneFromSection } from "./worldTrailConfig";

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
  const discMat = useRef<THREE.MeshStandardMaterial>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const particles = useRef<THREE.InstancedMesh>(null);
  const particleMat = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const curve = useMemo(() => buildLemniscateCurve(LEMNISCATE_A), []);
  const ribbonGeo = useMemo(() => ribbonFromCurve(curve, 0.22), [curve]);
  const haloGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 128, 0.035, 8, true),
    [curve],
  );
  const { activeSection, timeOfDay } = useUniverse();
  const palette = getRwWonderland(timeOfDay.current);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const glow = landmarkGlowBoost("loop", zone, strength, arrive);
    const loopLanded = glow > 0.02;

    if (ribbonMat.current) {
      ribbonMat.current.emissiveIntensity =
        0.18 + glow * 0.42 + arrive * 0.18 + (loopLanded ? Math.sin(t * 1.1) * 0.05 : 0);
      ribbonMat.current.color.set(loopLanded ? "#F5C8D4" : "#F0D8DC");
      ribbonMat.current.emissive.set(loopLanded ? palette.pathGlowBright : palette.pathGlow);
    }
    if (haloMat.current) {
      haloMat.current.opacity = loopLanded ? 0.06 + glow * 0.22 + arrive * 0.12 : 0.03;
    }
    if (discMat.current) {
      discMat.current.emissiveIntensity =
        (timeOfDay.current === "night" ? 0.08 : 0.05) + glow * 0.22 + arrive * 0.1;
      discMat.current.color.set(loopLanded ? "#FAE8EE" : "#F5EFE8");
    }
    if (coreLight.current) {
      coreLight.current.intensity = 0.28 + glow * 0.65 + arrive * 0.25;
    }
    if (particleMat.current) {
      particleMat.current.opacity = loopLanded ? 0.55 + glow * 0.28 : 0.35;
    }

    const mesh = particles.current;
    if (!mesh) return;
    const particleScale = 0.42 + glow * 0.38;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = i / PARTICLE_COUNT;
      const u = (phase + t * 0.06) % 1;
      const p = curve.getPointAt(u);
      p.y = 0.18 + Math.sin(t * 2 + phase * Math.PI * 2) * 0.06;
      dummy.position.copy(p);
      dummy.scale.setScalar(particleScale);
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
          ref={discMat}
          color="#F5EFE8"
          roughness={0.42}
          metalness={0.06}
          emissive={palette.pathGlow}
          emissiveIntensity={timeOfDay.current === "night" ? 0.08 : 0.05}
        />
      </mesh>

      <mesh geometry={ribbonGeo} renderOrder={2}>
        <meshStandardMaterial
          ref={ribbonMat}
          color="#F0D8DC"
          emissive={palette.pathGlow}
          emissiveIntensity={0.18}
          transparent
          opacity={0.82}
          roughness={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={haloGeo} position={[0, 0.28, 0]} renderOrder={3}>
        <meshBasicMaterial
          ref={haloMat}
          color={palette.pathGlowBright}
          transparent
          opacity={0.03}
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
          ref={particleMat}
          color={palette.pathGlowBright}
          transparent
          opacity={0.35}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      <pointLight ref={coreLight} position={[0, 1.2, 0]} intensity={0.28} color="#FFE8EE" distance={12} />
      <LoopCampfireLight />
    </group>
  );
}

function LoopCampfireLight() {
  const { timeOfDay } = useUniverse();
  const light = useRef<THREE.PointLight>(null);
  const night = timeOfDay.current === "night";
  const palette = getRwWonderland(timeOfDay.current);

  useFrame(({ clock }) => {
    if (!light.current || !night) return;
    const t = clock.getElapsedTime();
    light.current.intensity = 0.5 + Math.sin(t * 1.3) * 0.12;
  });

  if (!night) return null;

  return (
    <pointLight
      ref={light}
      position={[0, 0.35, 0]}
      color={palette.campfire}
      intensity={0.65}
      distance={10}
      decay={2}
    />
  );
}
