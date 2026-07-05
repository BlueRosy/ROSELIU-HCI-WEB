import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { researchWorld, researchWorldAssets } from "../../content/site";
import { useSkyModel } from "./TrailTwilightSky";
import { SkyCityWaterfallSheets } from "./TrailRoseSea";

/** The floating rose sky-city (v2) that the visitor flies down from. */
const SKY_CITY_GLB = researchWorldAssets.skyCastle;

const PETAL_COLORS = ["#F5C4D8", "#F3B6CC", "#FADCE6", "#E8A0BC", "#FFF0F5"];
const PETAL_COUNT = 280;
const INTRO_GRADIENT =
  "linear-gradient(180deg, #FFF5F8 0%, #FFEDE8 45%, #FFE8DF 78%, #FFF0F5 100%)";

const petalGeometry = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.12, 0.22, 0.3, 0.34, 0, 0.52);
  s.bezierCurveTo(-0.3, 0.34, -0.12, 0.22, 0, 0);
  return new THREE.ShapeGeometry(s);
})();

/** Hero pink moon — slow rotation only (no sprite halo). */
function PinkMoon() {
  const group = useRef<THREE.Group>(null);
  const moon = useSkyModel(researchWorldAssets.pinkMoon, 3.6);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.025;
  });

  return (
    <group position={[-5.2, 4.3, -11]}>
      <group ref={group}>
        <primitive object={moon} />
      </group>
    </group>
  );
}

/** Lift GLB stone toward warm rose ivory — avoids the castle reading grey/dark. */
function applyWarmSkyTint(root: THREE.Object3D) {
  const warm = new THREE.Color("#FFF2EA");
  const emissive = new THREE.Color("#E8A8B8");
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      raw.color.lerp(warm, 0.16);
      raw.emissive.copy(emissive);
      raw.emissiveIntensity = 0.1;
      raw.metalness = Math.max(0, raw.metalness * 0.65);
      raw.roughness = Math.min(1, raw.roughness * 0.92 + 0.04);
      raw.needsUpdate = true;
    }
  });
}

/** The floating rose sky-city, centered so the fly-in framing stays consistent. */
function SkyCastle() {
  const castle = useSkyModel(SKY_CITY_GLB, 5);
  const model = useMemo(() => {
    const c = castle.clone(true);
    applyWarmSkyTint(c);
    return c;
  }, [castle]);
  return (
    <group>
      <primitive object={model} />
      <SkyCityWaterfallSheets />
    </group>
  );
}

/** Zeppelin (v2) drifting FAR in the distance so it reads much smaller than the
 * moon — a tiny silhouette crossing the far sky. */
function IntroAirship() {
  const group = useRef<THREE.Group>(null);
  const ship = useSkyModel(researchWorldAssets.roseAirship, 3);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.set(
      Math.sin(t * 0.045) * 12,
      5.5 + Math.sin(t * 0.18) * 0.4,
      -19 + Math.cos(t * 0.045) * 3,
    );
    group.current.rotation.y = Math.cos(t * 0.045) * 0.5 + Math.PI * 0.12;
    group.current.rotation.z = Math.sin(t * 0.09) * 0.04;
  });

  return (
    <group ref={group}>
      <primitive object={ship} />
    </group>
  );
}

/** Blossom snow — petals fluttering down across the whole sky. */
function FallingPetals() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );
  const data = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, () => ({
        x: (Math.random() - 0.5) * 26,
        y: Math.random() * 17 - 6,
        z: (Math.random() - 0.5) * 20 - 3,
        r: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ] as [number, number, number],
        fall: 0.4 + Math.random() * 0.7,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        scale: 0.14 + Math.random() * 0.18,
        spin: (Math.random() - 0.5) * 1.1,
      })),
    [],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    for (let i = 0; i < PETAL_COUNT; i++) {
      c.set(PETAL_COLORS[i % PETAL_COLORS.length]);
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = performance.now() * 0.001;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = data[i];
      p.y -= p.fall * delta;
      if (p.y < -7) {
        p.y = 10;
        p.x = (Math.random() - 0.5) * 26;
      }
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.7, p.y, p.z);
      dummy.rotation.set(p.r[0] + t * p.spin, p.r[1] + t * p.spin * 0.6, p.r[2]);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[petalGeometry, material, PETAL_COUNT]}
      frustumCulled={false}
    />
  );
}

