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

const COUNT = 320;

export default function ParticleStream() {
  const curve = useLoopCurve();
  const points = useRef<THREE.Points>(null);
  const offsets = useMemo(() => {
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      arr[i] = i / COUNT + Math.random() * 0.02;
    }
    return arr;
  }, []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const t = offsets[i] % 1;
      curve.getPoint(t, tmp);
      pos[i * 3] = tmp.x;
      pos[i * 3 + 1] = tmp.y;
      pos[i * 3 + 2] = tmp.z;
      const seg = Math.floor(t * 4) % 4;
      const c = SEGMENT_COLORS[seg];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [curve, offsets]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors.slice(), 3));
    return g;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const colAttr = points.current.geometry.getAttribute("color") as THREE.BufferAttribute;
    const colArr = colAttr.array as Float32Array;
    const tmp = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      offsets[i] = (offsets[i] + delta * 0.04) % 1;
      const t = offsets[i];
      curve.getPoint(t, tmp);
      arr[i * 3] = tmp.x + (Math.random() - 0.5) * 0.02;
      arr[i * 3 + 1] = tmp.y + (Math.random() - 0.5) * 0.02;
      arr[i * 3 + 2] = tmp.z + (Math.random() - 0.5) * 0.02;
      const seg = Math.floor(t * 4) % 4;
      const c = SEGMENT_COLORS[seg];
      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    attr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
