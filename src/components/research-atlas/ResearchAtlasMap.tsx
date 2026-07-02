import { motion } from "framer-motion";
import { loop } from "../../content/site";
import { closedLoopGradient, palette } from "../../theme/palette";
import type { AtlasSelection, PipelineZoneId } from "./types";

const W = 820;
const H = 480;
const CX = W / 2;
const CY = H / 2 + 10;
const LOOP_RX = 330;
const LOOP_RY = 155;

const PIPELINE: {
  id: PipelineZoneId;
  label: string;
  x: number;
  color: string;
  glow: string;
}[] = [
  { id: "signals", label: "Signals", x: 170, color: palette.sage, glow: "rgba(138,146,117,0.35)" },
  { id: "states", label: "States", x: CX, color: "#7A8A9A", glow: "rgba(122,138,154,0.35)" },
  { id: "support", label: "Support", x: W - 170, color: palette.primary, glow: "rgba(185,120,111,0.35)" },
];

function loopXY(i: number) {
  const angle = (i / loop.length) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + Math.cos(angle) * LOOP_RX,
    y: CY + Math.sin(angle) * LOOP_RY,
  };
}

function isSelected(sel: AtlasSelection, kind: AtlasSelection["kind"], id: string) {
  return sel.kind === kind && (sel.kind === "pipeline" ? sel.id === id : sel.key === id);
}

export default function ResearchAtlasMap({
  selection,
  onSelect,
}: {
  selection: AtlasSelection;
  onSelect: (sel: AtlasSelection) => void;
}) {
  const py = CY + 20;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface/90 via-bg/95 to-section/40 p-4 shadow-soft backdrop-blur-sm sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(185,120,111,0.08), transparent 45%), radial-gradient(circle at 70% 60%, rgba(138,146,117,0.1), transparent 40%)",
        }}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative z-10 h-auto w-full"
        role="img"
        aria-label="Interactive research atlas: Signals, States, Support, and closed-loop systems"
      >
        <defs>
          <linearGradient id="atlasPipeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.sage} />
            <stop offset="50%" stopColor="#9AA8B5" />
            <stop offset="100%" stopColor={palette.primary} />
          </linearGradient>
          <linearGradient id="atlasLoopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={closedLoopGradient.start} />
            <stop offset="100%" stopColor={closedLoopGradient.end} />
          </linearGradient>
          <filter id="atlasGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1={60}
            y1={80 + i * 80}
            x2={W - 60}
            y2={80 + i * 80}
            stroke={palette.border}
            strokeWidth="0.5"
            opacity="0.35"
          />
        ))}

        {/* Loop ring */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={LOOP_RX}
          ry={LOOP_RY}
          fill="none"
          stroke="url(#atlasLoopGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.55"
        />

        {/* Pipeline spine */}
        <motion.path
          d={`M ${PIPELINE[0].x} ${py} L ${PIPELINE[1].x} ${py} L ${PIPELINE[2].x} ${py}`}
          fill="none"
          stroke="url(#atlasPipeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Connect pipeline to loop */}
        {PIPELINE.map((node) => {
          const targets =
            node.id === "signals"
              ? [0, 1]
              : node.id === "states"
                ? [1, 2]
                : [2, 3, 4];
          return targets.map((li) => {
            const lp = loopXY(li);
            const active =
              isSelected(selection, "pipeline", node.id) ||
              isSelected(selection, "loop", loop[li].key);
            return (
              <line
                key={`${node.id}-${loop[li].key}`}
                x1={node.x}
                y1={py}
                x2={lp.x}
                y2={lp.y}
                stroke={node.color}
                strokeWidth={active ? 1.2 : 0.6}
                opacity={active ? 0.45 : 0.12}
              />
            );
          });
        })}

        {/* Loop nodes */}
        {loop.map((node, i) => {
          const { x, y } = loopXY(i);
          const active = isSelected(selection, "loop", node.key);
          const t = loop.length > 1 ? i / (loop.length - 1) : 0;
          const color = `color-mix(in srgb, ${closedLoopGradient.start} ${(1 - t) * 100}%, ${closedLoopGradient.end})`;

          return (
            <g key={node.key}>
              <motion.circle
                cx={x}
                cy={y}
                r={active ? 28 : 22}
                fill={active ? `${color}` : "rgba(255,253,248,0.9)"}
                stroke={color}
                strokeWidth={active ? 2 : 1.2}
                opacity={active ? 1 : 0.85}
                filter={active ? "url(#atlasGlow)" : undefined}
                animate={{ scale: active ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
                onClick={() => onSelect({ kind: "loop", key: node.key })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect({ kind: "loop", key: node.key });
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={node.label}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="IBM Plex Mono, monospace"
                fill={active ? palette.ink : palette.slate}
                pointerEvents="none"
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x={x}
                y={y + (y < CY ? -32 : 42)}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Fraunces, Georgia, serif"
                fill={active ? palette.ink : palette.slate}
                pointerEvents="none"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Pipeline nodes */}
        {PIPELINE.map((node) => {
          const active = isSelected(selection, "pipeline", node.id);
          return (
            <g key={node.id}>
              {active && (
                <circle
                  cx={node.x}
                  cy={py}
                  r={52}
                  fill={node.glow}
                  filter="url(#atlasGlow)"
                />
              )}
              <motion.circle
                cx={node.x}
                cy={py}
                r={active ? 44 : 38}
                fill="rgba(255,253,248,0.95)"
                stroke={node.color}
                strokeWidth={active ? 2.5 : 1.5}
                animate={{ scale: active ? 1.04 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ transformOrigin: `${node.x}px ${py}px`, cursor: "pointer" }}
                onClick={() => onSelect({ kind: "pipeline", id: node.id })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect({ kind: "pipeline", id: node.id });
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={node.label}
              />
              <text
                x={node.x}
                y={py - 58}
                textAnchor="middle"
                fontSize="15"
                fontWeight="500"
                fontFamily="Fraunces, Georgia, serif"
                fill={active ? palette.ink : palette.slate}
                pointerEvents="none"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        <text
          x={CX}
          y={36}
          textAnchor="middle"
          fontSize="10"
          fontFamily="IBM Plex Mono, monospace"
          fill={palette.slate}
          letterSpacing="0.12em"
        >
          CLOSED-LOOP SYSTEMS
        </text>
        <text
          x={CX}
          y={H - 24}
          textAnchor="middle"
          fontSize="10"
          fontFamily="IBM Plex Mono, monospace"
          fill={palette.slate}
          letterSpacing="0.12em"
        >
          SIGNALS → STATES → SUPPORT
        </text>
      </svg>

      <p className="relative z-10 mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate/80">
        Click a node to explore · Hover connections to trace the research logic
      </p>
    </div>
  );
}
