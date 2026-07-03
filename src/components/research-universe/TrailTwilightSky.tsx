import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rwWonderland } from "../../theme/rwWonderland";

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
  uniform vec3 duskColor;
  void main() {
    float h = normalize(vWorldPosition).y;
    float t = smoothstep(-0.1, 0.55, h);
    vec3 col = mix(horizonColor, topColor, t);
    col = mix(col, duskColor, smoothstep(0.35, 0.85, h) * 0.35);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function TwilightStars() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const count = 90;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.5 + Math.PI * 0.18;
      const phi = Math.random() * Math.PI * 2;
      const r = SKY_RADIUS * 0.94;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.cos(theta) + 6;
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    mat.current.opacity = 0.65 + Math.sin(t * 0.8) * 0.12;
    if (points.current) points.current.rotation.y = t * 0.006;
  });

  return (
    <points ref={points} frustumCulled={false} renderOrder={-2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#FFF5EE"
        size={0.28}
        transparent
        opacity={0.7}
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
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(245, 190, 210, 0.85)");
    grad.addColorStop(0.35, "rgba(232, 160, 190, 0.35)");
    grad.addColorStop(0.65, "rgba(232, 180, 200, 0.12)");
    grad.addColorStop(1, "rgba(232, 180, 200, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = 14 + Math.sin(t * 0.12) * 0.3;
  });

  return (
    <group ref={group} position={[6, 14, -6]} renderOrder={10}>
      <sprite scale={[10, 10, 1]} renderOrder={9}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </sprite>
      <mesh renderOrder={10}>
        <sphereGeometry args={[1.4, 20, 20]} />
        <meshBasicMaterial color="#F0C0D4" toneMapped={false} />
      </mesh>
      <mesh scale={[1.05, 1.05, 1.05]} renderOrder={11}>
        <sphereGeometry args={[1.4, 20, 20]} />
        <meshBasicMaterial
          color="#E8A0BC"
          transparent
          opacity={0.35}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}

export default function TrailTwilightSky() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#FFF0F5") },
      horizonColor: { value: new THREE.Color(rwWonderland.fog) },
      duskColor: { value: new THREE.Color("#E8C4D0") },
    }),
    [],
  );

  return (
    <group>
      <mesh scale={[-1, 1, 1]} frustumCulled={false} renderOrder={-3}>
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
