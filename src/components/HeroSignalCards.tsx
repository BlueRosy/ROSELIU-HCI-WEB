import { signalFlow } from "../content/site";
import { parallaxPx, useHeroParallax } from "../hooks/useHeroParallax.tsx";

const DESKTOP_LAYOUT = [
  { className: "md:absolute md:-right-2 md:top-0 md:z-20 md:w-[9.5rem] md:rotate-2", depth: 0.5 },
  {
    className: "md:absolute md:-left-4 md:top-[38%] md:z-20 md:w-[9.5rem] md:-rotate-1",
    depth: 0.65,
  },
  {
    className: "md:absolute md:-right-1 md:bottom-4 md:z-20 md:w-[10rem] md:rotate-1",
    depth: 0.55,
  },
] as const;

function SignalCard({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  return (
    <div className="glass-hero pointer-events-auto rounded-xl p-3 transition duration-300 hover:-translate-y-0.5 hover:border-white/90">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary-deep">
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate">
        {items.join(" · ")}
      </p>
    </div>
  );
}

export default function HeroSignalCards() {
  const parallax = useHeroParallax();

  return (
    <div className="relative mt-4 w-full md:mt-0 md:absolute md:inset-0 md:pointer-events-none">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-primary-deep/80 md:sr-only">
        Signals → States → Support
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
                <SignalCard label={stage.label} items={stage.items} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