/** Soft cloud shelf drifting beneath the city to sell the "above the clouds" feel. */
function Clouds() {
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return {
          pos: [
            Math.cos(a) * (2.8 + Math.random() * 1.8),
            -1.9 - Math.random() * 0.8,
            -2 + Math.sin(a) * 2.4,
          ] as [number, number, number],
          scale: 1.6 + Math.random() * 1.5,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <group ref={group}>
      {puffs.map((c, i) => (
        <mesh key={i} position={c.pos} scale={[c.scale, c.scale * 0.5, c.scale]}>
          <sphereGeometry args={[1, 14, 12]} />
          <meshStandardMaterial
            color="#FFFCFA"
            transparent
            opacity={0.38}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.6 + Math.PI * 0.05;
      const phi = Math.random() * Math.PI * 2;
      const r = 24;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(theta)) + 2;
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi) - 4;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#FFF5EE"
        size={0.18}
        transparent
        opacity={0.75}
        depthWrite={false}
        fog={false}
        sizeAttenuation
      />
    </points>
  );
}

function IntroScene({ zoom }: { zoom: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const city = useRef<THREE.Group>(null);
  const from = useMemo(() => new THREE.Vector3(0, 1.7, 8.2), []);
  const to = useMemo(() => new THREE.Vector3(0, 1.15, 2.1), []);

  useFrame((_, delta) => {
    const t = zoom.current;
    if (city.current) {
      city.current.rotation.y += delta * 0.18;
      city.current.position.y = Math.sin(performance.now() * 0.0005) * 0.18;
    }
    camera.position.lerpVectors(from, to, t);
    camera.lookAt(0, 0.9, 0);
    const targetFov = 46 + t * 22;
    if (Math.abs((camera as THREE.PerspectiveCamera).fov - targetFov) > 0.01) {
      (camera as THREE.PerspectiveCamera).fov = targetFov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  });

  return (
    <>
      <hemisphereLight args={["#FFF9F6", "#FFE4EA", 0.88]} />
      <ambientLight intensity={0.78} color="#FFF5F0" />
      <directionalLight position={[3, 10, 8]} intensity={1.4} color="#FFF8F2" />
      <directionalLight position={[-4, 5, 5]} intensity={0.58} color="#F5D0D8" />
      <pointLight position={[0, 2.5, 7]} intensity={0.55} color="#FFE8EE" distance={22} decay={2} />
      <PinkMoon />
      <Stars />
      <IntroAirship />
      <Clouds />
      <FallingPetals />
      <group ref={city}>
        <Suspense fallback={null}>
          <SkyCastle />
        </Suspense>
      </group>
    </>
  );
}

/** Isolated intro canvas — context-loss recovery keeps the sky city from dying. */
function SkyCityIntroCanvas({
  zoom,
}: {
  zoom: React.MutableRefObject<number>;
}) {
  const [canvasKey, setCanvasKey] = useState(0);
  const remounts = useRef(0);

  return (
    <Canvas
      key={canvasKey}
      camera={{ position: [0, 1.7, 8.2], fov: 46, near: 0.1, far: 80 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.setClearColor(0x000000, 0);
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          if (remounts.current >= 2) return;
          remounts.current += 1;
          window.setTimeout(() => setCanvasKey((k) => k + 1), 150);
        });
      }}
    >
      <Suspense fallback={null}>
        <IntroScene zoom={zoom} />
      </Suspense>
    </Canvas>
  );
}

export default function TrailSkyCityIntro({
  onEnter,
  onEnterStart,
}: {
  onEnter: () => void;
  onEnterStart?: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const zoom = useRef(0);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    // Let the parent raise the loading layer behind us right away, so as this
    // intro fades out the visitor sees the loader (not a white gap).
    onEnterStart?.();
    gsap.to(zoom, { current: 1, duration: 1.3, ease: "power2.inOut" });
    window.setTimeout(onEnter, 1250);
  };

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-[900ms] ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: INTRO_GRADIENT,
      }}
    >
      <SkyCityIntroCanvas zoom={zoom} />

      {/* bloom flash on enter */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#FFF6F0] transition-opacity duration-[1100ms] ${
          leaving ? "opacity-80" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center pb-[11vh] pt-32 text-center">
        <p className="sky-intro-eyebrow font-mono text-[0.68rem] uppercase sm:text-xs">
          {researchWorld.subtitle}
        </p>
        <h1 className="sky-intro-title mt-3 max-w-2xl px-6 font-serif text-4xl leading-[1.12] sm:text-[3.25rem]">
          {researchWorld.title}
        </h1>
        <p className="sky-intro-body mx-auto mt-3 max-w-md px-6 text-sm leading-relaxed sm:text-base">
          Welcome to Rose Liu&apos;s Research World — Enter to walk the research
          trail below.
        </p>
        <button
          type="button"
          onClick={handleEnter}
          disabled={leaving}
          className="sky-intro-cta pointer-events-auto mt-7 rounded-full px-8 py-3 font-serif text-lg transition-all hover:scale-[1.04] disabled:opacity-60"
        >
          {researchWorld.entryCta}
        </button>
      </div>
    </div>
  );
}

useGLTF.clear(researchWorldAssets.skyCastle);
useGLTF.preload(researchWorldAssets.skyCastle, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.pinkMoon, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.roseAirship, "/draco/gltf/");
