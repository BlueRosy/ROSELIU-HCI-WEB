import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { palette } from "../../theme/palette";
import {
  buildFootGardenVines,
  defaultFootGardenLayout,
  measureFootGardenLayout,
  type FootGardenLayout,
} from "./heroFootGarden";
import { sampleBorderPath } from "./vineBorderPath";
import { VineLeaf, VineRose } from "./VineBorderDecor";
import { vineBloomMotionStyle, vineLeafMotionStyle } from "./vineBloomMotion";

export type { FootGardenLayout as SignalVineLayout };

export function defaultSignalVineLayout(w: number, h: number): FootGardenLayout {
  return defaultFootGardenLayout(w, h);
}

export function measureSignalVineLayout(root: HTMLDivElement): FootGardenLayout | null {
  return measureFootGardenLayout(root);
}

/** Feet-root cluster → S-curve growth toward signal cards. */
export default function HeroSignalVineGrowth({ layout }: { layout: FootGardenLayout }) {
  const reducedMotion = useReducedMotion();
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [pathLengths, setPathLengths] = useState<Record<string, number>>({});

  const vines = useMemo(() => buildFootGardenVines(layout), [layout]);

  useLayoutEffect(() => {
    const measure = () => {
      const lengths: Record<string, number> = {};
      for (const vine of vines) {
        const len = pathRefs.current[vine.id]?.getTotalLength() ?? 0;
        if (len > 0) lengths[vine.id] = len;
      }
      if (Object.keys(lengths).length > 0) setPathLengths(lengths);
    };
    measure();
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [vines]);

  return (
    <svg
      className="hero-signal-vines pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ overflow: "visible" }}
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="signalVineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.sage} stopOpacity="0.42" />
          <stop offset="55%" stopColor="#9A8B72" stopOpacity="0.48" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0.52" />
        </linearGradient>
      </defs>

      {vines.map((vine) => {
        const vineLen = pathLengths[vine.id] || Math.hypot(layout.w, layout.h) * 0.6;

        const blooms = vine.blooms.map((b) => {
          const pt = sampleBorderPath(vine.path, b.t);
          return {
            ...b,
            x: pt.x,
            y: pt.y,
            angle: pt.angle,
            animDelay: vine.delay + vine.duration * b.t * 0.9,
          };
        });

        const leaves = vine.leaves.map((t, li) => {
          const pt = sampleBorderPath(vine.path, t);
          return {
            x: pt.x,
            y: pt.y,
            angle: pt.angle,
            animDelay: vine.delay + vine.duration * t * 0.85,
            flip: li % 2 === 1,
          };
        });

        if (reducedMotion) {
          return (
            <g key={vine.id} opacity={vine.opacity}>
              <path
                d={vine.path}
                fill="none"
                stroke="url(#signalVineGrad)"
                strokeWidth={vine.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {blooms.map((b, bi) => (
                <VineRose
                  key={bi}
                  x={b.x}
                  y={b.y}
                  angle={b.angle}
                  scale={b.scale}
                  variant={b.variant}
                />
              ))}
            </g>
          );
        }

        return (
          <g key={vine.id} opacity={vine.opacity}>
            <path
              ref={(el) => {
                pathRefs.current[vine.id] = el;
              }}
              d={vine.path}
              fill="none"
              stroke="url(#signalVineGrad)"
              strokeWidth={vine.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="hero-signal-vine__stroke"
              style={
                {
                  "--vine-len": vineLen,
                  "--vine-delay": `${vine.delay}s`,
                  "--vine-duration": `${vine.duration}s`,
                } as CSSProperties
              }
            />

            {leaves.map((leaf, li) => (
              <g
                key={`leaf-${li}`}
                className="hero-signal-vine__leaf"
                style={vineLeafMotionStyle(leaf.animDelay, li)}
              >
                <VineLeaf x={leaf.x} y={leaf.y} angle={leaf.angle} flip={leaf.flip} />
              </g>
            ))}

            {blooms.map((b, bi) => (
              <g key={`bloom-${bi}`} transform={`translate(${b.x} ${b.y}) rotate(${b.angle - 90})`}>
                <g
                  className={`hero-signal-vine__bloom${b.variant === "bud" ? " hero-signal-vine__bloom--bud" : ""}`}
                  style={vineBloomMotionStyle(b.animDelay, b.scale, b.variant, bi)}
                >
                  <VineRose x={0} y={0} angle={90} scale={1} variant={b.variant} />
                </g>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function HeroFootRoots() {
  return (
    <>
      <div
        data-foot-root="A"
        className="pointer-events-none absolute bottom-[9%] left-[36%] z-[6] h-1 w-1"
        aria-hidden="true"
      />
      <div
        data-foot-root="B"
        className="pointer-events-none absolute bottom-[8%] left-[43%] z-[6] h-1 w-1"
        aria-hidden="true"
      />
      <div
        data-foot-root="C"
        className="pointer-events-none absolute bottom-[10%] left-[50%] z-[6] h-1 w-1"
        aria-hidden="true"
      />
    </>
  );
}

export const HeroFeetVineOrigin = HeroFootRoots;
