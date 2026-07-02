import * as THREE from "three";
import { LANDMARK_BY_ZONE, PATH_POINTS } from "../research-world/rwWorldConfig";

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
  pathT: number;
  lookAt: [number, number, number];
  zoneId: string;
};

export const TRAIL_STOPS: TrailStop[] = [
  {
    section: "hero",
    pathT: 0.04,
    lookAt: [0, 1.5, 4],
    zoneId: "entry",
  },
  {
    section: "signals",
    pathT: 0.28,
    lookAt: LANDMARK_BY_ZONE.signals.position,
    zoneId: "signals",
  },
  {
    section: "states",
    pathT: 0.48,
    lookAt: LANDMARK_BY_ZONE.states.position,
    zoneId: "states",
  },
  {
    section: "support",
    pathT: 0.68,
    lookAt: LANDMARK_BY_ZONE.support.position,
    zoneId: "support",
  },
  {
    section: "loop",
    pathT: 0.88,
    lookAt: LANDMARK_BY_ZONE.loop.position,
    zoneId: "loop",
  },
  {
    section: "projects",
    pathT: 0.96,
    lookAt: [0, 1.8, -14],
    zoneId: "projects",
  },
];

const _point = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _cam = new THREE.Vector3();
const _look = new THREE.Vector3();
const _elev = new THREE.Vector3(0, 3.2, 0);

export type TrailCameraSample = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  activeZone: string;
  showProjects: boolean;
};

export function sampleTrailCamera(progress: number): TrailCameraSample {
  const n = TRAIL_STOPS.length - 1;
  const scaled = progress * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const t = scaled - i;
  const a = TRAIL_STOPS[i];
  const b = TRAIL_STOPS[i + 1];

  const pathT = a.pathT + (b.pathT - a.pathT) * t;
  TRAIL_CURVE.getPointAt(pathT, _point);
  TRAIL_CURVE.getTangentAt(pathT, _tangent);
  _tangent.y = 0;
  if (_tangent.lengthSq() > 0.0001) _tangent.normalize();

  _cam.copy(_point).addScaledVector(_tangent, -4.2).add(_elev);

  _look.set(
    a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * t,
    a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * t + 1.2,
    a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * t,
  );

  if (b.section === "projects" && t > 0.35) {
    _cam.set(0, 5.5, 6);
    _look.set(0, 0.5, -12);
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
