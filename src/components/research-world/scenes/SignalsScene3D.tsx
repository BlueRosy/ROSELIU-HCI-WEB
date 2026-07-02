import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SignalParticles from "../../../three/SignalParticles";
import { palette } from "../../../theme/palette";

function FloatingCards() {
  const group = useRef<THREE.Group>(null);
  const cards = [
    { x: -1.8, y: 0.6, z: -0.5, ry: 0.2 },
    { x: 0.2, y: 1.1, z: -1.2, ry: -0.1 },
    { x: 1.9, y: 0.3, z: -0.3, ry: -0.25 },
  ];

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.y = cards[i].y + Math.sin(state.clock.elapsedTime + i) * 0.08;
    });
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} rotation={[0, c.ry, 0]}>
          <boxGeometry args={[1.1, 0.7, 0.04]} />
          <meshPhysicalMaterial
            color={palette.cream}
            transparent
            opacity={0.5}
            roughness={0.2}
            transmission={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 6, 8]} intensity={1} />
      <SignalParticles count={90} parallax={parallax} />
      <FloatingCards />
    </>
  );
}

export default function SignalsScene3D({
  active,
  parallax,
}: {
  active: boolean;
  parallax: { x: number; y: number };
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene parallax={parallax} />
    </Canvas>
  );
}
