import { Suspense, lazy, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { loop } from "../content/site";
import CardBotanicalAccent from "./botanical/CardBotanicalAccent";
import { closedLoopGradient, palette } from "../theme/palette";

const ClosedLoopScene = lazy(() => import("../three/ClosedLoopScene"));

const RADIUS = 120;
const CENTER = 160;

function nodeXY(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
}

function LoopSVG({ activeKey }: { activeKey: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-full w-full"
      role="img"
      aria-label="Closed-loop framework: Sensing, Interpretation, Intervention Selection, Action, Sustainability and Safety"
    >
      <defs>
        <linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={closedLoopGradient.start} />
          <stop offset="0.5" stopColor={palette.primary} />
          <stop offset="1" stopColor={closedLoopGradient.end} />
        </linearGradient>
      </defs>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="url(#loopGrad)"
        strokeWidth="2"
        strokeDasharray="4 6"
        opacity="0.6"
      />
      {loop.map((n, i) => {
        const { x, y } = nodeXY(i, loop.length);
        const isActive = n.key === activeKey;
        const t = loop.length > 1 ? i / (loop.length - 1) : 0;
        const color = `color-mix(in srgb, ${closedLoopGradient.start} ${(1 - t) * 100}%, ${closedLoopGradient.end})`;
        return (
          <g key={n.key}>
            {(isActive || n.current) && (
              <circle
                cx={x}
                cy={y}
                r={isActive ? 18 : 15}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity={isActive ? 0.8 : 0.4}
              />
            )}
            <circle cx={x} cy={y} r={isActive ? 11 : 8} fill={color} />
            <text
              x={x}
              y={y - 22}
              textAnchor="middle"
              fontSize="9"
              fontFamily="IBM Plex Mono, monospace"
              fill={isActive ? palette.ink : palette.slate}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <g opacity="0.22" transform={`translate(${CENTER} ${CENTER})`}>
        <circle r="6" fill={palette.primaryDeep} opacity="0.5" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle})`}
            d="M0 0 C 1.5 -4, 4 -5, 4.5 -0.5 C 4 2.5, 1.5 3, 0 0"
            fill={palette.roseSoft}
          />
        ))}
      </g>
    </svg>
  );
}

export default function ClosedLoop({ enable3D }: { enable3D: boolean }) {
  const initial = loop.find((n) => n.current)?.key ?? loop[0].key;
  const [activeKey, setActiveKey] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const activeNode = loop.find((n) => n.key === activeKey) ?? loop[0];

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]"
    >
      {/* Visualization */}
      <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/8 to-accent/8 blur-2xl" />
        {enable3D ? (
          <Suspense fallback={<LoopSVG activeKey={activeKey} />}>
            <ClosedLoopScene
              nodes={loop}
              activeKey={activeKey}
              onActivate={setActiveKey}
              active={inView}
            />
          </Suspense>
        ) : (
          <LoopSVG activeKey={activeKey} />
        )}
      </div>

      {/* Selector + detail */}
      <div>
        <ol className="flex flex-wrap gap-2" aria-label="Framework stages">
          {loop.map((n, i) => {
            const isActive = n.key === activeKey;
            return (
              <li key={n.key}>
                <button
                  type="button"
                  onClick={() => setActiveKey(n.key)}
                  onMouseEnter={() => setActiveKey(n.key)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary-deep"
                      : "border-border bg-surface/60 text-slate hover:border-primary/30"
                  }`}
                >
                  <span className="font-mono text-xs opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {n.label}
                  {n.current && (
                    <span className="rounded-full bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] text-accent-deep">
                      focus
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="glass relative mt-6 overflow-hidden rounded-2xl border-l-[3px] border-l-sage p-6 shadow-soft">
          <CardBotanicalAccent position="top-right" className="opacity-[0.14]" />
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl text-ink">{activeNode.label}</h3>
            {activeNode.current && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent-deep">
                current focus
              </span>
            )}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-slate">
            {activeNode.body}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {activeNode.items.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary-deep"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
