import { useEffect, useState } from "react";

/**
 * Decide whether to render the (decorative-but-meaningful) 3D scenes.
 * 3D is disabled when the user prefers reduced motion, on small/touch
 * screens, or when the device reports few logical cores. In all those
 * cases components fall back to a static gradient or 2D SVG version.
 */
export function useEnable3D(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;

    setEnabled(!reduceMotion && !smallScreen && cores >= 4);
  }, []);

  return enabled;
}
