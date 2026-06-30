import type { CSSProperties } from "react";

/** CSS vars for bloom grow → continuous sway (foot + figure garden). */
export function vineBloomMotionStyle(
  animDelay: number,
  scale: number,
  variant: "bud" | "open",
  index: number,
): CSSProperties {
  const grow = variant === "bud" ? 2.2 : 2.6;
  const sway = 3.2 + (index % 5) * 0.75;
  return {
    "--bloom-scale": scale,
    "--bloom-delay": `${animDelay}s`,
    "--bloom-grow": `${grow}s`,
    "--bloom-sway": `${sway}s`,
  } as CSSProperties;
}

export function vineLeafMotionStyle(animDelay: number, index: number): CSSProperties {
  return {
    "--vine-leaf-delay": `${animDelay}s`,
    "--leaf-sway-offset": `${index * 0.9}s`,
  } as CSSProperties;
}
