import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../../../theme/palette";

function GlassPanels() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  const panels = [
    { x: -2.2, z: -1.5, ry: 0.3 },
    { x: 0, z: -2.8, ry: 0 },
    { x: 2.2, z: -1.5, ry: -0.3 },
  ];

  return (
    <group ref={group} position={[0, 0.5, 0]}>
      {panels.map((p, i) => (
        <mesh key={i} position={[p.x, 0.8, p.z]} rotation={[0, p.ry, 0]}>
          <boxGeometry args={[1.4, 2.4, 0.06]} />
          <meshPhysicalMaterial
            color={palette.cream}
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.05}
            transmission={0.6}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticlePath() {
  const points = useRef<THREE.Points>(null);
  const count = 80;
  const positions = useRef(
    (() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        arr[i * 3] = (t - 0.5) * 8;
        arr[i * 3 + 1] = -1.5 + t * 3.5;
        arr[i * 3 + 2] = -2 + t * 2;
      }
      return arr;
    })(),
  );

  useFrame((state) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 2 + i * 0.3) * 0.002;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={palette.primary}
        size={0.06}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Silhouette() {
  return (
    <mesh position={[0, -1.2, 1.2]} rotation={[-0.15, 0, 0]}>
      <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
      <meshStandardMaterial color={palette.ink} transparent opacity={0.25} roughness={0.9} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 6]} intensity={1} />
      <directionalLight position={[-5, 2, 4]} intensity={0.3} color={palette.sage} />
      <fog attach="fog" args={[palette.bg, 6, 14]} />
      <GlassPanels />
      <ParticlePath />
      <Silhouette />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={palette.section} roughness={0.95} />
      </mesh>
    </>
  );
}

export default function EntryScene3D({ active }: { active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.5], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
