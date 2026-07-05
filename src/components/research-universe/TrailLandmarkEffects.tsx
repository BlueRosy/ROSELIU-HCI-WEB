import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANDMARKS } from "../research-world/rwWorldConfig";
import { entryRevealBoost } from "./entryRevealBoost";
import { landmarkFocus, landmarkGlowBoost } from "./landmarkFocus";
import { useUniverse } from "./UniverseContext";
import { zoneFromSection } from "./worldTrailConfig";

function zoneIntensity(activeZone: string, zoneId: string): number {
  return activeZone === zoneId ? 1 : 0;
}

function SignalsEffect() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const lm = LANDMARKS.find((l) => l.id === "signals")!;
  const { activeSection, entryCinematicDone } = useUniverse();
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
    if (!entryCinematicDone.current) {
      if (mat.current) mat.current.opacity = 0;
      return;
    }
    const t = clock.getElapsedTime();
    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const glow = landmarkGlowBoost("signals", zone, strength, arrive);
    const intensity = zoneIntensity(zone, "signals") + glow * 0.25;
    if (mat.current) mat.current.opacity = 0.15 + intensity * 0.55 + entryRevealBoost.current.signals;
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
  const { activeSection, entryCinematicDone } = useUniverse();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    if (!entryCinematicDone.current) {
      const mat = mesh.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0;
      mesh.current.scale.setScalar(1);
      return;
    }
    const t = clock.getElapsedTime();
    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const glow = landmarkGlowBoost("states", zone, strength, arrive);
    const intensity = zoneIntensity(zone, "states") + glow * 0.2;
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + intensity * 0.22 + entryRevealBoost.current.states;
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
  const { activeSection, entryCinematicDone } = useUniverse();

  useFrame(({ clock }) => {
    if (!light.current) return;
    if (!entryCinematicDone.current) {
      light.current.intensity = 0;
      return;
    }
    const t = clock.getElapsedTime();
    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const glow = landmarkGlowBoost("support", zone, strength, arrive);
    const intensity = zoneIntensity(zone, "support") + glow * 0.22;
    light.current.intensity = 0.2 + intensity * 1.1 + Math.sin(t * 1.4) * 0.15 + entryRevealBoost.current.support * 2.5;
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
