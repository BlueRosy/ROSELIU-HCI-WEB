import { researchAtlas, researchWorld } from "../../content/site";
import ResearchAtlasProjects from "../research-atlas/ResearchAtlasProjects";
import { TRAIL_STOPS } from "./worldTrailConfig";

function NarrativeBlock({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "center" | "right";
}) {
  const alignClass =
    align === "center"
      ? "mx-auto max-w-xl text-center"
      : align === "right"
        ? "ml-auto max-w-md text-right"
        : "max-w-md";

  return (
    <div
      className={`glass rounded-2xl border border-border/50 p-6 shadow-soft backdrop-blur-md sm:p-8 ${alignClass}`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{body}</p>
    </div>
  );
}

const SECTION_ALIGN: Record<string, "left" | "center" | "right"> = {
  hero: "center",
  signals: "left",
  states: "center",
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
        const align = SECTION_ALIGN[stop.section] ?? "left";
        const index = String(i + 1).padStart(2, "0");

        return (
          <section
            key={stop.section}
            data-section={stop.section}
            className="flex min-h-screen items-center px-5 py-20 pt-28"
          >
            {stop.section === "hero" ? (
              <div className="pointer-events-auto mx-auto max-w-2xl text-center">
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
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                  ↓ Scroll to walk the trail
                </p>
              </div>
            ) : (
              <NarrativeBlock
                eyebrow={`${index} · ${zone.label}`}
                title={zone.title}
                body={zone.body}
                align={align}
              />
            )}
          </section>
        );
      })}

      <section
        data-section="projects"
        className="pointer-events-auto flex min-h-screen flex-col items-center justify-center px-5 py-20"
      >
        <div className="mb-10 max-w-lg text-center">
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

      <div className="h-[35vh]" aria-hidden />
    </div>
  );
}
