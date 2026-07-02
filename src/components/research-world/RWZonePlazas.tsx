import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";
import { ZONE_PLAZAS } from "./rwWorldConfig";

function PlazaParticles({
  position,
  radius,
  color,
  count = 24,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  count?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius * (0.4 + Math.random() * 0.5);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.3 + Math.random() * 1.2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.003;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function PlazaDisc({ plaza }: { plaza: (typeof ZONE_PLAZAS)[number] }) {
  return (
    <group position={plaza.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[plaza.radius, 48]} />
        <meshPhysicalMaterial
          color={plaza.color}
          emissive={plaza.emissive}
          emissiveIntensity={0.12}
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[plaza.radius - 0.05, plaza.radius, 64]} />
        <meshBasicMaterial
          color={rwWonderland.panelBorder}
          transparent
          opacity={0.35}
        />
      </mesh>
      <Text
        position={[0, 0.5, -plaza.radius + 0.6]}
        fontSize={0.2}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
      >
        {plaza.label}
      </Text>
      <PlazaParticles
        position={[0, 0, 0]}
        radius={plaza.radius}
        color={plaza.particleColor}
        count={plaza.zoneId === "loop" ? 36 : 20}
      />
    </group>
  );
}

export default function RWZonePlazas() {
  return (
    <group>
      {ZONE_PLAZAS.map((plaza) => (
        <PlazaDisc key={plaza.zoneId} plaza={plaza} />
      ))}
    </group>
  );
}
