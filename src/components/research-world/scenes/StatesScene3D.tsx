import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../../theme/palette";

const LAYERS = [
  { radius: 0.45, color: palette.primaryDeep, emissive: 0.5 },
  { radius: 0.75, color: palette.primary, emissive: 0.35 },
  { radius: 1.1, color: palette.roseSoft, emissive: 0.25 },
  { radius: 1.5, color: palette.sage, emissive: 0.2 },
];

function StateCore() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.25;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={group}>
      {LAYERS.map((layer, i) => (
        <mesh key={i}>
          <icosahedronGeometry args={[layer.radius, 1]} />
          <meshStandardMaterial
            color={layer.color}
            emissive={layer.color}
            emissiveIntensity={layer.emissive}
            transparent
            opacity={0.35 - i * 0.05}
            wireframe={i > 0}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color={palette.primaryDeep}
          emissive={palette.primaryDeep}
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 6]} intensity={1.1} />
      <pointLight position={[-4, -2, 4]} intensity={0.4} color={palette.sage} />
      <StateCore />
    </>
  );
}

export default function StatesScene3D({ active }: { active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
