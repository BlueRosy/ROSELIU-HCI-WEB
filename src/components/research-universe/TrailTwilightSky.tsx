import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";

const SKY_CENTER_Z = -9;
const SKY_RADIUS = 55;

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  varying vec3 vWorldPosition;
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  void main() {
    float h = normalize(vWorldPosition).y;
    float t = smoothstep(-0.15, 0.65, h);
    vec3 col = mix(horizonColor, topColor, t);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function TwilightStars() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const { positions } = useMemo(() => {
    const count = 72;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.55 + Math.PI * 0.22;
      const phi = Math.random() * Math.PI * 2;
      const r = SKY_RADIUS * 0.92;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.cos(theta) + 8;
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi) + SKY_CENTER_Z;
    }
    return { positions: pos };
  }, []);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.55 + Math.sin(t * 0.8) * 0.08;
    if (points.current) {
      points.current.rotation.y = t * 0.008;
    }
  });

  return (
    <points ref={points} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#FFF8F0"
        size={0.18}
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function PinkMoon() {
  const group = useRef<THREE.Group>(null);
  const glowTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(232, 180, 200, 0.55)");
    grad.addColorStop(0.4, "rgba(232, 180, 200, 0.2)");
    grad.addColorStop(1, "rgba(232, 180, 200, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = 18 + Math.sin(t * 0.15) * 0.25;
  });

  return (
    <group ref={group} position={[14, 18, SKY_CENTER_Z - 12]}>
      <sprite scale={[5, 5, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} />
      </sprite>
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshStandardMaterial
          color="#F5D4E0"
          emissive="#E8B4C8"
          emissiveIntensity={0.45}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

export default function TrailTwilightSky() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#FFF5EE") },
      horizonColor: { value: new THREE.Color(rwWonderland.fog) },
    }),
    [],
  );

  return (
    <group position={[0, 0, SKY_CENTER_Z]}>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[SKY_RADIUS, 24, 24]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <TwilightStars />
      <PinkMoon />
    </group>
  );
}
