import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../theme/palette";
import { useLoopCurve } from "./useLoopCurve";

const SEGMENT_COLORS = [
  new THREE.Color(palette.sage),
  new THREE.Color("#9AA8B5"),
  new THREE.Color(palette.primary),
  new THREE.Color(palette.roseSoft),
];

const COUNT = 280;

export default function ParticleStream() {
  const curve = useLoopCurve();
  const points = useRef<THREE.Points>(null);
  const offsets = useMemo(() => {
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) arr[i] = i / COUNT;
    return arr;
  }, []);

  const geometry = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const t = offsets[i];
      curve.getPoint(t, tmp);
      pos[i * 3] = tmp.x;
      pos[i * 3 + 1] = tmp.y;
      pos[i * 3 + 2] = tmp.z;
      const seg = Math.floor(t * 4) % 4;
      const c = SEGMENT_COLORS[seg];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      size[i] = 0.04 + (i % 3) * 0.015;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setAttribute("size", new THREE.BufferAttribute(size, 1));
    return g;
  }, [curve, offsets]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      offsets[i] = (offsets[i] + delta * 0.028) % 1;
      curve.getPoint(offsets[i], tmp);
      arr[i * 3] = tmp.x;
      arr[i * 3 + 1] = tmp.y;
      arr[i * 3 + 2] = tmp.z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.82}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
