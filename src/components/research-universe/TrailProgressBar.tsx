import { researchWorld } from "../../content/site";
import { TRAIL_STOPS } from "./worldTrailConfig";

const STOP_LABELS = Object.fromEntries(
  TRAIL_STOPS.map((s) => {
    const zone = researchWorld.zones.find((z) => z.id === s.zoneId);
    return [s.section, zone?.label ?? s.section];
  }),
);

export default function TrailProgressBar({
  activeSection,
}: {
  activeSection: string;
}) {
  const stops = TRAIL_STOPS.filter((s) => s.section !== "projects");

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
      <div className="glass flex items-center gap-1 rounded-full border border-border/50 px-3 py-2 shadow-soft backdrop-blur-md">
        {stops.map((stop) => {
          const active = activeSection === stop.section;
          return (
            <span
              key={stop.section}
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition ${
                active
                  ? "bg-primary/15 text-primary-deep"
                  : "text-slate/70"
              }`}
            >
              {STOP_LABELS[stop.section]?.split(" ")[0] ?? stop.section}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-slate/80">
        Scroll to explore the research trail
      </p>
    </div>
  );
}
