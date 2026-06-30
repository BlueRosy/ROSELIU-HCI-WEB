import { palette } from "../../theme/palette";
import MiniRose from "./MiniRose";

type NewsVineTimelineProps = {
  itemCount: number;
};

/** Left vine spine for News full timeline. */
export default function NewsVineTimeline({ itemCount }: NewsVineTimelineProps) {
  const height = Math.max(itemCount * 72, 120);

  return (
    <svg
      className="pointer-events-none absolute top-0 left-3 hidden h-full w-8 sm:block"
      viewBox={`0 0 32 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={`M16 8 C 10 ${height * 0.25}, 22 ${height * 0.55}, 16 ${height - 8}`}
        fill="none"
        stroke={palette.sage}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      {Array.from({ length: itemCount }, (_, i) => {
        const y = 16 + (i / Math.max(itemCount - 1, 1)) * (height - 32);
        const showRose = i === 0 || i === itemCount - 1 || i % 3 === 0;
        return (
          <g key={i}>
            <line
              x1="16"
              y1={y}
              x2="28"
              y2={y}
              stroke={palette.primary}
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.35"
            />
            <circle cx="16" cy={y} r="3" fill={palette.sage} opacity="0.55" />
            {showRose && (
              <MiniRose
                x={19}
                y={y - 8}
                scale={i === 0 || i === itemCount - 1 ? 0.55 : 0.45}
                variant={i === itemCount - 1 ? "open" : "bud"}
                opacity={0.65}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
