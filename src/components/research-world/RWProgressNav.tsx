import type { ResearchWorldZone } from "../../content/site";

export default function RWProgressNav({
  zones,
  activeId,
  onSelect,
}: {
  zones: ResearchWorldZone[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
      aria-label="Research map zones"
    >
      {zones.map((zone) => {
        const isActive = zone.id === activeId;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            aria-current={isActive ? "step" : undefined}
            className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-left transition ${
              isActive
                ? "border-primary/40 bg-primary/10 text-primary-deep"
                : "border-transparent bg-surface/40 text-slate hover:border-border hover:bg-surface/80"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition ${
                isActive ? "bg-primary-deep" : "bg-border group-hover:bg-primary/50"
              }`}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider">{zone.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
