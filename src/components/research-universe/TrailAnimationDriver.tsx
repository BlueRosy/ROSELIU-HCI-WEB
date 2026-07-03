import { useEffect } from "react";
import { useUniverse } from "./UniverseContext";

const INTERVAL_MS = 1000 / 30;

export default function TrailAnimationDriver() {
  const { invalidate } = useUniverse();

  useEffect(() => {
    const id = window.setInterval(() => {
      invalidate.current();
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [invalidate]);

  return null;
}
