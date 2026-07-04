import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { researchWorld } from "../../content/site";
import { palette } from "../../theme/palette";
import TrailModel from "./TrailModel";

/**
 * When a bespoke floating "Sky Rose City" GLB is generated, drop its compressed
 * path here and it replaces the procedural placeholder automatically.
 * e.g. "/research-world-elements/new-landmarks/sky-rose-city.glb"
 */
const SKY_CITY_GLB = "";

const CREAM = "#F8F1E8";
const IVORY = "#FFFCF7";
const ROSE = "#D4A59E";
const ROSE_DEEP = palette.primary;
const SAGE = palette.sage;

/** Procedural stand-in: tiered floating island with a central rose dome. */
function PlaceholderCity() {
  const petals = useMemo(() => {
    const arr: { angle: number; radius: number; y: number; scale: number }[] = [];
    for (let i = 0; i < 26; i++) {
      arr.push({
        angle: (i / 26) * Math.PI * 2,
        radius: 1.6 + Math.random() * 1.4,
        y: 0.4 + Math.random() * 1.6,
        scale: 0.06 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* tapered rock base (floating point downward) */}
      <mesh position={[0, -1.35, 0]}>
        <coneGeometry args={[1.9, 2.8, 10]} />
        <meshStandardMaterial color={CREAM} roughness={0.85} flatShading />
      </mesh>
      {/* garden terraces */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.15, 1.9, 0.4, 24]} />
        <meshStandardMaterial color={CREAM} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[1.55, 2.05, 0.35, 24]} />
        <meshStandardMaterial color={IVORY} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.05, 1.5, 0.3, 24]} />
        <meshStandardMaterial color={CREAM} roughness={0.6} />
      </mesh>
      {/* terrace edge blooms */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.85, 0.32, Math.sin(a) * 1.85]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 ? ROSE : ROSE_DEEP}
              emissive={ROSE}
              emissiveIntensity={0.25}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      {/* central dome pavilion (echoes the entry dome) */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={IVORY}
          emissive={ROSE}
          emissiveIntensity={0.3}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      {/* dome pillars */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.78, 0.7, Math.sin(a) * 0.78]}>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
            <meshStandardMaterial color={IVORY} roughness={0.5} />
          </mesh>
        );
      })}
      {/* dome finial */}
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={ROSE_DEEP} emissive={ROSE} emissiveIntensity={0.6} />
      </mesh>
      {/* hanging vines off the underside */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r = 1.6;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, -0.9, Math.sin(a) * r]}
          >
            <cylinderGeometry args={[0.03, 0.01, 1.4 + (i % 3) * 0.4, 5]} />
            <meshStandardMaterial color={SAGE} roughness={0.8} />
          </mesh>
        );
      })}
      {/* orbiting petals */}
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.radius,
            p.y,
            Math.sin(p.angle) * p.radius,
          ]}
          scale={p.scale}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color={i % 2 ? ROSE : ROSE_DEEP} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function PinkMoon() {
  const glowTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(247, 200, 220, 0.9)");
    grad.addColorStop(0.4, "rgba(232, 160, 190, 0.35)");
    grad.addColorStop(1, "rgba(232, 180, 200, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group position={[-4.5, 3.6, -8]}>
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} depthTest={false} />
      </sprite>
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color="#F5C4D8" toneMapped={false} />
      </mesh>
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
      <ambientLight intensity={0.7} color="#FFF6EE" />
      <directionalLight position={[4, 8, 6]} intensity={1.1} color="#FFF3E8" />
      <directionalLight position={[-5, 3, -4]} intensity={0.4} color={ROSE} />
      <PinkMoon />
      <Stars />
      <group ref={city}>
        {SKY_CITY_GLB ? (
          <TrailModel url={SKY_CITY_GLB} position={[0, 0, 0]} targetY={3.4} />
        ) : (
          <PlaceholderCity />
        )}
      </group>
    </>
  );
}

export default function TrailSkyCityIntro({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const zoom = useRef(0);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
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
          A floating rose city above the clouds — enter to walk the research
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
