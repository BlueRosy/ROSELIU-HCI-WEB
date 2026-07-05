import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRwWonderland } from "../../theme/rwWonderland";
import {
  buildTreeLightArcSources,
  TREE_LIGHT_APEX,
  type TreeLightArc,
} from "./trailGardenLayout";
import { useUniverse } from "./UniverseContext";

const APEX = new THREE.Vector3(...TREE_LIGHT_APEX);

function arcCurve(arc: TreeLightArc) {
  const start = new THREE.Vector3(...arc.start);
  const mid = start.clone().lerp(APEX, 0.42);
  mid.x += arc.bulgeX;
  mid.z += arc.bulgeZ;
  mid.y += 1.4 + arc.bulgeX * 0.08;
  return new THREE.QuadraticBezierCurve3(start, mid, APEX.clone());
}

function ArcRibbon({ arc }: { arc: TreeLightArc }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const { timeOfDay } = useUniverse();

  const geometry = useMemo(() => {
    const curve = arcCurve(arc);
    const points = curve.getSpacedPoints(40);
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const t = i / (points.length - 1);
      const halfW = THREE.MathUtils.lerp(0.135, 0.032, t);
      const tangent =
        i < points.length - 1
          ? new THREE.Vector3().subVectors(points[i + 1], p).normalize()
          : new THREE.Vector3().subVectors(p, points[i - 1]).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(halfW);
      const left = p.clone().add(side);
      const right = p.clone().sub(side);
      positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
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
  }, [arc]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const night = timeOfDay.current === "night";
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 0.55 + arc.phase) * 0.015;
    mat.current.opacity = night
      ? 0.11 + pulse + 0.04
      : 0.028 + pulse * 0.5;
    mat.current.color.set(night ? "#F0C8A8" : "#F5D4DC");
  });

  return (
    <mesh geometry={geometry} renderOrder={0}>
      <meshBasicMaterial
        ref={mat}
        color="#F5D4DC"
        transparent
        opacity={0.03}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function TrailTreeLightArcs() {
  const arcs = useMemo(() => buildTreeLightArcSources(), []);
  const { timeOfDay } = useUniverse();
  const apexLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!apexLight.current) return;
    const night = timeOfDay.current === "night";
    const palette = getRwWonderland(timeOfDay.current);
    if (!night) {
      apexLight.current.intensity = 0;
      return;
    }
    const t = clock.getElapsedTime();
    apexLight.current.color.set(palette.pathGlowBright);
    apexLight.current.intensity = 0.12 + Math.sin(t * 0.6) * 0.04;
  });

  return (
    <group>
      {arcs.map((arc, i) => (
        <ArcRibbon key={`tree-arc-${i}`} arc={arc} />
      ))}
      <pointLight
        ref={apexLight}
        position={TREE_LIGHT_APEX}
        color="#F0C8A8"
        intensity={0}
        distance={18}
        decay={2}
      />
    </group>
  );
}
