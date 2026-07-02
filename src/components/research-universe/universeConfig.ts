import type { UniverseNodeId } from "../../content/site";

/** Organic 3D orbit — not a flat diamond. */
export const NODE_POSITIONS: Record<UniverseNodeId, [number, number, number]> = {
  signals: [-2.4, 0.9, 1.8],
  states: [0.2, 2.1, -0.6],
  support: [2.5, 0.3, 1.4],
  safety: [-0.4, -1.5, -2.0],
};

export type CameraKeyframe = {
  section: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  activeNode?: UniverseNodeId;
  showProjectCards?: boolean;
};

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    section: "hero",
    position: [0, 1.2, 10],
    lookAt: [0, 0.2, 0],
  },
  {
    section: "signals",
    position: [-1.0, 1.6, 5.2],
    lookAt: [-2.4, 0.9, 1.8],
    activeNode: "signals",
  },
  {
    section: "states",
    position: [0.8, 2.4, 4.8],
    lookAt: [0.2, 2.1, -0.6],
    activeNode: "states",
  },
  {
    section: "support",
    position: [2.0, 1.2, 5.0],
    lookAt: [2.5, 0.3, 1.4],
    activeNode: "support",
  },
  {
    section: "safety",
    position: [0, 2.0, 9],
    lookAt: [0, 0, 0],
    activeNode: "safety",
  },
  {
    section: "projects",
    position: [0, 2.8, 11],
    lookAt: [0, 0.2, 0],
    showProjectCards: true,
  },
];

export const SCROLL_SECTIONS = [
  "hero",
  "signals",
  "states",
  "support",
  "safety",
  "projects",
] as const;

export type ScrollSection = (typeof SCROLL_SECTIONS)[number];

export const PROJECT_CARD_POSITIONS: Record<string, [number, number, number]> = {
  "mindful-scroll": [-3.8, 2.4, 1.2],
  cosim: [-2.0, -1.2, 3.2],
  caregiver: [2.4, -1.0, 3.0],
  "misinfo-sharing": [4.0, 2.0, 0.8],
};
