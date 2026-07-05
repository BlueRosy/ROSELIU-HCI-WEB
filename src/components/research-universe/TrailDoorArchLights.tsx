import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { doorCascadeT, sampleEntryCinematicCamera } from "./entryCinematic";
import { useUniverse } from "./UniverseContext";

/** Inner trim of garden door (world space; pavilion z=3.2 + door z=1.9). */
const ARCH_Z = 5.14;

const CASCADE_STAGGER = 0.075;
const CASCADE_WINDOW = 0.16;
/** Small festoon bulb — visible core only, no large halo. */
const BULB_CORE_RADIUS = 0.032;
const SOCKET_RADIUS = 0.022;
const LIGHT_PEAK = 0.09;

type ArchBulbSpec = {
  key: string;
  position: [number, number, number];
  order: number;
  peak: number;
};

const DOOR_ARCH_BULBS: ArchBulbSpec[] = [
  { key: "apex", position: [0, 3.48, ARCH_Z], order: 0, peak: 1 },

  { key: "arc-l-1", position: [-0.72, 3.42, ARCH_Z], order: 1, peak: 0.92 },
  { key: "arc-r-1", position: [0.72, 3.42, ARCH_Z], order: 1, peak: 0.92 },
  { key: "arc-l-2", position: [-1.12, 3.18, ARCH_Z], order: 2, peak: 0.86 },
  { key: "arc-r-2", position: [1.12, 3.18, ARCH_Z], order: 2, peak: 0.86 },
  { key: "arc-l-3", position: [-1.34, 2.88, ARCH_Z], order: 3, peak: 0.8 },
  { key: "arc-r-3", position: [1.34, 2.88, ARCH_Z], order: 3, peak: 0.8 },

  { key: "pillar-l-1", position: [-1.38, 2.42, ARCH_Z], order: 4, peak: 0.74 },
  { key: "pillar-r-1", position: [1.38, 2.42, ARCH_Z], order: 4, peak: 0.74 },
  { key: "pillar-l-2", position: [-1.34, 1.92, ARCH_Z], order: 5, peak: 0.66 },
  { key: "pillar-r-2", position: [1.34, 1.92, ARCH_Z], order: 5, peak: 0.66 },
  { key: "pillar-l-3", position: [-1.3, 1.42, ARCH_Z], order: 6, peak: 0.58 },
  { key: "pillar-r-3", position: [1.3, 1.42, ARCH_Z], order: 6, peak: 0.58 },
  { key: "pillar-l-4", position: [-1.26, 0.92, ARCH_Z], order: 7, peak: 0.5 },
  { key: "pillar-r-4", position: [1.26, 0.92, ARCH_Z], order: 7, peak: 0.5 },
  { key: "pillar-l-5", position: [-1.22, 0.55, ARCH_Z], order: 8, peak: 0.44 },
  { key: "pillar-r-5", position: [1.22, 0.55, ARCH_Z], order: 8, peak: 0.44 },
];

/** Festoon wire: left pillar → arch → apex → arch → right pillar. */
const WIRE_POINTS: [number, number, number][] = [
  [-1.22, 0.55, ARCH_Z - 0.02],
  [-1.26, 0.92, ARCH_Z - 0.02],
  [-1.3, 1.42, ARCH_Z - 0.02],
  [-1.34, 1.92, ARCH_Z - 0.02],
  [-1.38, 2.42, ARCH_Z - 0.02],
  [-1.34, 2.88, ARCH_Z - 0.02],
  [-1.12, 3.18, ARCH_Z - 0.02],
  [-0.72, 3.42, ARCH_Z - 0.02],
  [0, 3.48, ARCH_Z - 0.02],
  [0.72, 3.42, ARCH_Z - 0.02],
  [1.12, 3.18, ARCH_Z - 0.02],
  [1.34, 2.88, ARCH_Z - 0.02],
  [1.38, 2.42, ARCH_Z - 0.02],
  [1.34, 1.92, ARCH_Z - 0.02],
  [1.3, 1.42, ARCH_Z - 0.02],
  [1.26, 0.92, ARCH_Z - 0.02],
  [1.22, 0.55, ARCH_Z - 0.02],
];

