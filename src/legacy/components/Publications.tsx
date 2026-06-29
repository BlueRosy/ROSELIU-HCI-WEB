import { publications } from "../content/site";
import { Reveal, SectionHeading, StatusBadge } from "./primitives";

export default function Publications() {
  return (
    <section id="publications" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Publications & Manuscripts"
            title="Selected work"
            intro="Peer-reviewed presentations and manuscripts in preparation. Status is reported honestly and updated as work progresses."
          />
        </Reveal>

        <ul className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white/60">
          {publications.map((pub) => (
            <li key={pub.title}>
              <Reveal>
                <div
                  className={`flex flex-col gap-3 p-6 transition hover:bg-primary/[0.03] sm:flex-row sm:items-start sm:gap-6 ${
                    pub.highlight ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  <div className="flex w-20 shrink-0 items-center gap-2 sm:flex-col sm:items-start">
                    <span className="font-mono text-2xl text-primary/50">
                      {pub.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg leading-snug text-navy">
                      {pub.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate">{pub.authors}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-primary-deep">
                        {pub.venue}
                      </span>
                      <StatusBadge status={pub.status} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
