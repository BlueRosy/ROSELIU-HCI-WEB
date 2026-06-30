import { sampleBorderPath } from "./vineBorderPath";
import { joinPath, silkC, silkMove, silkS } from "./silkVinePath";

export type Point = { x: number; y: number };

export type FootGardenLayout = {
  w: number;
  h: number;
  roots: { A: Point; B: Point; C: Point };
  targets: { signals: Point; states: Point; support: Point };
};

export type BloomSpec = {
  t: number;
  variant: "bud" | "open";
  scale: number;
};

export type GardenVine = {
  id: string;
  path: string;
  strokeWidth: number;
  opacity: number;
  delay: number;
  duration: number;
  blooms: BloomSpec[];
  leaves: number[];
};

const CARD_GAP = 32;

function approachCard(
  cardRect: DOMRect,
  container: DOMRect,
  side: "left" | "right",
): Point {
  const y = cardRect.top + cardRect.height * 0.72 - container.top;
  const x =
    side === "right"
      ? cardRect.left - CARD_GAP - container.left
      : cardRect.right + CARD_GAP - container.left;
  return { x, y };
}

/** Root A — low left sweep, stays near feet (clear of book). */
function buildLeftHemVine(layout: FootGardenLayout): string {
  const { A } = layout.roots;
  const { w, h } = layout;
  const end = { x: A.x - w * 0.07, y: h * 0.63 };

  return joinPath(
    silkMove(A),
    silkC(
      { x: A.x - w * 0.015, y: A.y - h * 0.07 },
      { x: A.x - w * 0.055, y: A.y - h * 0.13 },
      end,
    ),
  );
}

/** Root C — mirrors background `signalPath` (C → S → C). */
function buildMainSVine(layout: FootGardenLayout): { main: string; signals: string } {
  const { C } = layout.roots;
  const { support, signals } = layout.targets;
  const { w, h } = layout;

  const main = joinPath(
    silkMove(C),
    silkC(
      { x: C.x - w * 0.028, y: C.y - h * 0.055 },
      { x: C.x + w * 0.055, y: C.y - h * 0.13 },
      { x: C.x + w * 0.085, y: h * 0.655 },
    ),
    silkS(
      { x: C.x + w * 0.105, y: h * 0.455 },
      { x: C.x + w * 0.095, y: h * 0.355 },
    ),
    silkC(
      { x: support.x - w * 0.095, y: h * 0.275 },
      { x: support.x - w * 0.048, y: support.y + h * 0.07 },
      support,
    ),
  );

  const tip = sampleBorderPath(main, 0.88);
  const signalsPath = joinPath(
    silkMove(tip),
    silkC(
      { x: tip.x + w * 0.018, y: tip.y - h * 0.125 },
      { x: signals.x + w * 0.015, y: signals.y + h * 0.14 },
      signals,
    ),
  );

  return { main, signals: signalsPath };
}

export function buildFootGardenVines(layout: FootGardenLayout): GardenVine[] {
  const leftPath = buildLeftHemVine(layout);
  const { main, signals } = buildMainSVine(layout);

  return [
    {
      id: "left-hem",
      path: leftPath,
      strokeWidth: 1.2,
      opacity: 0.54,
      delay: 0.3,
      duration: 5,
      blooms: [{ t: 0.42, variant: "open", scale: 0.5 }],
      leaves: [0.35],
    },
    {
      id: "main-s",
      path: main,
      strokeWidth: 1.2,
      opacity: 0.58,
      delay: 0,
      duration: 5.5,
      blooms: [
        { t: 0.16, variant: "open", scale: 0.56 },
        { t: 0.42, variant: "open", scale: 0.48 },
        { t: 0.78, variant: "bud", scale: 0.38 },
      ],
      leaves: [0.28, 0.52],
    },
    {
      id: "signals-whisper",
      path: signals,
      strokeWidth: 1,
      opacity: 0.42,
      delay: 2.5,
      duration: 4,
      blooms: [{ t: 0.9, variant: "bud", scale: 0.36 }],
      leaves: [],
    },
  ];
}

export function defaultFootGardenLayout(w: number, h: number): FootGardenLayout {
  return {
    w,
    h,
    roots: {
      A: { x: w * 0.36, y: h * 0.89 },
      B: { x: w * 0.43, y: h * 0.9 },
      C: { x: w * 0.5, y: h * 0.88 },
    },
    targets: {
      signals: { x: w * 0.84, y: h * 0.14 },
      states: { x: w * 0.14, y: h * 0.34 },
      support: { x: w * 0.82, y: h * 0.54 },
    },
  };
}

export function measureFootGardenLayout(root: HTMLDivElement): FootGardenLayout | null {
  const rect = root.getBoundingClientRect();
  if (rect.width < 40 || rect.height < 40) return null;

  const readRoot = (id: string, fallback: Point): Point => {
    const el = root.querySelector<HTMLElement>(`[data-foot-root="${id}"]`);
    if (!el) return fallback;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - rect.left,
      y: r.top + r.height / 2 - rect.top,
    };
  };

  const base = defaultFootGardenLayout(rect.width, rect.height);
  const roots = {
    A: readRoot("A", base.roots.A),
    B: readRoot("B", base.roots.B),
    C: readRoot("C", base.roots.C),
  };

  const cards = root.querySelectorAll<HTMLElement>("[data-signal-anchor]");
  if (cards.length < 3) {
    return { w: rect.width, h: rect.height, roots, targets: base.targets };
  }

  const [signalsEl, , supportEl] = Array.from(cards);
  const signalsRect = signalsEl.getBoundingClientRect();
  const supportRect = supportEl.getBoundingClientRect();

  return {
    w: rect.width,
    h: rect.height,
    roots,
    targets: {
      signals: approachCard(signalsRect, rect, "right"),
      states: base.targets.states,
      support: approachCard(supportRect, rect, "right"),
    },
  };
}
