import { Component, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Shared, window-level pointer tracker so the avatar responds even when
 * the mouse is over the text column, not just over the canvas.
 */
function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pointer;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const porcelain = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f3e7ea"),
  roughness: 0.62,
  metalness: 0.0,
  envMapIntensity: 0.6,
});

function tuneMaterial(mat: THREE.MeshStandardMaterial) {
  mat.envMapIntensity = 0.55;
  mat.roughness = Math.min(mat.roughness, 0.72);
  // Scan exports often ship hot emissive maps — dial down for natural skin.
  if (mat.emissiveMap) {
    mat.emissiveIntensity = 0.08;
  } else {
    mat.emissiveIntensity = 0;
  }
}

function AvatarModel({ src }: { src: string }) {
  const { scene } = useGLTF(src, "/draco/gltf/");
  const outer = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const reducedMotion = useReducedMotion();

  const centered = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = m.material as THREE.MeshStandardMaterial | undefined;
        const hasTexture = Boolean(
          mat && (mat.map || mat.emissiveMap || mat.vertexColors),
        );
        if (hasTexture && mat) {
          tuneMaterial(mat);
        } else {
          m.material = porcelain;
        }
        m.castShadow = false;
        m.receiveShadow = false;
        m.frustumCulled = false;
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.95 / maxDim;

    root.position.set(-center.x, -center.y + size.y * 0.04, -center.z);
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene]);

  useFrame((_, delta) => {
    if (!outer.current) return;

    const t = performance.now() / 1000;

    if (!reducedMotion) {
      // Idle: float, sway, and a soft turn.
      outer.current.position.y = Math.sin(t * 1.85) * 0.038;
      outer.current.rotation.z = Math.sin(t * 0.85) * 0.058;

      // Mouse parallax plus gentle idle turn.
      const targetY = pointer.current.x * 0.19 + Math.sin(t * 0.55) * 0.045;
      const targetX = pointer.current.y * 0.12;
      outer.current.rotation.y = THREE.MathUtils.damp(
        outer.current.rotation.y,
        targetY,
        4,
        delta,
      );
      outer.current.rotation.x = THREE.MathUtils.damp(
        outer.current.rotation.x,
        targetX,
        4,
        delta,
      );
    }
  });

  return (
    <group ref={outer} dispose={null}>
      <primitive object={centered} />
    </group>
  );
}

class AvatarBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function Avatar3D({
  src,
  fallback,
}: {
  src: string;
  fallback: ReactNode;
}) {
  return (
    <AvatarBoundary fallback={fallback}>
      <div className="aspect-square w-full">
        <Canvas
          camera={{ position: [0, 0.05, 4.65], fov: 34 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          aria-hidden="true"
        >
          <hemisphereLight args={["#ffffff", "#d4ebfa", 0.85]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 4, 3]} intensity={1.2} color="#f4faff" />
          <directionalLight position={[-2, 2, 2]} intensity={0.45} color="#a8d8f0" />
          <directionalLight position={[0, -1, 2]} intensity={0.12} color="#9DD9D9" />
          <AvatarModel src={src} />
        </Canvas>
      </div>
    </AvatarBoundary>
  );
}
