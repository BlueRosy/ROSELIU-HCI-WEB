import { palette } from "../../theme/palette";

type JourneyVineAxisProps = {
  nodes: { x: number; y: number }[];
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
export default function JourneyVineAxis({ nodes, width, height }: JourneyVineAxisProps) {
  if (nodes.length === 0 || height <= 0 || width <= 0) return null;

  const accents = milestoneIndices(nodes.length);
  // Keep sway modest so the vine never sweeps across cards on narrow screens
  const swayAmp = Math.min(10, Math.max(4, width * 0.025));

  let pathD = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i += 1) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const midY = (prev.y + curr.y) / 2;
    const cx = (prev.x + curr.x) / 2;
    const sway = i % 2 === 0 ? -swayAmp : swayAmp;
    pathD += ` C ${cx + sway} ${midY}, ${cx - sway} ${midY}, ${curr.x} ${curr.y}`;
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
      {nodes.map((node, i) => {
        if (!accents.has(i)) return null;
        // Buds grow toward content (right of left spine; alternate on desktop center)
        const towardRight = node.x < width * 0.35;
        const offsetX = towardRight ? 14 : i % 2 === 0 ? 16 : -16;
        return (
          <VineBud key={i} x={node.x + offsetX} y={node.y - 6} flip={offsetX < 0} />
        );
      })}
    </svg>
  );
}
