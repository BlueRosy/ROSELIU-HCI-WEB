import { palette } from "../../theme/palette";

type MiniRoseProps = {
  x: number;
  y: number;
  scale?: number;
  variant?: "bud" | "open";
  opacity?: number;
  rotate?: number;
};

const PETAL_ANGLES = [0, 72, 144, 216, 288];

/** Static rose glyph for section accents — no animation. */
export default function MiniRose({
  x,
  y,
  scale = 0.45,
  variant = "bud",
  opacity = 0.35,
  rotate = 0,
}: MiniRoseProps) {
  const petalCount = variant === "bud" ? 5 : 6;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
      aria-hidden="true"
    >
      <path
        d="M0 6 Q 1 14, 0 20"
        fill="none"
        stroke={palette.sage}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {PETAL_ANGLES.slice(0, petalCount).map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            d="M0 0 C 2.5 -7, 7 -8, 8 -1.5 C 7 4, 2.5 5, 0 0"
            fill={palette.roseSoft}
            stroke={palette.primaryDeep}
            strokeWidth="0.25"
            strokeOpacity="0.3"
          />
        </g>
      ))}
      {variant === "open" &&
        [36, 108, 180, 252, 324].map((angle) => (
          <g key={`i-${angle}`} transform={`rotate(${angle}) scale(0.55)`}>
            <path
              d="M0 0 C 2 -6, 5.5 -7, 6.5 -1 C 5.5 3.5, 2 4, 0 0"
              fill="#E8C4BE"
              stroke={palette.primaryDeep}
              strokeWidth="0.2"
              strokeOpacity="0.25"
            />
          </g>
        ))}
      <circle r={variant === "bud" ? 1.6 : 2} fill={palette.primaryDeep} opacity="0.65" />
    </g>
  );
}
