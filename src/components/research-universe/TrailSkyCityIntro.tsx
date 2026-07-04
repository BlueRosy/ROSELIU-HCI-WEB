import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { researchWorld, researchWorldAssets } from "../../content/site";
import { useSkyModel } from "./TrailTwilightSky";

/** The floating rose sky-city (v2) that the visitor flies down from. */
const SKY_CITY_GLB = researchWorldAssets.skyCastle;

const ROSE = "#D4A59E";
const PETAL_COLORS = ["#F5C4D8", "#F3B6CC", "#FADCE6", "#E8A0BC", "#FFF0F5"];
const PETAL_COUNT = 280;

const petalGeometry = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.12, 0.22, 0.3, 0.34, 0, 0.52);
  s.bezierCurveTo(-0.3, 0.34, -0.12, 0.22, 0, 0);
  return new THREE.ShapeGeometry(s);
})();

/** Hero pink moon (v2) with a soft glow halo, hung upper-left in the sky. */
function PinkMoon() {
  const group = useRef<THREE.Group>(null);
  const glowTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(247, 200, 220, 0.9)");
    grad.addColorStop(0.4, "rgba(232, 160, 190, 0.34)");
    grad.addColorStop(1, "rgba(232, 180, 200, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const moon = useSkyModel(researchWorldAssets.pinkMoon, 3.6);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <group position={[-5.2, 4.3, -11]}>
      <sprite scale={[13, 13, 1]} position={[0, 0, -0.5]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} depthTest={false} />
      </sprite>
      <group ref={group}>
        <primitive object={moon} />
      </group>
    </group>
  );
}

/** The floating rose sky-city, centered so the fly-in framing stays consistent. */
function SkyCastle() {
  const castle = useSkyModel(SKY_CITY_GLB, 5);
  return <primitive object={castle} />;
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
            color="#FFFBF6"
            transparent
            opacity={0.5}
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

/** Soft volumetric moonlight — a translucent cone spilling from the moon. */
function MoonlightShaft() {
  return (
    <group position={[-5.2, 4.3, -11]} rotation={[0.42, 0, 0.34]}>
      <mesh position={[0, -6.5, 0]}>
        <coneGeometry args={[5.5, 13, 28, 1, true]} />
        <meshBasicMaterial
          color="#FCE6F0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
      <mesh position={[0, -6.5, 0]} scale={0.6}>
        <coneGeometry args={[5.5, 13, 28, 1, true]} />
        <meshBasicMaterial
          color="#FFF0F6"
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
    </group>
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
      <hemisphereLight args={["#FFF3F8", "#E7C8D2", 0.6]} />
      <ambientLight intensity={0.55} color="#FFF6EE" />
      <directionalLight position={[4, 8, 6]} intensity={1.15} color="#FFF3E8" />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color={ROSE} />
      <PinkMoon />
      <MoonlightShaft />
      <Stars />
      <IntroAirship />
      <Clouds />
      <FallingPetals />
      <group ref={city}>
        <SkyCastle />
      </group>
    </>
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
        background:
          "linear-gradient(180deg, #F3D9E4 0%, #FBEFE6 45%, #F6E4D4 78%, #EFD6C4 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 1.7, 8.2], fov: 46, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <IntroScene zoom={zoom} />
      </Canvas>

      {/* bloom flash on enter */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#FFF6F0] transition-opacity duration-[1100ms] ${
          leaving ? "opacity-80" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[16vh] text-center sm:justify-center sm:pb-0">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary/80">
          {researchWorld.subtitle}
        </p>
        <h1 className="mt-4 max-w-2xl px-6 font-serif text-4xl leading-tight text-ink drop-shadow-sm sm:text-6xl">
          {researchWorld.title}
        </h1>
        <p className="mt-4 max-w-md px-6 text-sm leading-relaxed text-slate sm:text-base">
          A floating rose castle above the clouds — enter to walk the research
          trail below.
        </p>
        <button
          type="button"
          onClick={handleEnter}
          disabled={leaving}
          className="pointer-events-auto mt-8 rounded-full border border-primary/30 bg-white/70 px-8 py-3 font-serif text-lg text-ink shadow-lift backdrop-blur-md transition-all hover:scale-[1.04] hover:bg-white/90 disabled:opacity-60"
        >
          {researchWorld.entryCta}
        </button>
      </div>
    </div>
  );
}

useGLTF.preload(researchWorldAssets.skyCastle);
useGLTF.preload(researchWorldAssets.pinkMoon);
useGLTF.preload(researchWorldAssets.roseAirship);
