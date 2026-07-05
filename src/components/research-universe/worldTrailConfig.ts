import * as THREE from "three";
import {
  DISC_CENTER,
  DISC_RADIUS,
  LANDMARK_BY_ZONE,
  PATH_POINTS,
} from "../research-world/rwWorldConfig";

export const TRAIL_CURVE = new THREE.CatmullRomCurve3(
  PATH_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const SCROLL_SECTIONS = [
  "hero",
  "signals",
  "states",
  "support",
  "loop",
  "projects",
] as const;

export type ScrollSection = (typeof SCROLL_SECTIONS)[number];

export type TrailStop = {
  section: ScrollSection;
  camPos: [number, number, number];
  lookAt: [number, number, number];
  zoneId: string;
  /** When set, camera orbits DISC_CENTER at this radius (tripod arc). */
  orbitAngle?: number;
  orbitHeight?: number;
};

const ORBIT_R = DISC_RADIUS + 3.2;
const [CX, , CZ] = DISC_CENTER;

function landmarkAngle(zoneId: string): number {
  const lm = LANDMARK_BY_ZONE[zoneId];
  if (!lm) return 0;
  return Math.atan2(lm.position[0] - CX, lm.position[2] - CZ);
}

function orbitCam(angle: number, height: number): [number, number, number] {
  return [CX + Math.sin(angle) * ORBIT_R, height, CZ + Math.cos(angle) * ORBIT_R];
}

function landmarkLook(zoneId: string): [number, number, number] {
  const lm = LANDMARK_BY_ZONE[zoneId];
  if (!lm) return [CX, 1.2, CZ];
  return [lm.position[0], 1.4, lm.position[2]];
}

export const TRAIL_STOPS: TrailStop[] = [
  {
    section: "hero",
    camPos: [0, 4.8, 2.6],
    lookAt: [0, 1.0, -8.2],
    zoneId: "entry",
  },
  {
    section: "signals",
    ...(() => {
      const a = landmarkAngle("signals");
      return {
        camPos: orbitCam(a, 3.9),
        lookAt: landmarkLook("signals"),
        zoneId: "signals",
        orbitAngle: a,
        orbitHeight: 3.9,
      };
    })(),
  },
  {
    section: "states",
    ...(() => {
      const a = landmarkAngle("states");
      return {
        camPos: orbitCam(a, 4.4),
        lookAt: landmarkLook("states"),
        zoneId: "states",
        orbitAngle: a,
        orbitHeight: 4.4,
      };
    })(),
  },
  {
    section: "support",
    ...(() => {
      const a = landmarkAngle("support");
      return {
        camPos: orbitCam(a, 3.9),
        lookAt: landmarkLook("support"),
        zoneId: "support",
        orbitAngle: a,
        orbitHeight: 3.9,
      };
    })(),
  },
  {
    section: "loop",
    camPos: [CX, 10.5, CZ + 11.5],
    lookAt: [CX, 0.3, CZ],
    zoneId: "loop",
  },
  {
    section: "projects",
    camPos: [0, 13, 6.5],
    lookAt: [0, 0.2, CZ - 0.5],
    zoneId: "projects",
  },
];

const _cam = new THREE.Vector3();
const _look = new THREE.Vector3();

export type TrailCameraSample = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  activeZone: string;
  showProjects: boolean;
};

function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerpAngle(a: number, b: number, t: number): number {
  let delta = b - a;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return a + delta * t;
}

function sampleOrbitSegment(
  a: TrailStop,
  b: TrailStop,
  te: number,
  outCam: THREE.Vector3,
  outLook: THREE.Vector3,
) {
  const angA = a.orbitAngle ?? 0;
  const angB = b.orbitAngle ?? 0;
  const hA = a.orbitHeight ?? 3.9;
  const hB = b.orbitHeight ?? 3.9;
  const ang = lerpAngle(angA, angB, te);
  const h = hA + (hB - hA) * te;
  outCam.set(CX + Math.sin(ang) * ORBIT_R, h, CZ + Math.cos(ang) * ORBIT_R);
  outLook.set(
    a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * te,
    a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * te,
    a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * te,
  );
}

export function sampleTrailCamera(progress: number): TrailCameraSample {
  const n = TRAIL_STOPS.length - 1;
  const scaled = progress * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const t = scaled - i;
  const te = smootherstep(t);
  const a = TRAIL_STOPS[i];
  const b = TRAIL_STOPS[i + 1];

  const useOrbitArc =
    a.orbitAngle != null &&
    b.orbitAngle != null &&
    a.section !== "hero" &&
    b.section !== "loop" &&
    b.section !== "projects";

  if (useOrbitArc) {
    sampleOrbitSegment(a, b, te, _cam, _look);
  } else {
    _cam.set(
      a.camPos[0] + (b.camPos[0] - a.camPos[0]) * te,
      a.camPos[1] + (b.camPos[1] - a.camPos[1]) * te,
      a.camPos[2] + (b.camPos[2] - a.camPos[2]) * te,
    );
    _look.set(
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * te,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * te,
      a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * te,
    );
  }

  const activeZone = t < 0.5 ? a.zoneId : b.zoneId;
  const showProjects = b.section === "projects" && t > 0.25;

  return {
    position: _cam,
    lookAt: _look,
    activeZone,
    showProjects,
  };
}

export const TRAIL_STOP_LABELS: Record<ScrollSection, string> = {
  hero: "Entry",
  signals: "Signals",
  states: "States",
  support: "Support",
  loop: "Loop",
  projects: "Projects",
};

/** Scroll section → 3D zone id (discrete stops, not camera blend midpoint). */
export const SECTION_ZONE_ID: Record<ScrollSection, string> = {
  hero: "entry",
  signals: "signals",
  states: "states",
  support: "support",
  loop: "loop",
  projects: "projects",
};

export function zoneFromSection(section: ScrollSection): string {
  return SECTION_ZONE_ID[section];
}
