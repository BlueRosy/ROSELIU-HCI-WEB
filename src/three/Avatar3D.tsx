import { Component, type ReactNode, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
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

function AvatarModel({ src }: { src: string }) {
  const { scene, animations } = useGLTF(src);
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);
  const pointer = usePointer();

  // Auto-frame: center the model and lift it so the head sits in view.
  const { centered, headBone } = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = o as THREE.Mesh;
        m.castShadow = false;
        m.receiveShadow = false;
        m.frustumCulled = false;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Recenter horizontally/depth; keep vertical so we can target the head.
    root.position.x -= center.x;
    root.position.z -= center.z;

    let head: THREE.Object3D | null = null;
    root.traverse((o) => {
      if (!head && /head/i.test(o.name)) head = o;
    });
    return { centered: root, headBone: head as THREE.Object3D | null };
  }, [scene]);

  // Frame the head: position the whole group so the head is near origin/eye level.
  const baseRot = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (headBone) {
      baseRot.current.x = headBone.rotation.x;
      baseRot.current.y = headBone.rotation.y;
    }
    // Play first available clip (idle), if the model ships one.
    const first = Object.values(actions)[0];
    first?.reset().fadeIn(0.4).play();
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions, headBone]);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const targetY = pointer.current.x * 0.6;
    const targetX = pointer.current.y * 0.35;

    if (headBone) {
      headBone.rotation.y = THREE.MathUtils.damp(
        headBone.rotation.y,
        baseRot.current.y + targetY,
        6,
        delta,
      );
      headBone.rotation.x = THREE.MathUtils.damp(
        headBone.rotation.x,
        baseRot.current.x + targetX,
        6,
        delta,
      );
    } else if (group.current) {
      // No head bone: gently turn the whole model toward the cursor.
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetY,
        6,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetX,
        6,
        delta,
      );
    }

    // Subtle idle breathing / float on the whole group.
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.1) * 0.015;
    }
  });

  return (
    <group ref={group} dispose={null}>
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
          camera={{ position: [0, 1.55, 0.85], fov: 28 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          aria-hidden="true"
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1.4} />
          <directionalLight position={[-2, 1, 1]} intensity={0.5} color="#bcd4ff" />
          <AvatarModel src={src} />
        </Canvas>
      </div>
    </AvatarBoundary>
  );
}
