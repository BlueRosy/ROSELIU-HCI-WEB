import { Component, type ReactNode, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Shared, window-level pointer tracker so the head follows the cursor even when
 * the mouse is over the text column, not just over the canvas.
 * x / y are normalized to roughly [-1, 1].
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

// The exported mesh ships no material/texture, so give it a soft porcelain
// look that reads well against the light hero background.
const porcelain = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f3e7ea"),
  roughness: 0.62,
  metalness: 0.0,
  envMapIntensity: 0.6,
});

function AvatarModel({ src }: { src: string }) {
  // Second arg enables Draco decompression (model is Draco-compressed).
  const { scene } = useGLTF(src, true);
  const outer = useRef<THREE.Group>(null);
  const pointer = usePointer();

  // Center + normalize scale so the bust fits the frame regardless of export.
  const centered = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = m.material as THREE.MeshStandardMaterial | undefined;
        const hasTexture = Boolean(mat && (mat.map || mat.vertexColors));
        if (hasTexture) {
          // Textured/colored export: keep its own material, just tune lighting.
          if (mat) mat.envMapIntensity = 0.85;
        } else {
          // Geometry-only export: fall back to a soft porcelain look.
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
    const scale = 2.0 / maxDim;

    // Recenter to origin, then scale to a consistent size.
    root.position.set(-center.x, -center.y, -center.z);
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene]);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const targetY = pointer.current.x * 0.5;
    const targetX = pointer.current.y * 0.28;

    if (outer.current) {
      // No head bone in this mesh — gently turn the whole bust toward cursor.
      outer.current.rotation.y = THREE.MathUtils.damp(
        outer.current.rotation.y,
        targetY,
        5,
        delta,
      );
      outer.current.rotation.x = THREE.MathUtils.damp(
        outer.current.rotation.x,
        targetX,
        5,
        delta,
      );
      outer.current.position.y = Math.sin(t * 1.1) * 0.02;
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
          camera={{ position: [0, 0, 4], fov: 30 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          aria-hidden="true"
        >
          <hemisphereLight args={["#ffffff", "#d9c7d0", 0.7]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 3, 3]} intensity={1.6} />
          <directionalLight position={[-3, 1, 2]} intensity={0.6} color="#9bc0ff" />
          <AvatarModel src={src} />
        </Canvas>
      </div>
    </AvatarBoundary>
  );
}
