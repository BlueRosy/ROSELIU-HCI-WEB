import { Download, GraduationCap, FlaskConical, Wrench } from "lucide-react";
import { profile } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

const highlights = [
  {
    icon: GraduationCap,
    label: "Education",
    text: "Columbia (M.S. Applied Analytics) · UNSW (M.S. IT, HD) · MUST (B.Sc. Economics, Rank 2/882)",
  },
  {
    icon: FlaskConical,
    label: "Research",
    text: "Research Fellow @ DKU HII Lab · Research Intern @ Tsinghua Pervasive HCI · Summer RA @ CityU Studio for Narrative Spaces",
  },
  {
    icon: Wrench,
    label: "Building",
    text: "React / TypeScript front-end · data analysis & visualization · lightweight prototyping",
  },
];

export default function CV() {
  return (
    <section id="cv" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="glass overflow-hidden rounded-3xl p-8 shadow-soft sm:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow="Curriculum Vitae"
                  title="The full story, on one page"
                />
              </Reveal>
              <Reveal delay={0.06}>
                <ul className="mt-8 space-y-5">
                  {highlights.map((h) => (
                    <li key={h.label} className="flex gap-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-deep">
                        <h.icon size={18} />
                      </span>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                          {h.label}
                        </p>
                        <p className="mt-1 text-[15px] leading-relaxed text-navy">
                          {h.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <a
                href={profile.cv}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:translate-y-[-1px] hover:shadow-lift"
              >
                <Download size={18} /> Download CV (PDF)
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
