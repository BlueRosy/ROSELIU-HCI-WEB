import type { CSSProperties } from "react";

type RoseSpec = {
  x: number;
  y: number;
  scale: number;
  delay: number;
  variant: "open" | "bud";
};

const ROSES: RoseSpec[] = [
  { x: 1040, y: 195, scale: 1, delay: 0.4, variant: "open" },
  { x: 255, y: 555, scale: 0.85, delay: 1.6, variant: "open" },
  { x: 1120, y: 520, scale: 0.7, delay: 2.8, variant: "bud" },
  { x: 85, y: 120, scale: 0.65, delay: 0.9, variant: "bud" },
  { x: 920, y: 680, scale: 0.8, delay: 2.1, variant: "open" },
  { x: 580, y: 90, scale: 0.55, delay: 1.2, variant: "bud" },
  { x: 380, y: 720, scale: 0.72, delay: 3.4, variant: "open" },
  { x: 1180, y: 310, scale: 0.58, delay: 2.5, variant: "bud" },
];

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

function RoseFlower({ spec }: { spec: RoseSpec }) {
  const { x, y, scale, delay, variant } = spec;
  const petalCount = variant === "bud" ? 5 : 6;

  return (
    <g
      className="hero-rose"
      transform={`translate(${x} ${y}) scale(${scale})`}
      style={{ "--rose-root-delay": `${delay}s` } as CSSProperties}
    >
      {/* stem snippet */}
      <path
        d="M0 8 Q 2 18, 0 28"
        fill="none"
        stroke="#8A9275"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
        className="hero-rose__stem"
      />

      <g className="hero-rose__head">
        {PETAL_ANGLES.slice(0, petalCount).map((angle, i) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              className="hero-rose__petal"
              style={
                {
                  "--petal-i": i,
                  "--rose-delay": `${delay + i * 0.12}s`,
                } as CSSProperties
              }
              d="M0 0 C 3 -10, 9 -12, 10 -2 C 9 6, 3 8, 0 0"
              fill={`url(#rosePetalFill-${variant})`}
              stroke="#8F514C"
              strokeWidth="0.35"
              strokeOpacity="0.35"
            />
          </g>
        ))}

        {/* inner petals for open rose */}
        {variant === "open" &&
          [30, 90, 150, 210, 270, 330].map((angle, i) => (
            <g key={`inner-${angle}`} transform={`rotate(${angle}) scale(0.62)`}>
              <path
                className="hero-rose__petal hero-rose__petal--inner"
                style={
                  {
                    "--petal-i": i,
                    "--rose-delay": `${delay + 0.5 + i * 0.1}s`,
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
          style={{ animationDelay: `${delay + 0.85}s` }}
          r={variant === "bud" ? 2.2 : 2.8}
          fill="#8F514C"
          opacity="0.7"
        />
      </g>
    </g>
  );
}

/** Hand-drawn roses with staggered bloom — editorial, not fantasy. */
export default function HeroRoseBlooms() {
  return (
    <svg
      className="hero-botanical__roses pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rosePetalFill-open" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A59E" />
          <stop offset="55%" stopColor="#B9786F" />
          <stop offset="100%" stopColor="#8F514C" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="rosePetalFill-bud" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9958E" />
          <stop offset="100%" stopColor="#A86B65" />
        </linearGradient>
        <linearGradient id="rosePetalInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C4BE" />
          <stop offset="100%" stopColor="#B9786F" />
        </linearGradient>
      </defs>

      {ROSES.map((spec) => (
        <RoseFlower key={`${spec.x}-${spec.y}-${spec.scale}`} spec={spec} />
      ))}
    </svg>
  );
}
