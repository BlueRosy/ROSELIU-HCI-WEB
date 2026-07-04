import { researchWorld } from "../../content/site";
import {
  TRAIL_STOP_LABELS,
  TRAIL_STOPS,
  type ScrollSection,
} from "./worldTrailConfig";

const STOP_LABELS = Object.fromEntries(
  TRAIL_STOPS.map((s) => {
    const zone = researchWorld.zones.find((z) => z.id === s.zoneId);
    return [s.section, zone?.label ?? TRAIL_STOP_LABELS[s.section]];
  }),
) as Record<ScrollSection, string>;

export default function TrailProgressBar({
  activeSection,
  onNavigate,
  onReplayIntro,
}: {
  activeSection: ScrollSection;
  onNavigate: (section: ScrollSection) => void;
  onReplayIntro?: () => void;
}) {
  return (
    <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
      <div className="glass flex items-center gap-1 rounded-full border border-border/50 px-3 py-2 shadow-soft backdrop-blur-md">
        {onReplayIntro && (
          <>
            <button
              type="button"
              onClick={onReplayIntro}
              className="pointer-events-auto rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-primary transition hover:bg-primary/10 hover:text-primary-deep"
              title="Return to the Rose Sky Castle intro"
            >
              ✦ Sky Castle
            </button>
            <span className="mx-0.5 h-3 w-px bg-border/60" aria-hidden />
          </>
        )}
        {TRAIL_STOPS.map((stop) => {
          const active = activeSection === stop.section;
          const label = STOP_LABELS[stop.section]?.split(" ")[0] ?? stop.section;
          return (
            <button
              key={stop.section}
              type="button"
              onClick={() => onNavigate(stop.section)}
              className={`pointer-events-auto rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition ${
                active
                  ? "bg-primary/15 text-primary-deep"
                  : "text-slate/70 hover:bg-primary/8 hover:text-primary"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-slate/80">
        Scroll · ↑ ↓ · Space — or tap a stop
      </p>
    </div>
  );
}
