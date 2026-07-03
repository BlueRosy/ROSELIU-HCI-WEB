import { researchAtlas, researchWorld } from "../../content/site";
import ResearchAtlasProjects from "../research-atlas/ResearchAtlasProjects";
import { TRAIL_STOPS } from "./worldTrailConfig";

function TrailCaption({
  eyebrow,
  title,
  body,
  edge,
}: {
  eyebrow: string;
  title: string;
  body: string;
  edge: "left" | "right" | "center";
}) {
  const edgeClass =
    edge === "left"
      ? "trail-caption--edge-left"
      : edge === "right"
        ? "trail-caption--edge-right"
        : "trail-caption--center";

  return (
    <div
      className={`trail-caption glass rounded-2xl border border-primary/15 p-6 shadow-lift ring-1 ring-primary/10 backdrop-blur-md sm:p-8 ${edgeClass}`}
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
  loop: "center",
};

export default function ScrollNarrative() {
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
            className={`trail-section flex min-h-screen px-5 py-20 ${
              stop.section === "hero"
                ? "items-start justify-center pt-28"
                : "items-center"
            }`}
          >
            {stop.section === "hero" ? (
              <div className="pointer-events-auto glass-hero trail-caption--hero mx-auto max-w-2xl rounded-2xl border border-primary/15 p-8 text-center shadow-lift ring-1 ring-primary/10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
                  {researchWorld.subtitle}
                </p>
                <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                  {researchWorld.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
                  {researchWorld.intro}
                </p>
                <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 font-serif text-lg italic text-ink">
                  {researchAtlas.researchQuestion}
                </p>
              </div>
            ) : (
              <TrailCaption
                eyebrow={`${index} · ${zone.label}`}
                title={zone.title}
                body={zone.body}
                edge={edge}
              />
            )}
          </section>
        );
      })}

      <section
        data-section="projects"
        className="trail-section pointer-events-auto flex min-h-screen flex-col items-center justify-center px-5 py-20"
      >
        <div className="trail-caption trail-caption--center glass mb-10 max-w-lg rounded-2xl border border-primary/15 p-6 text-center shadow-lift ring-1 ring-primary/10 backdrop-blur-md sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            06 · Project evidence
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">How projects support the agenda</h2>
          <p className="mt-3 text-slate">{researchAtlas.researchQuestion}</p>
        </div>
        <div className="w-full max-w-4xl">
          <ResearchAtlasProjects />
        </div>
      </section>

      <div className="h-[15vh]" aria-hidden />
    </div>
  );
}
