import { useLayoutEffect, useRef, useState } from "react";
import {
  heroFigureOffsetForSrc,
  heroFigureSrc,
  heroIllustrationId,
  heroLayerAlign,
  heroVineOverlaySrc,
  HERO_FIGURE_LOADED_EVENT,
} from "../heroVariants";
import { useHeroIllustration } from "../hooks/useHeroIllustration";

const NATIVE_W = 1024;

const BODY_CLASS =
  "hero-botanical-figure__body pointer-events-none block h-full w-auto max-w-none select-none object-contain object-bottom";

/**
 * Shared transform + measured box for body (z-0) and vine overlay (z-14).
 * Both layers use identical pixel dimensions — no w-full / separate containers.
 */
export function HeroFigureBody() {
  const [figureFailed, setFigureFailed] = useState(false);
  const bodyRef = useRef<HTMLImageElement>(null);
  const heroIllustration = useHeroIllustration();
  const id = heroIllustrationId(heroIllustration);
  const cacheKey = `${id}-composite-v3`;
  const figureSrc = heroFigureSrc(heroIllustration);
  const offsetX = heroFigureOffsetForSrc(heroIllustration);
  const align = heroLayerAlign(id);

  const notify = () => window.dispatchEvent(new Event(HERO_FIGURE_LOADED_EVENT));

  useLayoutEffect(() => {
    const img = bodyRef.current;
    if (!img) return;
    const publish = () => {
      window.dispatchEvent(
        new CustomEvent("hero-figure-metrics", {
          detail: {
            w: img.offsetWidth,
            h: img.offsetHeight,
            offsetX,
            align,
          },
        }),
      );
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(img);
    img.addEventListener("load", publish);
    window.addEventListener("resize", publish);
    return () => {
      ro.disconnect();
      img.removeEventListener("load", publish);
      window.removeEventListener("resize", publish);
    };
  }, [figureSrc, offsetX, align]);

  if (figureFailed) return null;

  const scale = bodyRef.current ? bodyRef.current.offsetWidth / NATIVE_W : 1;
  const nudgeX = (align?.body.x ?? 0) * scale;
  const nudgeY = (align?.body.y ?? 0) * scale;

  return (
    <div
      className="hero-botanical-figure pointer-events-none absolute bottom-0 left-1/2 h-full"
      style={{ transform: `translate(calc(-50% + ${offsetX}px), 0)` }}
    >
      <div className="relative inline-block h-full leading-none">
        <img
          ref={bodyRef}
          src={`${figureSrc}?v=${cacheKey}`}
          alt="Hand-drawn illustration of Rose among rose vines"
          onError={() => setFigureFailed(true)}
          onLoad={notify}
          draggable={false}
          className={BODY_CLASS}
          style={nudgeX || nudgeY ? { transform: `translate(${nudgeX}px, ${nudgeY}px)` } : undefined}
        />
      </div>
    </div>
  );
}

export function HeroFigureVines() {
  const [vineFailed, setVineFailed] = useState(false);
  const [metrics, setMetrics] = useState<{
    w: number;
    h: number;
    offsetX: number;
    align: ReturnType<typeof heroLayerAlign>;
  } | null>(null);

  const heroIllustration = useHeroIllustration();
  const id = heroIllustrationId(heroIllustration);
  const cacheKey = `${id}-composite-v3`;
  const vineOverlay = heroVineOverlaySrc(heroIllustration);

  useLayoutEffect(() => {
    const onMetrics = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setMetrics(detail);
    };
    window.addEventListener("hero-figure-metrics", onMetrics);
    return () => window.removeEventListener("hero-figure-metrics", onMetrics);
  }, []);

  if (!vineOverlay || vineFailed || !metrics || metrics.w <= 0) return null;

  const scale = metrics.w / NATIVE_W;
  const nudgeX = (metrics.align?.vines.x ?? 0) * scale;
  const nudgeY = (metrics.align?.vines.y ?? 0) * scale;

  return (
    <div
      className="hero-botanical-figure hero-botanical-figure--vines pointer-events-none absolute bottom-0 left-1/2 h-full"
      style={{ transform: `translate(calc(-50% + ${metrics.offsetX}px), 0)` }}
    >
      <div
        className="relative leading-none"
        style={{ width: metrics.w, height: metrics.h }}
      >
        <img
          src={`${vineOverlay}?v=${cacheKey}`}
          alt=""
          aria-hidden="true"
          onError={() => setVineFailed(true)}
          draggable={false}
          className="hero-botanical-figure__vine hero-vine-layer pointer-events-none absolute bottom-0 left-0 select-none object-contain object-bottom"
          style={{
            width: metrics.w,
            height: metrics.h,
            transform: `translate(${nudgeX}px, ${nudgeY}px)`,
          }}
        />
      </div>
    </div>
  );
}

/** @deprecated Use HeroFigureBody — kept for imports */
export default HeroFigureBody;
