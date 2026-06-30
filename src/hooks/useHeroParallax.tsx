import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ParallaxPoint = { x: number; y: number };

const HeroParallaxContext = createContext<ParallaxPoint>({ x: 0, y: 0 });

/** Normalized pointer (-1…1) for subtle Hero layer parallax. */
export function HeroParallaxProvider({ children }: { children: ReactNode }) {
  const target = useRef({ x: 0, y: 0 });
  const [point, setPoint] = useState<ParallaxPoint>({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      setPoint((prev) => {
        const nx = prev.x + (target.current.x - prev.x) * 0.06;
        const ny = prev.y + (target.current.y - prev.y) * 0.06;
        if (Math.abs(nx - prev.x) < 0.0001 && Math.abs(ny - prev.y) < 0.0001) {
          return prev;
        }
        return { x: nx, y: ny };
      });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <HeroParallaxContext.Provider value={point}>
      {children}
    </HeroParallaxContext.Provider>
  );
}

export function useHeroParallax(): ParallaxPoint {
  return useContext(HeroParallaxContext);
}

/** CSS translate in px for a given parallax depth (1 = clouds, 2 = particles, 0.5 = cards). */
export function parallaxPx(point: ParallaxPoint, depth: number) {
  return {
    x: point.x * depth * 6,
    y: point.y * depth * 4,
  };
}
