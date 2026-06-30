import type { Point } from "./heroFootGarden";

/** Silky SVG path builders — same C / S language as `HERO_VINE_PATHS`. */
export function silkMove(p: Point): string {
  return `M ${p.x} ${p.y}`;
}

export function silkC(c1: Point, c2: Point, to: Point): string {
  return `C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

export function silkS(c2: Point, to: Point): string {
  return `S ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

export function joinPath(...parts: string[]): string {
  return parts.join(" ");
}
