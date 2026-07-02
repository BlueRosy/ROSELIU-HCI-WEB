import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";

const NAV_ZONES = researchWorld.zones;

export default function RWZoneProgressBar({
  activeZoneId,
  onSelect,
}: {
  activeZoneId: string | null;
  onSelect: (zoneId: string) => void;
}) {
  return (
    <nav
      className="pointer-events-auto fixed bottom-5 left-1/2 z-30 flex max-w-[min(96vw,720px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border px-2 py-1.5 backdrop-blur-md"
      style={{
        backgroundColor: rwWonderland.hudBg,
        borderColor: rwWonderland.hudBorder,
      }}
      aria-label="Research map zones"
    >
      {NAV_ZONES.map((zone, i) => {
        const isActive = activeZoneId === zone.id || (!activeZoneId && zone.id === "entry");
        return (
          <div key={zone.id} className="flex items-center gap-1">
            {i > 0 && (
              <span className="px-0.5 font-mono text-[10px] text-slate/40" aria-hidden="true">
                →
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(zone.id)}
              aria-current={isActive ? "step" : undefined}
              className="shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition"
              style={
                isActive
                  ? {
                      borderColor: "rgba(185, 120, 111, 0.5)",
                      backgroundColor: "rgba(185, 120, 111, 0.15)",
                      color: rwWonderland.pathGlowBright,
                    }
                  : {
                      borderColor: "transparent",
                      color: rwWonderland.textMuted,
                    }
              }
            >
              {zone.id === "entry" ? "Entry" : zone.label.split(" ")[0]}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
