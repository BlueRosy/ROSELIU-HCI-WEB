import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { palette } from "../../theme/palette";
import {
  buildWindingVinePath,
  sampleBorderPath,
} from "./vineBorderPath";
import { VineLeaf, VineRose } from "./VineBorderDecor";

const ROSE_SLOTS = [
  { t: 0.1, scale: 0.82, variant: "bud" as const },
  { t: 0.38, scale: 1, variant: "open" as const },
  { t: 0.62, scale: 0.88, variant: "open" as const },
  { t: 0.88, scale: 0.75, variant: "bud" as const },
];

const LEAF_SLOTS = [0.22, 0.48, 0.74];

/** Card with a vine loop traced around the border and roses on the vine. */
export default function BotanicalFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: Math.round(width), h: Math.round(height) });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const vinePath = useMemo(
    () => (size.w > 0 ? buildWindingVinePath(size.w, size.h) : ""),
    [size.w, size.h],
  );

  const roses = useMemo(
    () =>
      vinePath
        ? ROSE_SLOTS.map((slot) => ({
            ...slot,
            ...sampleBorderPath(vinePath, slot.t),
          }))
        : [],
    [vinePath],
  );

  const leaves = useMemo(
    () =>
      vinePath
        ? LEAF_SLOTS.map((t, i) => ({
            ...sampleBorderPath(vinePath, t),
            flip: i % 2 === 1,
          }))
        : [],
    [vinePath],
  );

  return (
    <div
      ref={ref}
      className={`botanical-frame relative overflow-hidden rounded-[1.75rem] bg-surface/88 shadow-soft backdrop-blur-sm ${className}`}
      style={{
        boxShadow:
          "0 14px 44px rgba(47, 42, 38, 0.07), inset 0 1px 0 rgba(255, 253, 248, 0.95)",
      }}
    >
      {size.w > 0 && vinePath && (
        <svg
          className="botanical-frame__vine pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* soft inner glow following the vine */}
          <path
            d={vinePath}
            fill="none"
            stroke={palette.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.06"
          />
          {/* secondary tendril, slightly inset feel */}
          <path
            d={vinePath}
            fill="none"
            stroke={palette.line}
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.22"
            transform="translate(0.6, 0.8)"
          />
          {/* main vine */}
          <path
            d={vinePath}
            fill="none"
            stroke={palette.sage}
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.62"
            className="botanical-frame__vine-stroke"
          />
          {leaves.map((leaf, i) => (
            <VineLeaf key={i} x={leaf.x} y={leaf.y} angle={leaf.angle} flip={leaf.flip} />
          ))}
          {roses.map((rose, i) => (
            <VineRose
              key={i}
              x={rose.x}
              y={rose.y}
              angle={rose.angle}
              scale={rose.scale}
              variant={rose.variant}
            />
          ))}
        </svg>
      )}

      <div className="botanical-frame__content relative z-[1] p-8 sm:p-12">{children}</div>
    </div>
  );
}
