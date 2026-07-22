import { useEffect, useState } from "react";

const MOBILE_MQ = "(max-width: 768px)";

function matchesMobile(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches;
}

/** Phone / narrow viewport — 3D Research World should not be offered here. */
export function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(matchesMobile);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}

/**
 * Decide whether to render the (decorative-but-meaningful) 3D scenes.
 * Off on mobile, reduced-motion, or low-core devices — never mount WebGL there.
 */
export function useEnable3D(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const smallScreen = window.matchMedia(MOBILE_MQ).matches;
    const cores = navigator.hardwareConcurrency ?? 8;

    setEnabled(!reduceMotion && !smallScreen && cores >= 4);
  }, []);

  return enabled;
}
