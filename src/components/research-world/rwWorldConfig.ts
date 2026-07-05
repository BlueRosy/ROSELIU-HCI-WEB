import type { ResearchWorldZone } from "../../content/site";

export type KeyState = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

export const WORLD_BOUNDS = {
  xMin: -16,
  xMax: 16,
  zMin: -30,
  zMax: 7,
} as const;

export const SPAWN_POSITION: [number, number, number] = [0, 0, 5];

export const MOVE_SPEED = 4.2;

export const INTERACT_RADIUS = 4;

export const NODE_INTERACT_RADIUS = 2.2;

export type Landmark = {
  id: string;
  zoneId: string;
  position: [number, number, number];
  treeScale: number;
  panelOffset: [number, number, number];
};

/** Tripod plaza: three landmarks on a mild scalene triangle; loop core sits
 * slightly forward toward entry. Camera choreography keys off DISC_CENTER. */
export const DISC_CENTER: [number, number, number] = [0.2, 0, -10.2];
export const DISC_RADIUS = 10.5;

export const LANDMARKS: Landmark[] = [
  {
    id: "signals",
    zoneId: "signals",
    position: [-6.2, 0, -6.8],
    treeScale: 1.1,
    panelOffset: [0, 3.8, 0],
  },
  {
    id: "states",
    zoneId: "states",
    position: [0.6, 0, -18.2],
    treeScale: 1.2,
    panelOffset: [0, 4, 0],
  },
  {
    id: "support",
    zoneId: "support",
    position: [5.4, 0, -8.2],
    treeScale: 1.1,
    panelOffset: [0, 3.8, 0],
  },
  {
    id: "loop",
    zoneId: "loop",
    position: [0.2, 0, -10.2],
    treeScale: 0.85,
    panelOffset: [0, 3.5, 0],
  },
];

export const LANDMARK_BY_ZONE: Record<string, Landmark> = Object.fromEntries(
  LANDMARKS.map((lm) => [lm.zoneId, lm]),
);

/** Entry walkway leading from the spawn onto the south edge of the tripod disc.
 * The ring + spokes on the disc itself are drawn as their own geometry in the
 * trail scene; this curve is just the approach (used for the ribbon, stepping
 * stones, and to keep ground scatter off the path). */
export const PATH_POINTS: [number, number, number][] = [
  [0, 0, 5],
  [0, 0, 2.5],
  [0, 0, 0.5],
  [0, 0, -1.5],
  [0, 0, -4.8],
  [0.1, 0, -7.6],
];

export type ZonePlaza = {
  zoneId: string;
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  label: string;
  particleColor: string;
};

export const ZONE_PLAZAS: ZonePlaza[] = [
  {
    zoneId: "entry",
    position: [0, 0, 4],
    radius: 3.2,
    color: "#F5EFE8",
    emissive: "#EDE4DA",
    label: "Entry Pavilion",
    particleColor: "#D4A59E",
  },
  {
    zoneId: "signals",
    position: [-6.2, 0, -6.8],
    radius: 5.2,
    color: "#E8EDE4",
    emissive: "#C5D4B8",
    label: "Signals Garden",
    particleColor: "#8A9275",
  },
  {
    zoneId: "states",
    position: [0.6, 0, -18.2],
    radius: 5.4,
    color: "#E4E8ED",
    emissive: "#B8C5D4",
    label: "States Observatory",
    particleColor: "#7A8A9A",
  },
  {
    zoneId: "support",
    position: [5.4, 0, -8.2],
    radius: 5.2,
    color: "#EDE4E4",
    emissive: "#D4B8B8",
    label: "Support Sanctuary",
    particleColor: "#B9786F",
  },
  {
    zoneId: "loop",
    position: [0.2, 0, -10.2],
    radius: 4.5,
    color: "#F0E8E4",
    emissive: "#D4A59E",
    label: "Closed-loop Core",
    particleColor: "#B9786F",
  },
];

export function getTeleportPosition(zoneId: string): [number, number, number] | null {
  const lm = LANDMARK_BY_ZONE[zoneId];
  if (!lm) {
    if (zoneId === "entry") return SPAWN_POSITION;
    return null;
  }
  const [x, , z] = lm.position;
  return [x, 0, z + 2.5];
}

export type PathNode = {
  id: string;
  zoneId: string;
  title: string;
  body: string;
  category: string;
  position: [number, number, number];
};

const ZONE_CATEGORY: Record<string, string> = {
  signals: "SIGNAL",
  states: "STATE",
  support: "SUPPORT",
  loop: "LOOP",
};

export function buildPathNodes(zones: ResearchWorldZone[]): PathNode[] {
  const nodes: PathNode[] = [];
  for (const zone of zones) {
    if (!zone.focusCards?.length) continue;
    const lm = LANDMARK_BY_ZONE[zone.id];
    if (!lm) continue;
    const [cx, , cz] = lm.position;
    const count = zone.focusCards.length;
    zone.focusCards.forEach((card, i) => {
      const spread = Math.PI * 0.65;
      const start = -spread / 2;
      const angle = count === 1 ? 0 : start + (i / (count - 1)) * spread;
      const radius = 2;
      const x = cx + Math.sin(angle) * radius;
      const z = cz + Math.cos(angle) * radius + 0.8;
      nodes.push({
        id: `${zone.id}-${i}`,
        zoneId: zone.id,
        title: card.title,
        body: card.body,
        category: ZONE_CATEGORY[zone.id] ?? "NODE",
        position: [x, 1.15, z],
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
