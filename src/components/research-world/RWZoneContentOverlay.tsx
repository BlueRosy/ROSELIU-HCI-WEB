import { Suspense } from "react";
import { X } from "lucide-react";
import ClosedLoop from "../ClosedLoop";
import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWFocusCards from "./RWFocusCards";
import { projects, signalFlow } from "../../content/site";
import { Link } from "react-router-dom";
import { zoneById } from "./rwWorldConfig";

function ZoneContent({ zoneId }: { zoneId: string }) {
  const zone = zoneById(researchWorld.zones, zoneId);
  if (!zone) return null;

  const linkedProjects =
    zone.projectIds?.map((id) => projects.find((p) => p.id === id)).filter(Boolean) ?? [];

  const stageItems =
    zone.id === "signals"
      ? signalFlow.stages[0].items
      : zone.id === "states"
        ? signalFlow.stages[1].items
        : zone.id === "support"
          ? signalFlow.stages[2].items
          : [];

  return (
    <div className="max-h-[min(50vh,480px)] overflow-y-auto pr-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep">
        {zone.label}
      </p>
      <h2 className="mt-2 font-serif text-xl text-ink sm:text-2xl">{zone.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">{zone.body}</p>

      {stageItems.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {stageItems.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary-deep"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {zone.focusCards && zone.focusCards.length > 0 && (
        <div className="mt-4">
          <RWFocusCards cards={zone.focusCards} />
        </div>
      )}

      {linkedProjects.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Related projects
          </p>
          <ul className="space-y-1.5">
            {linkedProjects.map((project) =>
              project ? (
                <li key={project.id}>
                  <Link
                    to="/#projects"
                    className="block rounded-lg border border-border/80 bg-surface/50 px-2.5 py-1.5 text-xs text-ink transition hover:border-primary/30"
                  >
                    <span className="font-medium">{project.title}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      )}

      {zoneId === "loop" && (
        <div className="mt-4 rounded-xl border border-border/60 p-3">
          <Suspense fallback={<p className="text-xs text-slate">Loading loop…</p>}>
            <ClosedLoop enable3D={false} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default function RWZoneContentOverlay({
  zoneId,
  onClose,
}: {
  zoneId: string;
  onClose: () => void;
}) {
  return (
    <div
      className="pointer-events-auto fixed bottom-20 right-4 z-40 w-full max-w-sm md:right-6"
      role="dialog"
      aria-modal="true"
      aria-label="Zone content"
    >
      <div
        className="relative rounded-2xl border p-5 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: rwWonderland.hudBg,
          borderColor: rwWonderland.hudBorder,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-slate transition hover:bg-primary/10"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <ZoneContent zoneId={zoneId} />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate/70">
          Esc to close
        </p>
      </div>
    </div>
  );
}
