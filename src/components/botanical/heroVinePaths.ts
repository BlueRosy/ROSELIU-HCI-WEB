/** Shared Hero vine path geometry — used by Vines + Roses. */
export const HERO_VINE_PATHS = {
  topRightMain:
    "M1180 40 C1080 60, 1020 120, 980 200 S880 320, 820 380",
  topRightBranch: "M1150 80 C1100 100, 1060 140, 1040 180",
  bottomLeft: "M20 760 C120 720, 180 660, 240 580 S360 460, 440 420",
  signalPath:
    "M720 620 C680 560, 640 480, 580 400 S480 280, 420 220 C380 180, 340 140, 300 100",
} as const;

export type HeroVinePathId = keyof typeof HERO_VINE_PATHS;

export type HeroRoseSpec = {
  pathId: HeroVinePathId;
  startOffset: number;
  midOffset: number;
  endOffset: number;
  scale: number;
  delay: number;
};

/** Four roses on four vines — slow, low-key motion. */
export const HERO_ROSES: HeroRoseSpec[] = [
  {
    pathId: "topRightMain",
    startOffset: 0.12,
    midOffset: 0.26,
    endOffset: 0.38,
    scale: 0.72,
    delay: 0,
  },
  {
    pathId: "topRightBranch",
    startOffset: 0.08,
    midOffset: 0.32,
    endOffset: 0.52,
    scale: 0.62,
    delay: 3.5,
  },
  {
    pathId: "bottomLeft",
    startOffset: 0.1,
    midOffset: 0.28,
    endOffset: 0.42,
    scale: 0.68,
    delay: 1.8,
  },
  {
    pathId: "signalPath",
    startOffset: 0.15,
    midOffset: 0.45,
    endOffset: 0.68,
    scale: 0.58,
    delay: 5.5,
  },
];

export type PathPoint = { x: number; y: number; angle: number };

/** Sample position + tangent angle along an SVG path (0–1). */
export function samplePathPoint(d: string, t: number): PathPoint {
  if (typeof document === "undefined") {
    return { x: 0, y: 0, angle: 0 };
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const len = path.getTotalLength();
  const at = len * Math.max(0, Math.min(1, t));
  const p = path.getPointAtLength(at);
  const p2 = path.getPointAtLength(Math.min(len, at + 1));
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;

  document.body.removeChild(svg);
  return { x: p.x, y: p.y, angle };
}

/** Keyframe samples for rose travel along a vine segment. */
export function buildRoseTrack(
  d: string,
  start: number,
  mid: number,
  end: number,
): PathPoint[] {
  const offsets = [
    start,
    start + (mid - start) * 0.45,
    mid,
    mid + (end - mid) * 0.45,
    end,
  ];
  return offsets.map((t) => samplePathPoint(d, t));
}
