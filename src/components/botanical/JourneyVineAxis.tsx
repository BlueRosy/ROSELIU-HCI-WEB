import { palette } from "../../theme/palette";

type JourneyVineAxisProps = {
  nodeYs: number[];
  width: number;
  height: number;
};

function milestoneIndices(count: number): Set<number> {
  if (count <= 1) return new Set([0]);
  const mid = Math.floor((count - 1) / 2);
  return new Set([0, mid, count - 1]);
}

/** Tiny bud on the vine — offset from spine so it never covers timeline nodes. */
function VineBud({ x, y, flip }: { x: number; y: number; flip: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s}, 1)`} opacity="0.38">
      <path
        d="M0 0 C 2 -5, 5 -6, 5.5 -1 C 5 2.5, 2 3, 0 0"
        fill={palette.roseSoft}
        stroke={palette.primaryDeep}
        strokeWidth="0.2"
        strokeOpacity="0.25"
      />
      <path
        d="M0 1 C 1.5 4, 1.5 7, 0 9"
        fill="none"
        stroke={palette.sage}
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
}

/** Vertical vine spine aligned to measured timeline nodes. */
export default function JourneyVineAxis({ nodeYs, width, height }: JourneyVineAxisProps) {
  if (nodeYs.length === 0 || height <= 0) return null;

  const cx = width / 2;
  const accents = milestoneIndices(nodeYs.length);

  let pathD = `M ${cx} ${nodeYs[0]}`;
  for (let i = 1; i < nodeYs.length; i += 1) {
    const prevY = nodeYs[i - 1];
    const currY = nodeYs[i];
    const midY = (prevY + currY) / 2;
    const sway = i % 2 === 0 ? -10 : 10;
    pathD += ` C ${cx + sway} ${midY}, ${cx - sway} ${midY}, ${cx} ${currY}`;
  }

  return (
    <svg
      className="journey-vine-axis pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke={palette.sage}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.38"
      />
      {nodeYs.map((y, i) => {
        if (!accents.has(i)) return null;
        const offsetX = i % 2 === 0 ? 16 : -16;
        return (
          <VineBud key={i} x={cx + offsetX} y={y - 6} flip={offsetX < 0} />
        );
      })}
    </svg>
  );
}
