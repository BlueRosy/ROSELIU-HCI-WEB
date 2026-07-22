import { about, hero, profile } from "../content/site";
import AboutDirectionCard from "./AboutDirectionCard";
import AboutIdentityCard from "./AboutIdentityCard";
import { Chip, Reveal } from "./primitives";

function AboutStoryDesktop() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gradient-static">About</p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        {profile.name}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate sm:text-base">{profile.role}</p>

      <div className="mt-8 border-l-2 border-primary/35 pl-5">
        <p className="font-serif text-2xl leading-snug text-ink sm:text-[1.85rem]">{hero.headline}</p>
        <p className="mt-2 text-base leading-relaxed text-slate">{hero.headlineSub}</p>
      </div>

      <p className="about-intro mt-7">{about.intro}</p>

      <div className="mt-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">Methods</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {about.methods.map((t) => (
            <Chip key={t} tone="neutral">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#research"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-primary-deep"
        >
          View Vision
        </a>
        <a
          href={profile.cv}
          className="inline-flex items-center rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm text-ink transition hover:border-primary/30"
        >
          Download CV
        </a>
      </div>
    </>
  );
}

/** Compact mobile bio — Looking forward above Methods; no Research World CTA (3D off on small screens). */
function AboutStoryMobile() {
  return (
    <div className="about-mobile-story mt-6 text-left">
      <p className="text-[13px] leading-relaxed text-slate">{profile.role}</p>

      <p className="mt-4 font-serif text-[1.35rem] leading-snug text-ink">{hero.headline}</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-slate">{hero.headlineSub}</p>

      <p className="about-intro about-intro--mobile mt-4">{about.intro}</p>

      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-primary-deep">
          Looking forward
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-slate">{about.lookingForward}</p>
      </div>

      <div className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">Methods</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {about.methods.map((t) => (
            <Chip key={t} tone="neutral">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <a
          href="#research"
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-white shadow-soft transition hover:bg-primary-deep"
        >
          View Vision
        </a>
        <a
          href={profile.cv}
          className="inline-flex items-center rounded-full border border-border bg-surface/80 px-4 py-2 text-[13px] text-ink transition hover:border-primary/30"
        >
          Download CV
        </a>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="about-section section-anchor relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-20"
    >
      <div className="about-section__glow" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-5">
        <div className="lg:hidden">
          <Reveal>
            <AboutIdentityCard compact />
            <AboutStoryMobile />
          </Reveal>
        </div>

        <div className="hidden gap-10 lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <Reveal>
            <div>
              <AboutStoryDesktop />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <AboutIdentityCard />
              <AboutDirectionCard />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
