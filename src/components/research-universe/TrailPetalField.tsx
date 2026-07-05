import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroPetalPalette } from "../../theme/palette";
import { useUniverse } from "./UniverseContext";

const petalGeometry = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

type PetalSpec = {
  position: [number, number, number];
  scale: number;
  rotation: number;
  drift: [number, number];
  phase: number;
  color: string;
};

const SPECS: PetalSpec[] = [
  {
    position: [6, 3, -4],
    scale: 0.5,
    rotation: 0.4,
    drift: [0.15, 0.1],
    phase: 0,
    color: heroPetalPalette[0],
  },
  {
    position: [-7, 2, -8],
    scale: 0.42,
    rotation: -0.6,
    drift: [0.12, 0.14],
    phase: 1.8,
    color: heroPetalPalette[1],
  },
  {
    position: [4, 1.5, -14],
    scale: 0.36,
    rotation: 1.1,
    drift: [0.1, 0.12],
    phase: 3.2,
    color: heroPetalPalette[2],
  },
  {
    position: [-5, 4, -18],
    scale: 0.44,
    rotation: 0.2,
    drift: [0.11, 0.09],
    phase: 2.4,
    color: heroPetalPalette[0],
  },
];

function Petal({ spec }: { spec: PetalSpec }) {
  const ref = useRef<THREE.Mesh>(null);
  const { parallax } = useUniverse();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x =
      spec.position[0] +
      parallax.current.x * 0.4 +
      Math.sin(t * 0.35 + spec.phase) * spec.drift[0];
    ref.current.position.y =
      spec.position[1] +
      parallax.current.y * 0.3 +
      Math.sin(t * 0.28 + spec.phase * 1.4) * spec.drift[1];
    ref.current.position.z = spec.position[2];
    ref.current.rotation.z =
      spec.rotation + Math.sin(t * 0.22 + spec.phase) * 0.12;
  });

  return (
    <mesh ref={ref} scale={spec.scale}>
      <primitive object={petalGeometry} attach="geometry" />
      <meshBasicMaterial
        color={spec.color}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function TrailPetalField() {
  const petals = useMemo(() => SPECS, []);
  return (
    <group>
      {petals.map((spec, i) => (
        <Petal key={i} spec={spec} />
      ))}
    </group>
  );
}
