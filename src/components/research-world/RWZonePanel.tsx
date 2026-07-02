import { Link } from "react-router-dom";
import { projects, signalFlow, type ResearchWorldZone } from "../../content/site";
import RWFocusCards from "./RWFocusCards";

export default function RWZonePanel({
  zone,
  showItems = false,
}: {
  zone: ResearchWorldZone;
  showItems?: boolean;
}) {
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
    <div className="glass max-w-lg rounded-2xl border border-border/60 p-6 shadow-soft backdrop-blur-md">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep">
        {zone.label}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{zone.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{zone.body}</p>

      {showItems && stageItems.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {stageItems.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary-deep"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {zone.focusCards && zone.focusCards.length > 0 && (
        <RWFocusCards cards={zone.focusCards} />
      )}

      {linkedProjects.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Related projects
          </p>
          <ul className="space-y-2">
            {linkedProjects.map((project) =>
              project ? (
                <li key={project.id}>
                  <Link
                    to="/#projects"
                    className="block rounded-lg border border-border/80 bg-surface/50 px-3 py-2 text-sm text-ink transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="font-medium">{project.title}</span>
                    <span className="mt-0.5 block text-xs text-slate">{project.context}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
