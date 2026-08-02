import PageShell from "../components/PageShell";
import ResearchProjectRows from "../components/ResearchProjectRows";
import { Reveal } from "../components/primitives";

export default function SideProjectsPage() {
  return (
    <PageShell>
      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
              Side Project
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-[-0.02em] text-ink md:text-4xl">
              Personal tools & prototypes
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate">
              Lightweight apps I build for research workflows and everyday design
              practice — separate from lab studies.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <ResearchProjectRows group="tool" />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