const coreGeo = new THREE.SphereGeometry(BULB_CORE_RADIUS, 8, 8);
const socketGeo = new THREE.SphereGeometry(SOCKET_RADIUS, 6, 6);

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function archBulbCascadeIntensity(cascadeT: number, order: number, peak: number): number {
  const rowT = smoothstep01((cascadeT - order * CASCADE_STAGGER) / CASCADE_WINDOW);
  return rowT * peak;
}

function buildWireGeometry() {
  const curve = new THREE.CatmullRomCurve3(
    WIRE_POINTS.map((p) => new THREE.Vector3(...p)),
    false,
    "centripetal",
    0.2,
  );
  return new THREE.TubeGeometry(curve, 64, 0.006, 6, false);
}

export default function TrailDoorArchLights() {
  const {
    timeOfDay,
    reducedMotion,
    entryCinematicActive,
    entryCinematicDone,
    entryCinematicElapsed,
    entryCinematicPhase,
    invalidate,
  } = useUniverse();

  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);

  const wireGeo = useMemo(() => buildWireGeometry(), []);
  const warmCore = useMemo(() => new THREE.Color("#FFE4B8"), []);

  useFrame(() => {
    const phase = entryCinematicPhase.current;
    const cinematic = entryCinematicActive.current && !entryCinematicDone.current;
    const reduced = reducedMotion.current;
    const elapsed = entryCinematicElapsed.current;
    const done = entryCinematicDone.current;

    const camSample = cinematic || !done
      ? sampleEntryCinematicCamera(cinematic ? elapsed : 0, reduced)
      : null;
    const camZ = camSample?.position.z ?? 24;

    let cascadeT = doorCascadeT(camZ);
    if (reduced && cinematic && phase !== "framing" && phase !== "idle") {
      cascadeT = 1;
    }

    const nightMult = timeOfDay.current === "night" ? 1.25 : 1;
    const breathe = done ? 0.82 + Math.sin(elapsed * 0.38) * 0.08 : 1;

    if (wireMat.current) {
      wireMat.current.opacity = 0.28 + cascadeT * 0.22;
    }

    DOOR_ARCH_BULBS.forEach((spec, i) => {
      const core = coreRefs.current[i];
      const light = lightRefs.current[i];
      const lit = done
        ? spec.peak * breathe
        : archBulbCascadeIntensity(cascadeT, spec.order, spec.peak);

      const on = lit > 0.04;
      const coreOpacity = on ? Math.min(1, 0.55 + lit * 0.45) * nightMult : 0;

      if (core) {
        core.visible = on;
        const mat = core.material as THREE.MeshBasicMaterial;
        mat.opacity = coreOpacity;
        mat.color.copy(warmCore);
      }
      if (light) {
        light.intensity = on ? lit * LIGHT_PEAK * nightMult : 0;
        light.color.copy(warmCore);
      }
    });

    if (cinematic || done) invalidate.current();
  });

  return (
    <group>
      <mesh geometry={wireGeo} renderOrder={8}>
        <meshBasicMaterial
          ref={wireMat}
          color="#9A7A62"
          transparent
          opacity={0.28}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {DOOR_ARCH_BULBS.map((spec, i) => (
        <group key={spec.key} position={spec.position}>
          <mesh geometry={socketGeo} renderOrder={9}>
            <meshBasicMaterial
              color="#6A5048"
              transparent
              opacity={0.55}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh
            ref={(node) => {
              coreRefs.current[i] = node;
            }}
            geometry={coreGeo}
            visible={false}
            renderOrder={10}
          >
            <meshBasicMaterial
              color="#FFE4B8"
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            ref={(node) => {
              lightRefs.current[i] = node;
            }}
            color="#FFE4B8"
            intensity={0}
            distance={1.8}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
