import * as THREE from "three";
import {
  DISC_CENTER,
  DISC_RADIUS,
  LANDMARK_BY_ZONE,
  LANDMARKS,
  PATH_POINTS,
} from "../research-world/rwWorldConfig";

export const GARDEN_CX = DISC_CENTER[0];
export const GARDEN_CZ = DISC_CENTER[2];

/** South-facing entry opening in the C-shaped garden (radians from +Z). */
export const ENTRY_GAP_HALF = 0.24;
export const C_GARDEN_R = DISC_RADIUS + 3.45;
export const C_GARDEN_TREE_STEP = 0.38;
export const C_GARDEN_LOW_STEP = 0.22;

/** Hero / entry apron — no tall trees. */
export const ENTRY_APRON = {
  zMin: 2.6,
  xMax: 3.6,
} as const;

/** Central disc whitespace for the loop core infinity symbol. */
export const CENTER_CLEAR_R = 4.0;

/** Per-landmark garden island radius. */
export const ISLAND_R = 4.2;

export const ENTRY_ARCH = {
  z: 5.05,
  flankX: 1.55,
} as const;

export type ScatterTree = {
  position: [number, number, number];
  scale: number;
  rot: number;
};

export type ScatterVine = {
  position: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

export type RoseCluster = {
  position: [number, number, number];
  scale: number;
};

export type NarrativePathKind = "petal" | "dots" | "vine" | "loopRing";

export type NarrativePathDef = {
  id: string;
  kind: NarrativePathKind;
  points: [number, number, number][];
  width?: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function lmPos(zoneId: string): [number, number, number] {
  const lm = LANDMARK_BY_ZONE[zoneId];
  return lm ? lm.position : [0, 0, 0];
}

export function inEntryApron(x: number, z: number): boolean {
  return z > ENTRY_APRON.zMin && Math.abs(x) < ENTRY_APRON.xMax;
}

export function inCenterClear(x: number, z: number): boolean {
  const dx = x - GARDEN_CX;
  const dz = z - GARDEN_CZ;
  return Math.sqrt(dx * dx + dz * dz) < CENTER_CLEAR_R;
}

export function inPathCorridor(x: number, z: number): boolean {
  return Math.abs(x) < 1.25 && z > 0.2 && z < 5.4;
}

export function nearLandmarkIsland(x: number, z: number, extra = 0): boolean {
  for (const lm of LANDMARKS) {
    const dx = x - lm.position[0];
    const dz = z - lm.position[2];
    if (Math.sqrt(dx * dx + dz * dz) < ISLAND_R + extra) return true;
  }
  return false;
}

export function shouldExcludeScatter(x: number, z: number): boolean {
  if (inEntryApron(x, z)) return true;
  if (inPathCorridor(x, z)) return true;
  if (inCenterClear(x, z)) return true;
  return false;
}

function onGardenArc(
  angle: number,
  radius: number,
  seed: number,
): [number, number, number] {
  const jitterA = (seededRandom(seed * 3.1) - 0.5) * 0.04;
  const jitterR = (seededRandom(seed * 5.7) - 0.5) * 0.28;
  const a = angle + jitterA;
  const r = radius + jitterR;
  return [GARDEN_CX + Math.sin(a) * r, 0, GARDEN_CZ + Math.cos(a) * r];
}

/** C-shaped outer garden: sparse tall trees + low vines/flowers on the arc. */
export function buildCGardenBoundary(seedStart = 0) {
  const trees: ScatterTree[] = [];
  const vines: ScatterVine[] = [];
  const roseClusters: RoseCluster[] = [];
  let seed = seedStart;

  for (let a = ENTRY_GAP_HALF; a < Math.PI * 2 - ENTRY_GAP_HALF; a += C_GARDEN_TREE_STEP) {
    const [x, , z] = onGardenArc(a, C_GARDEN_R, seed++);
    if (shouldExcludeScatter(x, z)) continue;
    trees.push({
      position: [x, 0, z],
      scale: 0.58 + seededRandom(seed * 2.1) * 0.24,
      rot: a + Math.PI + (seededRandom(seed * 1.7) - 0.5) * 0.3,
    });
  }

  for (let a = ENTRY_GAP_HALF; a < Math.PI * 2 - ENTRY_GAP_HALF; a += C_GARDEN_LOW_STEP) {
    const [x, , z] = onGardenArc(a, C_GARDEN_R + 0.55, seed++);
    if (shouldExcludeScatter(x, z)) continue;
    if (seed % 2 === 0) {
      vines.push({
        position: [x, 0, z],
        rot: [0, a + (seededRandom(seed * 4.2) - 0.5) * 0.4, 0],
        scale: 0.38 + seededRandom(seed * 6.1) * 0.16,
      });
    }
    if (seed % 3 === 0) {
      roseClusters.push({
        position: [x, 0.04, z],
        scale: 0.32 + seededRandom(seed * 4.2) * 0.18,
      });
    }
  }

  return { trees, vines, roseClusters, nextSeed: seed };
}

/** Entry accent: one tall tree per arch flank only. */
export function buildEntryAccents() {
  const trees: ScatterTree[] = [];
  for (const side of [-1, 1] as const) {
    trees.push({
      position: [side * ENTRY_ARCH.flankX, 0, ENTRY_ARCH.z],
      scale: 0.64 + seededRandom(side * 7.1) * 0.18,
      rot: side * 0.4,
    });
  }
  return trees;
}

/** Low flower beds around each tripod landmark. */
export function buildLandmarkIslands(seedStart = 0) {
  const roseClusters: RoseCluster[] = [];
  const vines: ScatterVine[] = [];
  let seed = seedStart;

  for (const lm of LANDMARKS.filter((l) => l.id !== "loop")) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + seededRandom(seed * 2.3) * 0.4;
      const r = 2.2 + seededRandom(seed * 5.1) * 1.6;
      const x = lm.position[0] + Math.sin(a) * r;
      const z = lm.position[2] + Math.cos(a) * r;
      if (inCenterClear(x, z)) continue;
      roseClusters.push({
        position: [x, 0.04, z],
        scale: 0.28 + seededRandom(seed++ * 3.2) * 0.16,
      });
      if (seed % 3 === 0) {
        vines.push({
          position: [x + 0.15, 0, z],
          rot: [0, a, 0],
          scale: 0.32 + seededRandom(seed * 4.4) * 0.12,
        });
      }
    }
  }

  return { roseClusters, vines, nextSeed: seed };
}

