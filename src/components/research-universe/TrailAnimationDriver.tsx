import { useEffect } from "react";
import { useUniverse } from "./UniverseContext";

const INTERVAL_MS = 1000 / 20;

export default function TrailAnimationDriver() {
  const { invalidate, isScrollingRef } = useUniverse();

  useEffect(() => {
    const id = window.setInterval(() => {
      if (isScrollingRef.current) return;
      invalidate.current();
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [invalidate, isScrollingRef]);

  return null;
}
