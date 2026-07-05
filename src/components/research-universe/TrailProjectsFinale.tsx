import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroPetalPalette } from "../../theme/palette";
import { DISC_CENTER } from "../research-world/rwWorldConfig";
import { useUniverse } from "./UniverseContext";

const PETAL_COUNT = 80;
const SPARK_COUNT = 26;
const SPREAD = 8.5;
const SPARK_COLORS = ["#F4C89E", "#E9A279", "#F8DCC8", "#EAB78F", "#D98A6A"];

const petalGeometry = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.09, 0.2, 0.24, 0.3, 0, 0.46);
  shape.bezierCurveTo(-0.24, 0.3, -0.09, 0.2, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

const sparkGeometry = new THREE.CircleGeometry(0.07, 10);

type Petal = {
  x: number;
  y: number;
  z: number;
  fall: number;
  sway: number;
  spin: number;
  phase: number;
  rot: number;
  scale: number;
};

function makePetal(seedTop = false): Petal {
  const a = Math.random() * Math.PI * 2;
  const r = Math.random() * SPREAD;
  return {
    x: Math.cos(a) * r,
    z: Math.sin(a) * r,
    y: seedTop ? 4 + Math.random() * 7 : Math.random() * 11 - 1,
    fall: 0.5 + Math.random() * 0.8,
    sway: 0.4 + Math.random() * 0.8,
    spin: (Math.random() - 0.5) * 1.2,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    scale: 0.3 + Math.random() * 0.4,
  };
}

type Spark = {
  x: number;
  z: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  sway: number;
  phase: number;
  size: number;
};

function makeSpark(): Spark {
  const a = Math.random() * Math.PI * 2;
  const r = Math.random() * 3.6;
  const maxLife = 2.2 + Math.random() * 2.4;
  return {
    x: Math.cos(a) * r,
    z: Math.sin(a) * r,
    y: Math.random() * 1.2,
    vy: 1.0 + Math.random() * 1.5,
    life: Math.random() * maxLife,
    maxLife,
    sway: 0.3 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
    size: 0.7 + Math.random() * 1.2,
  };
}

/**
 * Projects "finale" over the tripod disc: dense drifting rose petals plus a few
 * rising rose-gold sparks. Both fade in only while the projects section is
 * active (driven by `showProjectCards`) and cost nothing otherwise.
 */
export default function TrailProjectsFinale() {
  const petalMesh = useRef<THREE.InstancedMesh>(null);
  const sparkMesh = useRef<THREE.InstancedMesh>(null);
  const { showProjectCards } = useUniverse();
  const vis = useRef(0);
  const colored = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petals = useMemo(
    () => Array.from({ length: PETAL_COUNT }, () => makePetal()),
    [],
  );
  const sparks = useMemo(
    () => Array.from({ length: SPARK_COUNT }, makeSpark),
    [],
  );

  const petalMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );
  const sparkMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useFrame((state, delta) => {
    const pm = petalMesh.current;
    const sm = sparkMesh.current;
    if (!pm || !sm) return;

    if (!colored.current) {
      const c = new THREE.Color();
      for (let i = 0; i < PETAL_COUNT; i++) {
        c.set(heroPetalPalette[i % heroPetalPalette.length]);
        pm.setColorAt(i, c);
      }
      if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
      for (let i = 0; i < SPARK_COUNT; i++) {
        c.set(SPARK_COLORS[i % SPARK_COLORS.length]);
        sm.setColorAt(i, c);
      }
      if (sm.instanceColor) sm.instanceColor.needsUpdate = true;
      colored.current = true;
    }

    const target = showProjectCards.current ? 1 : 0;
    vis.current += (target - vis.current) * Math.min(1, delta * 2.4);
    const v = vis.current;
    const on = v > 0.01;
    pm.visible = on;
    sm.visible = on;
    if (!on) return;

    petalMaterial.opacity = v * 0.55;
    sparkMaterial.opacity = v;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = petals[i];
      p.y -= p.fall * delta;
      if (p.y < -1) {
        Object.assign(p, makePetal(true));
      }
      dummy.position.set(
        p.x + Math.sin(t * p.sway + p.phase) * 0.6,
        p.y,
        p.z,
      );
      dummy.rotation.set(p.rot + t * p.spin, p.rot * 0.6, p.rot);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      pm.setMatrixAt(i, dummy.matrix);
    }
    pm.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = sparks[i];
      s.life += delta;
      s.y += s.vy * delta;
      if (s.life > s.maxLife) {
        Object.assign(s, makeSpark());
        s.y = 0;
        s.life = 0;
      }
      const fade = Math.sin((s.life / s.maxLife) * Math.PI);
      dummy.position.set(
        s.x + Math.sin(t * s.sway + s.phase) * 0.25,
        s.y,
        s.z,
      );
      dummy.lookAt(state.camera.position);
      dummy.scale.setScalar(Math.max(0.001, s.size * fade * 0.9));
      dummy.updateMatrix();
      sm.setMatrixAt(i, dummy.matrix);
    }
    sm.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[DISC_CENTER[0], 0.4, DISC_CENTER[2]]}>
      <instancedMesh
        ref={petalMesh}
        args={[petalGeometry, petalMaterial, PETAL_COUNT]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={sparkMesh}
        args={[sparkGeometry, sparkMaterial, SPARK_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}
