import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../../theme/palette";

function SafetyRing() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.02, 16, 100]} />
      <meshBasicMaterial color={palette.sage} transparent opacity={0.55} />
    </mesh>
  );
}

function SupportPanels() {
  const group = useRef<THREE.Group>(null);
  const panels = [
    { x: -1.2, y: 0.4, z: 0 },
    { x: 0, y: -0.2, z: -0.3 },
    { x: 1.2, y: 0.5, z: 0.1 },
  ];

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <group ref={group}>
      {panels.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <boxGeometry args={[0.9, 0.55, 0.05]} />
          <meshPhysicalMaterial
            color={palette.cream}
            transparent
            opacity={0.45}
            roughness={0.15}
            transmission={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1} />
      <directionalLight position={[-3, -2, 3]} intensity={0.25} color={palette.roseSoft} />
      <SafetyRing />
      <SupportPanels />
    </>
  );
}

export default function SupportScene3D({ active }: { active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
