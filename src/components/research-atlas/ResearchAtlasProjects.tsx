import { Link } from "react-router-dom";
import { projects, researchAtlas } from "../../content/site";
import { Reveal, SectionHeading } from "../primitives";

const ZONE_LABELS: Record<string, string> = {
  signals: "Signals",
  states: "States",
  support: "Support",
};

export default function ResearchAtlasProjects() {
  return (
    <Reveal>
      <SectionHeading
        eyebrow="Project evidence"
        title="How projects support the agenda"
        intro="Each project is evidence for a part of the signals-to-support pipeline — not a standalone demo."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {researchAtlas.projectEvidence.map((entry, i) => {
          const project = projects.find((p) => p.id === entry.projectId);
          if (!project) return null;

          return (
            <Reveal key={entry.projectId} delay={i * 0.06}>
              <li className="glass group h-full rounded-2xl border border-border/60 p-5 shadow-soft transition hover:border-primary/25">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/25 bg-primary/8 px-2.5 py-0.5 font-mono text-[10px] text-primary-deep">
                    {entry.mapping}
                  </span>
                  {entry.zones.map((z) => (
                    <span
                      key={z}
                      className="rounded-full border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-slate"
                    >
                      {ZONE_LABELS[z]}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 font-serif text-lg text-ink transition group-hover:text-primary-deep">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-slate">{project.context}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate line-clamp-3">
                  {project.contribution}
                </p>
                <Link
                  to="/#projects"
                  className="mt-4 inline-flex text-sm font-medium text-primary-deep transition hover:underline"
                >
                  View project →
                </Link>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </Reveal>
  );
}
