import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import {
  buildFigureGardenVines,
  buildFigureScatterBlooms,
  type FigureGardenLayout,
} from "./figureGardenLayout";
import { sampleBorderPath } from "./vineBorderPath";
import { VineLeaf, VineRose } from "./VineBorderDecor";
import { vineBloomMotionStyle, vineLeafMotionStyle } from "./vineBloomMotion";

/** Vines that wrap the profile — blooms settle on hair, shoulder, dress. */
export default function HeroFigureGarden({ layout }: { layout: FigureGardenLayout }) {
  const reducedMotion = useReducedMotion();
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [pathLengths, setPathLengths] = useState<Record<string, number>>({});

  const vines = useMemo(() => buildFigureGardenVines(layout), [layout]);
  const scatterBlooms = useMemo(() => buildFigureScatterBlooms(layout), [layout]);

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
      className="hero-figure-garden pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible" }}
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="figureGardenGrad" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#8A9275" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#B9786F" stopOpacity="0.42" />
        </linearGradient>
      </defs>

      {vines.map((vine) => {
        const vineLen = pathLengths[vine.id] || Math.hypot(layout.w, layout.h) * 0.45;

        const blooms = vine.blooms.map((b) => {
          const pt = sampleBorderPath(vine.path, b.t);
          return {
            ...b,
            x: pt.x,
            y: pt.y,
            angle: pt.angle,
            animDelay: vine.delay + vine.duration * b.t * 0.92,
          };
        });

        const leaves = vine.leaves.map((t, li) => {
          const pt = sampleBorderPath(vine.path, t);
          return {
            x: pt.x,
            y: pt.y,
            angle: pt.angle,
            animDelay: vine.delay + vine.duration * t * 0.88,
            flip: li % 2 === 1,
          };
        });

        return (
          <g key={vine.id}>
            <path
              ref={(el) => {
                pathRefs.current[vine.id] = el;
              }}
              d={vine.path}
              fill="none"
              stroke="url(#figureGardenGrad)"
              strokeWidth={vine.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={vine.opacity}
              vectorEffect="non-scaling-stroke"
              className={reducedMotion ? undefined : "hero-signal-vine__stroke"}
              style={
                reducedMotion
                  ? undefined
                  : ({
                      "--vine-len": vineLen,
                      "--vine-delay": `${vine.delay}s`,
                      "--vine-duration": `${vine.duration}s`,
                    } as CSSProperties)
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
                  className={`hero-signal-vine__bloom hero-figure-garden__bloom${b.variant === "bud" ? " hero-signal-vine__bloom--bud" : ""}`}
                  style={vineBloomMotionStyle(b.animDelay, b.scale, b.variant, bi)}
                >
                  <VineRose x={0} y={0} angle={90} scale={1} variant={b.variant} />
                </g>
              </g>
            ))}
          </g>
        );
      })}

      {scatterBlooms.map((b, bi) => (
        <g key={b.id} transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}>
          <g
            className={`hero-signal-vine__bloom hero-figure-garden__bloom hero-figure-garden__bloom--scatter${b.variant === "bud" ? " hero-signal-vine__bloom--bud" : ""}`}
            style={vineBloomMotionStyle(b.delay, b.scale, b.variant, bi + 12)}
          >
            <VineRose x={0} y={0} angle={90} scale={1} variant={b.variant} />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Anchor points — outer silhouette; hair is right-rear, clear of eyes. */
export function HeroFigureAnchors() {
  const anchors: { key: string; className: string }[] = [
    { key: "hair", className: "left-[72%] top-[6%]" },
    { key: "shoulder", className: "left-[67%] top-[27%]" },
    { key: "dress", className: "left-[32%] top-[60%]" },
    { key: "hem", className: "left-[30%] top-[67%]" },
  ];

  return (
    <>
      {anchors.map(({ key, className }) => (
        <div
          key={key}
          data-figure-anchor={key}
          className={`pointer-events-none absolute z-[6] h-1 w-1 ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
