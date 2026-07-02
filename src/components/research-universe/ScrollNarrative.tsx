import { researchAtlas, researchUniverse, researchWorld } from "../../content/site";

function NarrativeBlock({
  index,
  title,
  body,
  align = "left",
}: {
  index?: string;
  title: string;
  body: string;
  align?: "left" | "center";
}) {
  const alignClass =
    align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-md";

  return (
    <div
      className={`glass rounded-2xl border border-border/50 p-6 shadow-soft backdrop-blur-md sm:p-8 ${alignClass}`}
    >
      {index && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
          {index}
        </p>
      )}
      <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{body}</p>
    </div>
  );
}

export default function ScrollNarrative() {
  return (
    <div className="pointer-events-none">
      {/* Hero */}
      <section
        data-section="hero"
        className="flex min-h-screen items-center justify-center px-5 pt-24"
      >
        <div className="pointer-events-auto mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            {researchWorld.subtitle}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {researchUniverse.hero.title}
          </h1>
          <p className="mt-3 text-lg text-slate">{researchUniverse.hero.subtitle}</p>
          <p className="mt-4 text-base leading-relaxed text-slate">
            {researchUniverse.hero.body}
          </p>
          <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 font-serif text-lg italic text-ink">
            {researchAtlas.researchQuestion}
          </p>
        </div>
      </section>

      {researchUniverse.nodes.map((node) => (
        <section
          key={node.id}
          data-section={node.id}
          className="flex min-h-screen items-center px-5 py-20"
        >
          <NarrativeBlock
            index={node.narrative.index}
            title={node.narrative.title}
            body={node.narrative.body}
            align={node.id === "states" || node.id === "safety" ? "center" : "left"}
          />
        </section>
      ))}

      {/* Projects */}
      <section
        data-section="projects"
        className="flex min-h-screen items-center justify-center px-5 py-20"
      >
        <div className="pointer-events-auto mx-auto max-w-lg text-center">
          <NarrativeBlock
            index={researchUniverse.projectsSection.index}
            title={researchUniverse.projectsSection.title}
            body={researchUniverse.projectsSection.body}
            align="center"
          />
          <p className="mt-6 font-mono text-xs text-slate">
            Click a floating card in the scene to open project details →
          </p>
        </div>
      </section>

      {/* Spacer for footer scroll */}
      <div className="h-[40vh]" aria-hidden />
    </div>
  );
}
