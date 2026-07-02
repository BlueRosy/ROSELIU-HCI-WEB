import type { ResearchWorldZone } from "../../content/site";

export type KeyState = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

export const WORLD_BOUNDS = {
  xMin: -12,
  xMax: 12,
  zMin: -36,
  zMax: 10,
} as const;

export const SPAWN_POSITION: [number, number, number] = [0, 0, 8];

export const MOVE_SPEED = 4.2;

export const INTERACT_RADIUS = 4.5;

export const NODE_INTERACT_RADIUS = 2.5;

export type Landmark = {
  id: string;
  zoneId: string;
  position: [number, number, number];
  treeScale: number;
  panelOffset: [number, number, number];
};

export const LANDMARKS: Landmark[] = [
  {
    id: "signals",
    zoneId: "signals",
    position: [-6, 0, -2],
    treeScale: 1.15,
    panelOffset: [0, 4.2, 0],
  },
  {
    id: "states",
    zoneId: "states",
    position: [0, 0, -14],
    treeScale: 1.3,
    panelOffset: [0, 4.5, 0],
  },
  {
    id: "support",
    zoneId: "support",
    position: [6, 0, -26],
    treeScale: 1.2,
    panelOffset: [0, 4.2, 0],
  },
  {
    id: "loop",
    zoneId: "loop",
    position: [0, 0, -34],
    treeScale: 0.9,
    panelOffset: [0, 3.8, 0],
  },
];

export const LANDMARK_BY_ZONE: Record<string, Landmark> = Object.fromEntries(
  LANDMARKS.map((lm) => [lm.zoneId, lm]),
);

export const PATH_POINTS: [number, number, number][] = [
  [0, 0, 8],
  [-3, 0, 2],
  [-6, 0, -2],
  [-3, 0, -8],
  [0, 0, -14],
  [3, 0, -20],
  [6, 0, -26],
  [3, 0, -30],
  [0, 0, -34],
];

export function getTeleportPosition(zoneId: string): [number, number, number] | null {
  const lm = LANDMARK_BY_ZONE[zoneId];
  if (!lm) {
    if (zoneId === "entry") return SPAWN_POSITION;
    return null;
  }
  const [x, , z] = lm.position;
  return [x, 0, z + 3];
}

export type PathNode = {
  id: string;
  zoneId: string;
  title: string;
  body: string;
  t: number;
  position: [number, number, number];
};

export function buildPathNodes(
  zones: ResearchWorldZone[],
): PathNode[] {
  const zoneT: Record<string, number[]> = {
    signals: [0.14, 0.2, 0.26],
    states: [0.38, 0.44, 0.5, 0.56],
    support: [0.64, 0.7, 0.76, 0.82],
    loop: [0.92],
  };
  const nodes: PathNode[] = [];
  for (const zone of zones) {
    if (!zone.focusCards?.length) continue;
    const ts = zoneT[zone.id] ?? [];
    zone.focusCards.forEach((card, i) => {
      const t = ts[i] ?? 0.1 + i * 0.05;
      nodes.push({
        id: `${zone.id}-${i}`,
        zoneId: zone.id,
        title: card.title,
        body: card.body,
        t,
        position: [0, 0, 0],
      });
    });
  }
  return nodes;
}

export function findNearestPathNode(
  nodes: PathNode[],
  x: number,
  z: number,
): PathNode | null {
  let best: PathNode | null = null;
  let bestD = Infinity;
  for (const node of nodes) {
    const dx = x - node.position[0];
    const dz = z - node.position[2];
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d <= NODE_INTERACT_RADIUS && d < bestD) {
      best = node;
      bestD = d;
    }
  }
  return best;
}

export function findNearestLandmark(
  x: number,
  z: number,
): { landmark: Landmark; distance: number } | null {
  let best: { landmark: Landmark; distance: number } | null = null;
  for (const lm of LANDMARKS) {
    const dx = x - lm.position[0];
    const dz = z - lm.position[2];
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d <= INTERACT_RADIUS && (!best || d < best.distance)) {
      best = { landmark: lm, distance: d };
    }
  }
  return best;
}

export function zoneById(zones: ResearchWorldZone[], zoneId: string) {
  return zones.find((z) => z.id === zoneId) ?? null;
}
