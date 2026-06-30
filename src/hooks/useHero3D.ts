import { useEffect, useState } from "react";

/** Whether to load the Hero 3D avatar (desktop, motion ok, enough cores). */
export function useHero3D(): boolean {
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
