export type BorderPoint = { x: number; y: number; angle: number };

/** Clockwise organic vine loop hugging a rounded rect (stroke-only). */
export function buildWindingVinePath(w: number, h: number): string {
  if (w < 40 || h < 40) return "";

  const m = 18;
  const r = Math.min(28, (w - m * 2) / 5, (h - m * 2) / 5);
  const L = m;
  const T = m;
  const R = w - m;
  const B = h - m;
  const midX = (L + R) / 2;
  const midY = (T + B) / 2;

  return [
    `M ${L + r} ${T + 2}`,
    `C ${L + (midX - L) * 0.5} ${T - 5}, ${midX + 8} ${T + 4}, ${R - r - 4} ${T}`,
    `Q ${R} ${T} ${R} ${T + r}`,
    `C ${R + 5} ${T + (midY - T) * 0.45}, ${R - 3} ${midY + 6}, ${R - 1} ${B - r}`,
    `Q ${R} ${B} ${R - r} ${B - 2}`,
    `C ${midX + 10} ${B + 4}, ${midX - 12} ${B - 3}, ${L + r + 2} ${B}`,
    `Q ${L} ${B} ${L} ${B - r}`,
    `C ${L - 4} ${midY + 12}, ${L + 3} ${T + (midY - T) * 0.55}, ${L} ${T + r}`,
    `Q ${L} ${T} ${L + r} ${T + 2}`,
  ].join(" ");
}

export function sampleBorderPath(d: string, t: number): BorderPoint {
  if (!d || typeof document === "undefined") {
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
  const p2 = path.getPointAtLength(Math.min(len, at + 2));
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;

  document.body.removeChild(svg);
  return { x: p.x, y: p.y, angle };
}
