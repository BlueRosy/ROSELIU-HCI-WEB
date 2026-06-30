import { sampleBorderPath } from "./vineBorderPath";
import type { GardenVine, Point } from "./heroFootGarden";
import { joinPath, silkC, silkMove } from "./silkVinePath";

export type FigureAnchorKey = "hair" | "shoulder" | "dress" | "hem";

export type FigureGardenLayout = {
  w: number;
  h: number;
  roots: { A: Point; C: Point };
  anchors: Record<FigureAnchorKey, Point>;
};

/** Outer silhouette — hem/dress far left (away from book at ~46% x). */
export function defaultFigureAnchors(w: number, h: number): Record<FigureAnchorKey, Point> {
  return {
    hair: { x: w * 0.72, y: h * 0.06 },
    shoulder: { x: w * 0.67, y: h * 0.27 },
    dress: { x: w * 0.32, y: h * 0.6 },
    hem: { x: w * 0.3, y: h * 0.67 },
  };
}

/** Right contour — strictly rising control points, no dip. */
function buildProfileWrap(layout: FigureGardenLayout): string {
  const { roots, anchors, w, h } = layout;
  const start = roots.C;
  const { shoulder, hair } = anchors;

  const hip = { x: start.x + w * 0.085, y: start.y - h * 0.17 };
  const waist = { x: shoulder.x + w * 0.04, y: start.y - h * 0.37 };

  return joinPath(
    silkMove(start),
    silkC(
      { x: start.x + w * 0.028, y: start.y - h * 0.065 },
      { x: hip.x - w * 0.008, y: hip.y - h * 0.015 },
      hip,
    ),
    silkC(
      { x: hip.x + w * 0.012, y: hip.y - h * 0.095 },
      { x: waist.x, y: waist.y - h * 0.015 },
      waist,
    ),
    silkC(
      { x: waist.x + w * 0.008, y: waist.y - h * 0.075 },
      { x: shoulder.x + w * 0.018, y: shoulder.y - h * 0.012 },
      shoulder,
    ),
    silkC(
      { x: shoulder.x + w * 0.022, y: shoulder.y - h * 0.065 },
      { x: hair.x - w * 0.01, y: hair.y - h * 0.008 },
      hair,
    ),
  );
}

/** Far-left hem only — stays below book line, never curves inward. */
function buildDressDrape(layout: FigureGardenLayout): string {
  const { roots, anchors, w, h } = layout;
  const start = roots.A;
  const { hem } = anchors;

  const low = { x: start.x - w * 0.045, y: start.y - h * 0.14 };
  const mid = { x: hem.x - w * 0.012, y: hem.y + h * 0.025 };

  return joinPath(
    silkMove(start),
    silkC(
      { x: start.x - w * 0.012, y: start.y - h * 0.085 },
      { x: low.x - w * 0.01, y: low.y - h * 0.01 },
      low,
    ),
    silkC(
      { x: mid.x - w * 0.006, y: mid.y - h * 0.045 },
      { x: hem.x, y: hem.y - h * 0.01 },
      hem,
    ),
  );
}

/** Primary hair strand — rear-right, rises toward crown. */
function buildHairThreads(layout: FigureGardenLayout, wrapPath: string): string {
  const { anchors, w, h } = layout;
  const base = sampleBorderPath(wrapPath, 0.72);
  const strandMid = { x: anchors.hair.x - w * 0.02, y: anchors.hair.y + h * 0.032 };
  const strandHigh = { x: anchors.hair.x + w * 0.018, y: anchors.hair.y + h * 0.01 };
  const strandTip = { x: anchors.hair.x + w * 0.048, y: anchors.hair.y - h * 0.012 };

  return joinPath(
    silkMove(base),
    silkC(
      { x: base.x + w * 0.008, y: base.y - h * 0.035 },
      { x: strandMid.x - w * 0.004, y: strandMid.y - h * 0.008 },
      strandMid,
    ),
    silkC(
      { x: strandMid.x + w * 0.012, y: strandMid.y - h * 0.028 },
      { x: strandHigh.x, y: strandHigh.y - h * 0.005 },
      strandHigh,
    ),
    silkC(
      { x: strandHigh.x + w * 0.014, y: strandHigh.y - h * 0.018 },
      { x: strandTip.x, y: strandTip.y },
      strandTip,
    ),
  );
}

