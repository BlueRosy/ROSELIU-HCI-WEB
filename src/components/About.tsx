import { about, hero, profile } from "../content/site";
import AboutBottomCards from "./AboutBottomCards";
import AboutIdentityCard from "./AboutIdentityCard";
import AboutWorldPortal from "./AboutWorldPortal";
import { Chip, Reveal } from "./primitives";

export default function About() {
  return (
    <section id="about" className="section-anchor pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Reveal>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gradient-static">
                About
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.65rem]">
                {profile.name}
              </h1>
              <p className="mt-1 font-mono text-sm text-slate sm:text-base">{profile.nameZh}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate sm:text-base">
                {profile.role}
              </p>

              <div className="mt-8 border-l-2 border-primary/35 pl-5">
                <p className="font-serif text-xl leading-snug text-ink sm:text-2xl">
                  {hero.headline}
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate">{hero.headlineSub}</p>
              </div>

              <p className="mt-6 text-base leading-relaxed text-ink">{about.intro}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate">
                {about.researchInterest}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {about.researchAreas.map((t) => (
                  <Chip key={t} tone="primary">
                    {t}
                  </Chip>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#research"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-primary-deep"
                >
                  View Research
                </a>
                <a
                  href={profile.cv}
                  className="inline-flex items-center rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm text-ink transition hover:border-primary/30"
                >
                  Download CV
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex flex-col gap-4">
              <AboutIdentityCard />
              <AboutWorldPortal />
            </div>
          </Reveal>
        </div>

        <AboutBottomCards />
      </div>
    </section>
  );
}
