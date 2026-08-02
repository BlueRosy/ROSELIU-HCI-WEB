import { Download } from "lucide-react";
import { profile } from "../content/site";
import { Reveal } from "./primitives";

export default function CV() {
  return (
    <section id="cv" className="section-anchor py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
                Curriculum Vitae
              </p>
              <h1 className="mt-2 font-serif text-3xl tracking-[-0.02em] text-ink md:text-4xl">
                CV
              </h1>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-slate">
                View the full one-page CV below, or download the PDF.
              </p>
            </div>
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-deep px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-primary"
            >
              <Download size={16} /> Download PDF
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <iframe
              title={`${profile.name} CV`}
              src={`${profile.cv}#view=FitH`}
              className="cv-embed block w-full border-0 bg-white"
            />
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-slate/70">
            If the preview does not load,{" "}
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="text-primary-deep underline-offset-2 hover:underline"
            >
              open the PDF
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
