import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  buildRoseTrack,
  HERO_ROSES,
  HERO_VINE_PATHS,
  samplePathPoint,
  type HeroRoseSpec,
  type PathPoint,
} from "./botanical/heroVinePaths";
import type { CSSProperties } from "react";

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const INNER_ANGLES = [30, 90, 150, 210, 270, 330];
const BLOOM_DURATION = 8;

function RoseHead({
  delay,
  staticBloom = false,
}: {
  delay: number;
  staticBloom?: boolean;
}) {
  return (
    <g className={staticBloom ? "hero-rose__head hero-rose__head--static" : "hero-rose__head"}>
      {PETAL_ANGLES.map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            className="hero-rose__petal"
            style={
              {
                "--petal-i": i,
                "--rose-delay": `${delay + i * 0.1}s`,
              } as CSSProperties
            }
            d="M0 0 C 3 -10, 9 -12, 10 -2 C 9 6, 3 8, 0 0"
            fill="url(#rosePetalFill)"
            stroke="#8F514C"
            strokeWidth="0.35"
            strokeOpacity="0.35"
          />
        </g>
      ))}

      {INNER_ANGLES.map((angle, i) => (
        <g key={`inner-${angle}`} transform={`rotate(${angle}) scale(0.62)`}>
          <path
            className="hero-rose__petal hero-rose__petal--inner"
            style={
              {
                "--petal-i": i,
                "--rose-delay": `${delay + 0.9 + i * 0.08}s`,
              } as CSSProperties
            }
            d="M0 0 C 2.5 -8, 7 -9, 8 -1.5 C 7 5, 2.5 6, 0 0"
            fill="url(#rosePetalInner)"
            stroke="#8F514C"
            strokeWidth="0.3"
            strokeOpacity="0.3"
          />
        </g>
      ))}

      <circle
        className="hero-rose__center"
        style={{ animationDelay: `${delay + 0.4}s` }}
        r={2.8}
        fill="#8F514C"
        opacity="0.7"
      />
    </g>
  );
}

function RoseGraphic({ delay, scale, staticBloom }: { delay: number; scale: number; staticBloom?: boolean }) {
  return (
    <g transform={`scale(${scale})`}>
      {/* Anchor on vine: stem runs along path; bloom sits above contact point */}
      <path
        d="M0 0 Q 2 8, 0 18"
        fill="none"
        stroke="#8A9275"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.65"
        className={staticBloom ? undefined : "hero-rose__stem"}
      />
      <g transform="translate(0, -2)">
        <RoseHead delay={delay} staticBloom={staticBloom} />
      </g>
      {/* Small leaf pair at stem base */}
      <path
        d="M0 4 C -4 6, -5 9, -3 10"
        fill="none"
        stroke="#8A9275"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M0 5 C 4 7, 5 10, 3 11"
        fill="none"
        stroke="#8A9275"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.3"
      />
    </g>
  );
}

function RoseFlower({ spec, reducedMotion }: { spec: HeroRoseSpec; reducedMotion: boolean }) {
  const { pathId, startOffset, midOffset, endOffset, scale, delay } = spec;
  const pathD = HERO_VINE_PATHS[pathId];
  const [track, setTrack] = useState<PathPoint[] | null>(null);
  const [rest, setRest] = useState<PathPoint | null>(null);

  useEffect(() => {
    setTrack(buildRoseTrack(pathD, startOffset, midOffset, endOffset));
    setRest(samplePathPoint(pathD, endOffset));
  }, [pathD, startOffset, midOffset, endOffset]);

  const innerStyle = useMemo(
    () =>
      ({
        "--rose-root-delay": `${delay}s`,
        "--rose-bloom-duration": `${BLOOM_DURATION}s`,
      }) as CSSProperties,
    [delay],
  );

  if (!track || !rest) return null;

  if (reducedMotion) {
    return (
      <g
        className="hero-rose"
        style={innerStyle}
        transform={`translate(${rest.x}, ${rest.y}) rotate(${rest.angle})`}
      >
        <RoseGraphic delay={0} scale={scale} staticBloom />
      </g>
    );
  }

  const xs = track.map((p) => p.x);
  const ys = track.map((p) => p.y);
  const rotates = track.map((p) => p.angle);

  return (
    <motion.g
      className="hero-rose"
      style={innerStyle}
      initial={{ x: xs[0], y: ys[0], rotate: rotates[0] }}
      animate={{ x: xs, y: ys, rotate: rotates }}
      transition={{
        duration: BLOOM_DURATION,
        delay,
        times: [0, 0.22, 0.55, 0.78, 1],
        ease: [0.25, 0.1, 0.2, 1],
      }}
    >
      <RoseGraphic delay={delay} scale={scale} />
    </motion.g>
  );
}

/** Roses that travel along vine paths while blooming bud → full. */
export default function HeroRoseBlooms() {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      className="hero-botanical__roses pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rosePetalFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A59E" />
          <stop offset="55%" stopColor="#B9786F" />
          <stop offset="100%" stopColor="#8F514C" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="rosePetalInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C4BE" />
          <stop offset="100%" stopColor="#B9786F" />
        </linearGradient>
      </defs>

      {HERO_ROSES.map((spec) => (
        <RoseFlower
          key={`${spec.pathId}-${spec.startOffset}-${spec.delay}`}
          spec={spec}
          reducedMotion={!!reducedMotion}
        />
      ))}
    </svg>
  );
}
