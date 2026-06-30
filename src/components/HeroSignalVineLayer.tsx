import { useLayoutEffect, useRef, useState } from "react";
import { useHeroIllustration } from "../hooks/useHeroIllustration";
import { heroHasSignalVineGrowth, HERO_FIGURE_LOADED_EVENT } from "../heroVariants";
import HeroFigureGarden, { HeroFigureAnchors } from "./botanical/HeroFigureGarden";
import {
  defaultFigureGardenLayout,
  measureFigureGardenLayout,
  type FigureGardenLayout,
} from "./botanical/figureGardenLayout";
import HeroSignalVineGrowth, {
  HeroFootRoots,
  defaultSignalVineLayout,
  measureSignalVineLayout,
  type SignalVineLayout,
} from "./botanical/HeroSignalVineGrowth";

/** Foot-garden + profile-wrap vines (h5). */
export default function HeroSignalVineLayer({
  rootRef,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const illustration = useHeroIllustration();
  const growToCards = heroHasSignalVineGrowth(illustration);
  const layerRef = useRef<HTMLDivElement>(null);
  const [vineLayout, setVineLayout] = useState<SignalVineLayout>(() =>
    defaultSignalVineLayout(480, 560),
  );
  const [figureLayout, setFigureLayout] = useState<FigureGardenLayout>(() =>
    defaultFigureGardenLayout(480, 560),
  );

  useLayoutEffect(() => {
    if (!growToCards) return;

    const resolveRoot = (): HTMLDivElement | null =>
      rootRef.current ?? (layerRef.current?.parentElement as HTMLDivElement | null);

    const run = () => {
      const root = resolveRoot();
      if (!root) return;
      const foot = measureSignalVineLayout(root);
      const figure = measureFigureGardenLayout(root);
      if (foot) setVineLayout(foot);
      if (figure) setFigureLayout(figure);
    };

    run();
    const id1 = requestAnimationFrame(run);
    const id2 = requestAnimationFrame(() => requestAnimationFrame(run));
    const t1 = window.setTimeout(run, 100);
    const t2 = window.setTimeout(run, 400);
    const t3 = window.setTimeout(run, 1200);

    const root = resolveRoot();
    const ro = root ? new ResizeObserver(run) : null;
    if (root && ro) ro.observe(root);

    window.addEventListener("resize", run);
    window.addEventListener(HERO_FIGURE_LOADED_EVENT, run);

    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      ro?.disconnect();
      window.removeEventListener("resize", run);
      window.removeEventListener(HERO_FIGURE_LOADED_EVENT, run);
    };
  }, [growToCards, rootRef]);

  if (!growToCards) return null;

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-[9]"
      aria-hidden="true"
    >
      <HeroFootRoots />
      <HeroFigureAnchors />
      {/* Stems draw first (behind figure); blooms render in same layer on top of PNG edges */}
      <HeroSignalVineGrowth layout={vineLayout} />
      <HeroFigureGarden layout={figureLayout} />
    </div>
  );
}
