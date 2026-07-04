import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";

const SKY_RADIUS = 55;

/** Load a GLB, scale so its largest dimension = targetSize, recenter at the
 * origin, and disable fog so sky props stay crisp against the gradient. */
export function useSkyModel(url: string, targetSize: number) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = targetSize / Math.max(size.x, size.y, size.z, 0.001);
    clone.scale.setScalar(scale);
    clone.updateMatrixWorld(true);
    const centered = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    centered.getCenter(center);
    clone.position.sub(center);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        (m as THREE.Material & { fog?: boolean }).fog = false;
      });
    });
    return clone;
  }, [scene, targetSize]);
}

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
        size={0.32}
        transparent
        opacity={0.7}
        depthWrite={false}
        fog={false}
        sizeAttenuation
      />
    </points>
  );
}

function glowSpriteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(245, 190, 210, 0.8)");
  grad.addColorStop(0.35, "rgba(232, 160, 190, 0.32)");
  grad.addColorStop(0.65, "rgba(232, 180, 200, 0.1)");
  grad.addColorStop(1, "rgba(232, 180, 200, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Real pink-moon GLB hung in the sky, with a soft glow halo behind it. */
function PinkMoon() {
  const group = useRef<THREE.Group>(null);
  const moon = useSkyModel(researchWorldAssets.pinkMoon, 5.5);
  const glowTex = useMemo(glowSpriteTexture, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = 12 + Math.sin(t * 0.12) * 0.3;
    group.current.rotation.y = t * 0.02;
  });

  return (
    <group ref={group} position={[9, 12, -28]}>
      <sprite scale={[20, 20, 1]} position={[0, 0, -0.5]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          depthTest={false}
          fog={false}
        />
      </sprite>
      <primitive object={moon} />
    </group>
  );
}

/** Miyazaki-style zeppelin drifting slowly high above the trail. */
function SkyAirship() {
  const group = useRef<THREE.Group>(null);
  const ship = useSkyModel(researchWorldAssets.roseAirship, 8);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    // Slow oval drift high in the sky, ahead of the trail.
    group.current.position.set(
      Math.sin(t * 0.045) * 15,
      15 + Math.sin(t * 0.18) * 0.7,
      -24 + Math.cos(t * 0.045) * 5,
    );
    // Face roughly along the drift tangent + a gentle bank.
    group.current.rotation.y = Math.cos(t * 0.045) * 0.5 + Math.PI * 0.15;
    group.current.rotation.z = Math.sin(t * 0.09) * 0.05;
  });

  return (
    <group ref={group}>
      <primitive object={ship} />
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
      <SkyAirship />
    </group>
  );
}

useGLTF.preload(researchWorldAssets.pinkMoon);
useGLTF.preload(researchWorldAssets.roseAirship);