/** Secondary strand — offset tip, keeps blooms dispersed along hair mass. */
function buildHairThreadsAlt(layout: FigureGardenLayout, wrapPath: string): string {
  const { anchors, w, h } = layout;
  const base = sampleBorderPath(wrapPath, 0.76);
  const bend = { x: anchors.hair.x - w * 0.008, y: anchors.hair.y + h * 0.055 };
  const tip = { x: anchors.hair.x + w * 0.032, y: anchors.hair.y + h * 0.022 };

  return joinPath(
    silkMove(base),
    silkC(
      { x: base.x + w * 0.006, y: base.y - h * 0.022 },
      { x: bend.x - w * 0.006, y: bend.y - h * 0.012 },
      bend,
    ),
    silkC(
      { x: bend.x + w * 0.01, y: bend.y - h * 0.018 },
      { x: tip.x, y: tip.y },
      tip,
    ),
  );
}

export type FigureScatterBloom = {
  id: string;
  x: number;
  y: number;
  angle: number;
  scale: number;
  variant: "bud" | "open";
  delay: number;
};

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Direct blooms on hair + dress — no extra vine stroke, size varies. */
export function buildFigureScatterBlooms(layout: FigureGardenLayout): FigureScatterBloom[] {
  const { anchors, w, h } = layout;
  const { hair, shoulder, dress, hem } = anchors;

  const hairBlooms: Omit<FigureScatterBloom, "id">[] = [
    { x: hair.x + w * 0.038, y: hair.y + h * 0.018, angle: 18, scale: 0.13, variant: "bud", delay: 3.4 },
    { x: hair.x + w * 0.052, y: hair.y + h * 0.042, angle: 32, scale: 0.15, variant: "bud", delay: 3.85 },
    { x: hair.x + w * 0.028, y: hair.y + h * 0.058, angle: 8, scale: 0.12, variant: "bud", delay: 4.2 },
    { x: hair.x + w * 0.062, y: hair.y - h * 0.006, angle: 42, scale: 0.2, variant: "open", delay: 4.55 },
    { x: hair.x + w * 0.044, y: hair.y + h * 0.008, angle: 26, scale: 0.17, variant: "bud", delay: 4.9 },
  ];

  const dressSpecs: {
    t: number;
    xOff: number;
    yOff: number;
    angle: number;
    scale: number;
    variant: "bud" | "open";
    delay: number;
  }[] = [
    { t: 0.18, xOff: -0.028, yOff: 0.012, angle: -12, scale: 0.16, variant: "bud", delay: 2.1 },
    { t: 0.34, xOff: -0.018, yOff: 0.008, angle: 6, scale: 0.24, variant: "bud", delay: 2.55 },
    { t: 0.48, xOff: -0.035, yOff: 0.022, angle: -8, scale: 0.42, variant: "open", delay: 2.95 },
    { t: 0.62, xOff: -0.012, yOff: 0.016, angle: 14, scale: 0.2, variant: "bud", delay: 3.35 },
    { t: 0.78, xOff: -0.042, yOff: 0.028, angle: -4, scale: 0.5, variant: "open", delay: 3.75 },
    { t: 0.9, xOff: -0.022, yOff: 0.034, angle: 10, scale: 0.28, variant: "bud", delay: 4.15 },
  ];

  const dressBlooms: Omit<FigureScatterBloom, "id">[] = dressSpecs.map((spec) => {
    const xBase = mix(mix(shoulder.x, dress.x, spec.t), hem.x, spec.t * 0.4);
    const yBase =
      spec.t < 0.55
        ? mix(shoulder.y, dress.y, spec.t / 0.55)
        : mix(dress.y, hem.y, (spec.t - 0.55) / 0.45);

    return {
      x: xBase + w * spec.xOff,
      y: yBase + h * spec.yOff,
      angle: spec.angle,
      scale: spec.scale,
      variant: spec.variant,
      delay: spec.delay,
    };
  });

  return [...hairBlooms, ...dressBlooms].map((b, i) => ({
    ...b,
    id: `scatter-${i}`,
  }));
}

