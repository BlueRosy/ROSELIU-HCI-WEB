import { researchWorld } from "../../content/site";
import ResearchAtlasProjects from "../research-atlas/ResearchAtlasProjects";
import HeroEntryCaption from "./HeroEntryCaption";
import { TRAIL_STOPS } from "./worldTrailConfig";

function TrailCaption({
  eyebrow,
  title,
  body,
  edge,
  edgeClassExtra,
}: {
  eyebrow: string;
  title: string;
  body: string;
  edge: "left" | "right" | "center";
  edgeClassExtra?: string;
}) {
  const edgeClass =
    edge === "left"
      ? "trail-caption--edge-left"
      : edge === "right"
        ? "trail-caption--edge-right"
        : "trail-caption--center";

  return (
    <div
      className={`trail-caption glass rounded-2xl border border-primary/15 p-6 shadow-lift ring-1 ring-primary/10 backdrop-blur-md sm:p-8 ${edgeClass}${edgeClassExtra ? ` ${edgeClassExtra}` : ""}`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{body}</p>
    </div>
  );
}

const SECTION_EDGE: Record<string, "left" | "right" | "center"> = {
  hero: "center",
  signals: "left",
  states: "left",
  support: "right",
  loop: "left",
};

export default function ScrollNarrative({
  heroCaptionVisible = false,
}: {
  heroCaptionVisible?: boolean;
}) {
  const narrativeStops = TRAIL_STOPS.filter((s) => s.section !== "projects");

  return (
    <div className="pointer-events-none">
      {narrativeStops.map((stop, i) => {
        const zone = researchWorld.zones.find((z) => z.id === stop.zoneId);
        if (!zone) return null;
        const edge = SECTION_EDGE[stop.section] ?? "left";
        const index = String(i + 1).padStart(2, "0");

        return (
          <section
            key={stop.section}
            data-section={stop.section}
            className={`trail-section flex h-[132vh] px-5 py-20 ${
              stop.section === "hero"
                ? "items-start justify-center pt-28"
                : "items-center"
            }`}
          >
            {stop.section === "hero" ? (
              <HeroEntryCaption visible={heroCaptionVisible} />
            ) : (
              <TrailCaption
                eyebrow={`${index} · ${zone.label}`}
                title={zone.title}
                body={zone.body}
                edge={edge}
                edgeClassExtra={
                  stop.section === "support" ? "trail-caption--support-nudge" : undefined
                }
              />
            )}
          </section>
        );
      })}

      <section
        data-section="projects"
        className="trail-section trail-section--projects pointer-events-auto flex h-screen flex-col items-center justify-center px-5 pb-36 py-20"
      >
        <div className="trail-caption trail-caption--center trail-caption--bare trail-projects-header mx-auto mb-10 max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            06 · Project evidence
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            How projects support the agenda
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate">
            Each project is evidence for a part of the signals-to-support pipeline
            — not a standalone demo.
          </p>
        </div>
        <div className="w-full max-w-4xl">
          <ResearchAtlasProjects />
        </div>
      </section>

      <div className="h-[15vh]" aria-hidden />
    </div>
  );
}
