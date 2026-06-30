import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ParallaxPoint } from "../hooks/useHeroParallax";
import { heroPetalPalette } from "../theme/palette";

type PetalSpec = {
  position: [number, number, number];
  scale: [number, number];
  rotation: number;
  drift: [number, number];
  phase: number;
  color: string;
};

function createPetalShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return shape;
}

const petalGeometry = (() => {
  const shape = createPetalShape();
  return new THREE.ShapeGeometry(shape);
})();

function Petal({
  spec,
  parallax,
}: {
  spec: PetalSpec;
  parallax: ParallaxPoint;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x =
      spec.position[0] +
      parallax.x * 0.35 +
      Math.sin(t * 0.35 + spec.phase) * spec.drift[0];
    ref.current.position.y =
      spec.position[1] +
      parallax.y * 0.25 +
      Math.sin(t * 0.28 + spec.phase * 1.4) * spec.drift[1];
    ref.current.rotation.z =
      spec.rotation + Math.sin(t * 0.22 + spec.phase) * 0.12;
  });

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      <primitive object={petalGeometry} attach="geometry" />
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

export default function PetalField({ parallax }: { parallax: ParallaxPoint }) {
  const petals = useMemo<PetalSpec[]>(
    () => [
      {
        position: [2.8, 1.2, -2],
        scale: [0.55, 0.55],
        rotation: 0.4,
        drift: [0.12, 0.08],
        phase: 0,
        color: heroPetalPalette[0],
      },
      {
        position: [-3.2, -0.4, -1.5],
        scale: [0.45, 0.45],
        rotation: -0.6,
        drift: [0.1, 0.1],
        phase: 1.8,
        color: heroPetalPalette[1],
      },
      {
        position: [1.2, -1.6, -2.5],
        scale: [0.38, 0.38],
        rotation: 1.1,
        drift: [0.08, 0.12],
        phase: 3.2,
        color: heroPetalPalette[2],
      },
    ],
    [],
  );

  return (
    <group>
      {petals.map((spec, i) => (
        <Petal key={i} spec={spec} parallax={parallax} />
      ))}
    </group>
  );
}
