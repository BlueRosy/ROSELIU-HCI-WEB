import { about, hero, profile } from "../content/site";
import AboutIdentityCard from "./AboutIdentityCard";
import { Chip, Reveal } from "./primitives";

function AboutCtas({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center ${
        compact ? "gap-x-5 gap-y-2" : "gap-x-4 gap-y-2 md:gap-x-5"
      }`}
    >
      <a
        href={profile.cv}
        className={`inline-flex items-center rounded-full bg-primary font-medium text-white shadow-soft transition hover:bg-primary-deep ${
          compact
            ? "px-4 py-2 text-[13px]"
            : "px-4 py-2 text-[13px] md:px-5 md:py-2.5 md:text-sm"
        }`}
      >
        Download CV
      </a>
      <a
        href="#research"
        className="text-[13px] font-medium text-primary-deep underline-offset-4 transition hover:underline md:text-sm"
      >
        View Vision
      </a>
    </div>
  );
}

function AboutStoryDesktop() {
  return (
    <div className="about-stack">
      <div>
        <p className="about-label font-mono text-gradient-static tracking-[0.18em]">About</p>
        <h1 className="about-name mt-2 md:mt-2.5 lg:mt-3">{profile.name}</h1>
        <p className="about-role mt-2 md:mt-2.5">{profile.role}</p>
      </div>

      <div className="about-pullquote">
        <p className="about-headline">{hero.headline}</p>
        <p className="about-subhead mt-1.5 md:mt-2">{hero.headlineSub}</p>
      </div>

      <p className="about-intro">{about.intro}</p>

      <div>
        <p className="about-label font-mono tracking-[0.14em] text-slate">Methods</p>
        <div className="mt-2 flex flex-wrap gap-1.5 md:mt-2.5 md:gap-2">
          {about.methods.map((t) => (
            <Chip key={t} tone="neutral" className="about-chip">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <AboutCtas />
    </div>
  );
}

/** Mobile-only: greeting + one calm reading column (no pullquote). */
function AboutStoryMobile() {
  return (
    <div className="about-mobile-story mt-5 text-left">
      <p className="about-mobile-greeting">{about.mobileGreeting}</p>
      <p className="about-mobile-meta">{profile.role}</p>

      <div className="about-mobile-copy">
        <p>
          {about.intro} {about.mobileGoal}
        </p>
        <p>
          <span className="about-mobile-inline-label">Looking forward. </span>
          {about.lookingForward}
        </p>
      </div>

      <div className="about-mobile-methods">
        <p className="about-mobile-inline-label">Methods</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {about.methods.map((t) => (
            <Chip key={t} tone="neutral" className="about-chip about-chip--mobile">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="about-mobile-ctas">
        <AboutCtas compact />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="about-section section-anchor relative overflow-hidden pt-20 pb-8 sm:pt-24 sm:pb-9 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 xl:pt-36"
    >
      <div className="about-section__glow" aria-hidden="true" />
      <div className="about-brush" aria-hidden="true">
        <span className="about-brush__stroke about-brush__stroke--a" />
        <span className="about-brush__stroke about-brush__stroke--b" />
        <span className="about-brush__stroke about-brush__stroke--c" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5">
        {/* Phone only (<768px) */}
        <div className="md:hidden">
          <Reveal>
            <AboutIdentityCard compact />
            <AboutStoryMobile />
          </Reveal>
        </div>

        {/* Compact pair, centered in the shared max-w shell (don't stretch → no huge middle gap) */}
        <div className="about-desktop-layout hidden md:flex md:items-start md:justify-center">
          <Reveal className="about-story min-w-0">
            <AboutStoryDesktop />
          </Reveal>
          <Reveal delay={0.06} className="about-profile-rail shrink-0">
            <div className="md:sticky md:top-24">
              <AboutIdentityCard />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
