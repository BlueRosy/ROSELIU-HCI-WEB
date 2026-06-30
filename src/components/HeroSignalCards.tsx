import { signalFlow } from "../content/site";
import { parallaxPx, useHeroParallax } from "../hooks/useHeroParallax.tsx";

const STAGE_ACCENT = ["border-l-sage", "border-l-primary", "border-l-primary-deep"] as const;

const DESKTOP_LAYOUT = [
  {
    className: "md:absolute md:-right-1 md:top-0 md:z-20 md:w-[9.5rem] md:rotate-2",
    depth: 0.5,
    node: { cx: 88, cy: 10 },
  },
  {
    className: "md:absolute md:-left-3 md:top-[22%] md:z-20 md:w-[9.5rem] md:-rotate-1",
    depth: 0.65,
    node: { cx: 12, cy: 32 },
  },
  {
    className: "md:absolute md:-right-1 md:top-[42%] md:z-20 md:w-[10rem] md:rotate-1",
    depth: 0.55,
    node: { cx: 82, cy: 52 },
  },
] as const;

function SignalCard({
  label,
  items,
  accentClass,
}: {
  label: string;
  items: readonly string[];
  accentClass: string;
}) {
  return (
    <div
      className={`paper-card pointer-events-auto rounded-xl border-l-[3px] p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift ${accentClass}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary-deep">
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate">
        {items.join(" · ")}
      </p>
    </div>
  );
}

function VineConnector() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 hidden md:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M88 10 C74 18, 58 26, 44 34 S26 44, 12 32 C24 46, 48 58, 82 52"
        fill="none"
        stroke="#B9786F"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeDasharray="1.2 1.8"
        opacity="0.4"
      />
      {DESKTOP_LAYOUT.map((layout, i) => (
        <circle
          key={layout.node.cx}
          cx={layout.node.cx}
          cy={layout.node.cy}
          r="1.2"
          fill={i === 2 ? "#8F514C" : i === 1 ? "#B9786F" : "#8A9275"}
          opacity="0.55"
        />
      ))}
    </svg>
  );
}

export default function HeroSignalCards() {
  const parallax = useHeroParallax();

  return (
    <div className="relative mt-4 w-full md:mt-0 md:absolute md:inset-0 md:pointer-events-none">
      <VineConnector />
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-primary-deep/80 md:sr-only">
        {signalFlow.pipeline.join(" → ")}
      </p>
      <div className="flex flex-col gap-2 md:block">
        {signalFlow.stages.map((stage, i) => {
          const layout = DESKTOP_LAYOUT[i];
          const offset = parallaxPx(parallax, layout.depth);
          return (
            <div key={stage.label} className={layout.className}>
              <div
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
              >
                <SignalCard
                  label={stage.label}
                  items={stage.items}
                  accentClass={STAGE_ACCENT[i]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