export function buildFigureGardenVines(layout: FigureGardenLayout): GardenVine[] {
  const wrapPath = buildProfileWrap(layout);
  const hairThreadPath = buildHairThreads(layout, wrapPath);
  const hairThreadAltPath = buildHairThreadsAlt(layout, wrapPath);

  return [
    {
      id: "profile-wrap",
      path: wrapPath,
      strokeWidth: 1,
      opacity: 0.46,
      delay: 0.6,
      duration: 5.5,
      blooms: [{ t: 0.54, variant: "bud", scale: 0.3 }],
      leaves: [0.38, 0.68],
    },
    {
      id: "hair-threads",
      path: hairThreadPath,
      strokeWidth: 0.75,
      opacity: 0.34,
      delay: 2.2,
      duration: 4.5,
      blooms: [
        { t: 0.2, variant: "bud", scale: 0.12 },
        { t: 0.38, variant: "bud", scale: 0.14 },
        { t: 0.55, variant: "bud", scale: 0.15 },
        { t: 0.72, variant: "bud", scale: 0.16 },
        { t: 0.86, variant: "open", scale: 0.22 },
        { t: 0.96, variant: "open", scale: 0.26 },
      ],
      leaves: [],
    },
    {
      id: "hair-threads-alt",
      path: hairThreadAltPath,
      strokeWidth: 0.65,
      opacity: 0.28,
      delay: 2.65,
      duration: 3.8,
      blooms: [
        { t: 0.35, variant: "bud", scale: 0.11 },
        { t: 0.62, variant: "bud", scale: 0.13 },
        { t: 0.9, variant: "open", scale: 0.19 },
      ],
      leaves: [],
    },
    {
      id: "dress-drape",
      path: buildDressDrape(layout),
      strokeWidth: 1.05,
      opacity: 0.5,
      delay: 1,
      duration: 5,
      blooms: [
        { t: 0.48, variant: "bud", scale: 0.28 },
        { t: 0.82, variant: "open", scale: 0.54 },
      ],
      leaves: [0.55],
    },
  ];
}

export function defaultFigureGardenLayout(w: number, h: number): FigureGardenLayout {
  return {
    w,
    h,
    roots: {
      A: { x: w * 0.36, y: h * 0.89 },
      C: { x: w * 0.5, y: h * 0.88 },
    },
    anchors: defaultFigureAnchors(w, h),
  };
}

export function measureFigureGardenLayout(root: HTMLDivElement): FigureGardenLayout | null {
  const rect = root.getBoundingClientRect();
  if (rect.width < 40 || rect.height < 40) return null;

  const readPoint = (selector: string, fallback: Point): Point => {
    const el = root.querySelector<HTMLElement>(selector);
    if (!el) return fallback;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - rect.left,
      y: r.top + r.height / 2 - rect.top,
    };
  };

  const base = defaultFigureGardenLayout(rect.width, rect.height);

  const anchors = Object.fromEntries(
    (Object.keys(base.anchors) as FigureAnchorKey[]).map((key) => [
      key,
      readPoint(`[data-figure-anchor="${key}"]`, base.anchors[key]),
    ]),
  ) as Record<FigureAnchorKey, Point>;

  return {
    w: rect.width,
    h: rect.height,
    roots: {
      A: readPoint('[data-foot-root="A"]', base.roots.A),
      C: readPoint('[data-foot-root="C"]', base.roots.C),
    },
    anchors,
  };
}
