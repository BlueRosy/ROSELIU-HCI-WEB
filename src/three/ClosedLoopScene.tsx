import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LoopNode } from "../content/site";
import { palette } from "../theme/palette";

const PRIMARY = new THREE.Color(palette.primaryDeep);
const ACCENT = new THREE.Color(palette.sage);
const RADIUS = 2.6;

function nodeColor(i: number, total: number) {
  return PRIMARY.clone().lerp(ACCENT, total > 1 ? i / (total - 1) : 0);
}

function nodePosition(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return new THREE.Vector3(
    Math.cos(angle) * RADIUS,
    Math.sin(angle) * RADIUS,
    0,
  );
}

function Node({
  position,
  color,
  active,
  current,
  onActivate,
}: {
  position: THREE.Vector3;
  color: THREE.Color;
  active: boolean;
  current?: boolean;
  onActivate: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const target = active ? 1.5 : current ? 1.2 : 1;

  useFrame(() => {
    if (!mesh.current) return;
    const s = mesh.current.scale.x;
    const next = s + (target - s) * 0.15;
    mesh.current.scale.setScalar(next);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onActivate();
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.6 : 0.25}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      {(active || current) && (
        <mesh>
          <ringGeometry args={[0.42, 0.48, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={active ? 0.7 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function Scene({
  nodes,
  activeKey,
  onActivate,
}: {
  nodes: LoopNode[];
  activeKey: string;
  onActivate: (key: string) => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <directionalLight position={[-6, -4, 2]} intensity={0.25} color={palette.sage} />
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS, 0.015, 16, 120]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.45} />
        </mesh>
        {nodes.map((n, i) => (
          <Node
            key={n.key}
            position={nodePosition(i, nodes.length)}
            color={nodeColor(i, nodes.length)}
            active={activeKey === n.key}
            current={n.current}
            onActivate={() => onActivate(n.key)}
          />
        ))}
      </group>
    </>
  );
}

export default function ClosedLoopScene({
  nodes,
  activeKey,
  onActivate,
  active,
}: {
  nodes: LoopNode[];
  activeKey: string;
  onActivate: (key: string) => void;
  active: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene nodes={nodes} activeKey={activeKey} onActivate={onActivate} />
    </Canvas>
  );
}
