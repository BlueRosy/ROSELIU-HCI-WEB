import { palette } from "../../theme/palette";

/** Small rose sitting on the vine at a path sample point. */
export function VineRose({
  x,
  y,
  angle,
  scale = 1,
  variant = "open",
}: {
  x: number;
  y: number;
  angle: number;
  scale?: number;
  variant?: "bud" | "open";
}) {
  const angles = variant === "bud" ? [0, 72, 144, 216, 288] : [0, 60, 120, 180, 240, 300];
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle - 90}) scale(${scale})`}>
      <path
        d="M0 2 Q 0.5 8, 0 14"
        fill="none"
        stroke={palette.sage}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
      <g transform="translate(0, -1)">
        {angles.map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M0 0 C 2.8 -7.5, 8 -8.5, 9 -1.2 C 8 4.5, 2.8 5.5, 0 0"
            fill={variant === "open" ? palette.roseSoft : "#C9958E"}
            stroke={palette.primaryDeep}
            strokeWidth="0.25"
            strokeOpacity="0.35"
          />
        ))}
        {variant === "open" &&
          [30, 90, 150, 210, 270, 330].map((a) => (
            <path
              key={`in-${a}`}
              transform={`rotate(${a}) scale(0.55)`}
              d="M0 0 C 2 -5.5, 5.5 -6.5, 6.5 -1 C 5.5 3, 2 3.5, 0 0"
              fill="#E8C4BE"
              stroke={palette.primaryDeep}
              strokeWidth="0.2"
              strokeOpacity="0.25"
            />
          ))}
        <circle r={variant === "open" ? 2 : 1.6} fill={palette.primaryDeep} opacity="0.72" />
      </g>
    </g>
  );
}

/** Tiny leaf on the vine. */
export function VineLeaf({
  x,
  y,
  angle,
  flip,
}: {
  x: number;
  y: number;
  angle: number;
  flip?: boolean;
}) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${s}, 1)`} opacity="0.42">
      <path
        d="M0 0 C 4 2, 7 6, 6 10 C 3 7, 1 4, 0 0"
        fill={palette.sage}
        opacity="0.35"
      />
    </g>
  );
}
