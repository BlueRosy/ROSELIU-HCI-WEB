import type { UniverseNodeId } from "../../content/site";

/** 3D positions for the four main nodes on the research loop (closed curve). */
export const NODE_POSITIONS: Record<UniverseNodeId, [number, number, number]> = {
  signals: [-2.8, 0.6, 1.2],
  states: [0, 1.4, -1.8],
  support: [2.8, 0.4, 1.0],
  safety: [0, -1.2, 2.4],
};

export type CameraKeyframe = {
  section: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  activeNode?: UniverseNodeId;
  showProjectCards?: boolean;
};

/** Scroll-driven camera path (6 sections). */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    section: "hero",
    position: [0, 2.5, 9],
    lookAt: [0, 0, 0],
  },
  {
    section: "signals",
    position: [-1.2, 1.8, 4.5],
    lookAt: [-2.8, 0.6, 1.2],
    activeNode: "signals",
  },
  {
    section: "states",
    position: [0.5, 2.2, 4],
    lookAt: [0, 1.4, -1.8],
    activeNode: "states",
  },
  {
    section: "support",
    position: [1.5, 1.5, 4.2],
    lookAt: [2.8, 0.4, 1.0],
    activeNode: "support",
  },
  {
    section: "safety",
    position: [0, 1.8, 8],
    lookAt: [0, 0, 0],
    activeNode: "safety",
  },
  {
    section: "projects",
    position: [0, 3.5, 10],
    lookAt: [0, 0, 0],
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

/** Project card 3D offsets (relative to loop center). */
export const PROJECT_CARD_POSITIONS: Record<
  string,
  [number, number, number]
> = {
  "mindful-scroll": [-3.5, 2.2, 0.5],
  cosim: [-1.5, -2.0, 2.8],
  caregiver: [2.0, -1.8, 2.5],
  "misinfo-sharing": [3.8, 1.8, 0.2],
};