function arcPoints(
  from: [number, number, number],
  to: [number, number, number],
  bulge: number,
  segments = 6,
): [number, number, number][] {
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2 + bulge,
    0,
    (from[2] + to[2]) / 2,
  ];
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...from),
    new THREE.Vector3(...mid),
    new THREE.Vector3(...to),
  );
  return curve.getPoints(segments).map((p) => [p.x, 0, p.z] as [number, number, number]);
}

/** Four narrative connectors between entry, tripod vertices, and loop. */
export function buildNarrativePaths(): NarrativePathDef[] {
  const entry = PATH_POINTS[0];
  const signals = lmPos("signals");
  const states = lmPos("states");
  const support = lmPos("support");
  const loop = lmPos("loop");
  const discSouth: [number, number, number] = [0, 0, GARDEN_CZ + DISC_RADIUS * 0.55];

  return [
    {
      id: "entry-signals",
      kind: "petal",
      points: [entry, [0, 0, 3.5], discSouth, signals],
      width: 0.55,
    },
    {
      id: "signals-states",
      kind: "dots",
      points: arcPoints(signals, states, -1.8, 8),
      width: 0.35,
    },
    {
      id: "states-support",
      kind: "vine",
      points: arcPoints(states, support, 2.2, 8),
      width: 0.4,
    },
    {
      id: "tripod-loop",
      kind: "loopRing",
      points: [signals, loop, support, states, signals],
      width: 0.3,
    },
  ];
}

export function samplePathEdgePoints(
  path: NarrativePathDef,
  spacing: number,
  sideOffset: number,
  seed = 0,
): [number, number, number][] {
  const curve = new THREE.CatmullRomCurve3(
    path.points.map((p) => new THREE.Vector3(...p)),
  );
  const len = curve.getLength();
  const count = Math.max(2, Math.floor(len / spacing));
  const out: [number, number, number][] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    const side = new THREE.Vector3(-tan.z, 0, tan.x);
    const j = (seededRandom(seed + i * 1.7) - 0.5) * 0.15;
    const pt = p.clone().add(side.multiplyScalar(sideOffset + j));
    if (shouldExcludeScatter(pt.x, pt.z)) continue;
    out.push([pt.x, 0.03, pt.z]);
  }
  return out;
}
