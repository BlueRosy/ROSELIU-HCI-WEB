import { Link } from "react-router-dom";
import { Code2, Link as LinkIcon, Mail } from "lucide-react";
import { about, currentLens, hero, interests, profile } from "../content/site";
import { Chip, Reveal, SectionHeading } from "./primitives";

export default function About() {
  return (
    <>
      <section
        id="about"
        className="section-anchor flex min-h-[88vh] items-center pt-28 pb-16"
      >
        <div className="mx-auto w-full max-w-5xl px-5">
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gradient-static">
                About
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.65rem]">
                {profile.name}
                <span className="mt-1 block font-mono text-sm font-normal text-slate sm:text-base">
                  {profile.nameZh}
                </span>
              </h1>
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

              <Link
                to={about.researchWorldLink.href}
                title={about.researchWorldLink.hint}
                className="group mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-deep transition hover:text-primary"
              >
                <span aria-hidden="true">✦</span>
                {about.researchWorldLink.label}
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
                >
                  <Mail size={15} />
                  {profile.email}
                </a>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
                >
                  <Code2 size={15} />
                  GitHub
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
                >
                  <LinkIcon size={15} />
                  LinkedIn
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-alt py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-start">
            <Reveal>
              <div>
                <SectionHeading eyebrow="More" title="A little about me" />
                <div className="mt-6 space-y-4">
                  {about.bio.map((p) => (
                    <p key={p.slice(0, 24)} className="text-base leading-relaxed text-slate">
                      {p}
                    </p>
                  ))}
                  {profile.seekingPhd && (
                    <p className="rounded-xl border border-primary/25 bg-primary/[0.06] p-4 text-[15px] leading-relaxed text-ink">
                      {about.seekingLine}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                    Beyond research
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((t) => (
                      <Chip key={t} tone="accent">
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass rounded-2xl p-6 shadow-soft lg:sticky lg:top-28">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="about-avatar mb-4">
                    <div className="about-avatar__halo" aria-hidden="true" />
                    <div className="about-avatar__ring">
                      <div className="about-avatar__photo">
                        <img
                          src={profile.aboutPhoto}
                          alt={`Portrait of ${profile.name}`}
                          className="h-full w-full object-cover object-[center_22%]"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="font-serif text-lg text-ink">{profile.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate">{profile.nameZh}</p>
                </div>

                <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
                  Current Lens
                </p>
                <ul className="mt-4 space-y-3">
                  {currentLens.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[15px] leading-relaxed text-ink"
                    >
                      <span className="accent-dot inline-block h-2 w-2 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-4 font-mono text-xs leading-relaxed text-slate">
                  {about.phdAreas}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
