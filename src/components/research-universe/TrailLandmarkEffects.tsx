import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANDMARKS } from "../research-world/rwWorldConfig";
import { useUniverse } from "./UniverseContext";

function zoneIntensity(activeZone: string, zoneId: string, scrollProgress: number, targetProgress: number) {
  const zoneMatch = activeZone === zoneId ? 1 : 0;
  const scrollNear = 1 - Math.min(1, Math.abs(scrollProgress - targetProgress) * 8);
  return Math.max(zoneMatch * 0.85, scrollNear * 0.35);
}

function SignalsEffect() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const lm = LANDMARKS.find((l) => l.id === "signals")!;
  const { activeZone, scrollProgress } = useUniverse();
  const positions = useRef(
    (() => {
      const arr = new Float32Array(36 * 3);
      for (let i = 0; i < 36; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 2.5;
        arr[i * 3 + 1] = Math.random() * 3.5;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      }
      return arr;
    })(),
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const intensity = zoneIntensity(activeZone.current, "signals", scrollProgress.current, 0.2);
    if (mat.current) mat.current.opacity = 0.15 + intensity * 0.55;
    if (points.current) points.current.rotation.y = t * 0.15;
  });

  return (
    <points ref={points} position={[lm.position[0], 0.5, lm.position[2]]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#F5C4D8"
        size={0.12}
        transparent
        opacity={0.3}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function StatesEffect() {
  const mesh = useRef<THREE.Mesh>(null);
  const lm = LANDMARKS.find((l) => l.id === "states")!;
  const { activeZone, scrollProgress } = useUniverse();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const intensity = zoneIntensity(activeZone.current, "states", scrollProgress.current, 0.4);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + intensity * 0.22;
    mesh.current.scale.setScalar(1 + intensity * 0.15 + Math.sin(t * 2) * 0.03);
  });

  return (
    <mesh ref={mesh} position={[lm.position[0], 2.2, lm.position[2]]}>
      <ringGeometry args={[1.8, 2.4, 48]} />
      <meshBasicMaterial
        color="#C4848F"
        transparent
        opacity={0.15}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SupportEffect() {
  const light = useRef<THREE.PointLight>(null);
  const lm = LANDMARKS.find((l) => l.id === "support")!;
  const { activeZone, scrollProgress } = useUniverse();

  useFrame(({ clock }) => {
    if (!light.current) return;
    const t = clock.getElapsedTime();
    const intensity = zoneIntensity(activeZone.current, "support", scrollProgress.current, 0.6);
    light.current.intensity = 0.2 + intensity * 1.1 + Math.sin(t * 1.4) * 0.15;
  });

  return (
    <pointLight
      ref={light}
      position={[lm.position[0], 2.5, lm.position[2]]}
      color="#F5D0D8"
      intensity={0.4}
      distance={12}
    />
  );
}

export default function TrailLandmarkEffects() {
  return (
    <>
      <SignalsEffect />
      <StatesEffect />
      <SupportEffect />
    </>
  );
}
