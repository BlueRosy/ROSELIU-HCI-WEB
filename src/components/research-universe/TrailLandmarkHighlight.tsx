import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLINTH_HEIGHT } from "../research-world/RWMilestoneBase";
import { LANDMARK_BY_ZONE } from "../research-world/rwWorldConfig";
import {
  LANDMARK_FOCUS_ARRIVE_DUR,
  landmarkFocus,
  landmarkGlowBoost,
} from "./landmarkFocus";
import { useUniverse } from "./UniverseContext";
import { zoneFromSection, type ScrollSection } from "./worldTrailConfig";

const PLINTH_ZONES = ["signals", "states", "support"] as const;

const ZONE_ACCENT: Record<(typeof PLINTH_ZONES)[number], string> = {
  signals: "#8A9275",
  states: "#C4848F",
  support: "#B9786F",
};

const PLINTH_RADIUS = 2.3;

const LANDMARK_SECTIONS = new Set<ScrollSection>(["signals", "states", "support", "loop"]);

function PlinthRingGlow({
  zoneId,
  position,
  accent,
}: {
  zoneId: (typeof PLINTH_ZONES)[number];
  position: [number, number, number];
  accent: string;
}) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const { activeSection, entryCinematicDone } = useUniverse();

  useFrame(() => {
    if (!mat.current) return;
    if (!entryCinematicDone.current) {
      mat.current.opacity = 0;
      if (light.current) light.current.intensity = 0;
      return;
    }

    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const boost = landmarkGlowBoost(zoneId, zone, strength, arrive);

    mat.current.color.set(accent);
    mat.current.opacity = boost > 0.02 ? 0.1 + boost * 0.38 : 0;

    if (light.current) {
      light.current.intensity = boost * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh
        position={[0, PLINTH_HEIGHT + 0.008, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={4}
      >
        <ringGeometry args={[PLINTH_RADIUS - 0.14, PLINTH_RADIUS + 0.06, 56]} />
        <meshBasicMaterial
          ref={mat}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 1.6, 0]}
        color={accent}
        intensity={0}
        distance={9}
        decay={2}
      />
    </group>
  );
}

function GroundMotes({
  zoneId,
  position,
  accent,
}: {
  zoneId: (typeof PLINTH_ZONES)[number];
  position: [number, number, number];
  accent: string;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const { activeSection, entryCinematicDone } = useUniverse();
  const positions = useMemo(() => {
    const arr = new Float32Array(10 * 3);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const r = 0.4 + Math.random() * 1.4;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.random() * 0.25;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current || !mat.current) return;
    if (!entryCinematicDone.current) {
      mat.current.opacity = 0;
      return;
    }

    const zone = zoneFromSection(activeSection.current);
    const { strength, arrive } = landmarkFocus.current;
    const boost = landmarkGlowBoost(zoneId, zone, strength, arrive);
    const t = clock.getElapsedTime();

    mat.current.opacity = boost * 0.28;
    mat.current.size = 0.04 + boost * 0.022;
    points.current.position.y = 0.06 + boost * 0.1 + Math.sin(t * 1.6) * 0.015 * boost;
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color={accent}
        size={0.04}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export default function TrailLandmarkHighlight() {
  const { activeSection, entryCinematicDone } = useUniverse();
  const arriveTimer = useRef(0);
  const strengthRef = useRef(0);
  const lastLanded = useRef<ScrollSection>("hero");

  useFrame((_, delta) => {
    if (!entryCinematicDone.current) {
      landmarkFocus.current = { section: "hero", strength: 0, arrive: 0 };
      lastLanded.current = "hero";
      return;
    }

    const section = activeSection.current;
    if (section !== lastLanded.current) {
      arriveTimer.current = LANDMARK_FOCUS_ARRIVE_DUR;
      lastLanded.current = section;
    }

    arriveTimer.current = Math.max(0, arriveTimer.current - delta);
    const arriveRaw = arriveTimer.current > 0 ? arriveTimer.current / LANDMARK_FOCUS_ARRIVE_DUR : 0;
    const arrive = Math.sin((1 - arriveRaw) * Math.PI * 0.5);

    const isLandmark = LANDMARK_SECTIONS.has(section);
    const targetStrength = isLandmark ? 1 : 0;
    strengthRef.current += (targetStrength - strengthRef.current) * Math.min(1, delta * 3);

    landmarkFocus.current = {
      section,
      strength: strengthRef.current,
      arrive,
    };
  });

  return (
    <group>
      {PLINTH_ZONES.map((zoneId) => {
        const lm = LANDMARK_BY_ZONE[zoneId];
        const accent = ZONE_ACCENT[zoneId];
        return (
          <group key={zoneId}>
            <PlinthRingGlow zoneId={zoneId} position={lm.position} accent={accent} />
            <GroundMotes zoneId={zoneId} position={lm.position} accent={accent} />
          </group>
        );
      })}
    </group>
  );
}
