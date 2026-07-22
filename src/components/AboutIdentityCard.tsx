import { Link } from "react-router-dom";
import { ArrowRight, Code2, Compass, Link as LinkIcon, Mail, Sparkles } from "lucide-react";
import { about, profile } from "../content/site";
import MobileTypewriter from "./MobileTypewriter";

/** @param compact — mobile profile header (centered, no card). */
export default function AboutIdentityCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="about-mobile-profile text-left">
        <div className="about-mobile-hero-row">
          <div className="about-avatar about-avatar--mobile h-40 w-40 shrink-0">
            <div className="about-avatar__halo" aria-hidden="true" />
            <div className="about-avatar__ring">
              <div className="about-avatar__photo">
                <img
                  src={profile.aboutPhoto}
                  alt={`Portrait of ${profile.name}`}
                  className="about-avatar__img h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <MobileTypewriter lines={[about.mobileGreeting, profile.role]} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <h1 className="about-name about-name--mobile min-w-0 flex-1">{profile.name}</h1>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="text-slate/80 transition hover:text-primary-deep"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate/80 transition hover:text-primary-deep"
              aria-label="GitHub"
            >
              <Code2 size={17} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate/80 transition hover:text-primary-deep"
              aria-label="LinkedIn"
            >
              <LinkIcon size={17} />
            </a>
          </div>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="about-mobile-email mt-1.5 block text-primary-deep/85"
        >
          {profile.email}
        </a>
      </div>
    );
  }

  return (
    <div className="about-profile-card glass rounded-2xl p-4 shadow-soft md:p-5">
      <div className="flex flex-col items-center text-center">
        <div className="about-avatar mb-1">
          <div className="about-avatar__halo" aria-hidden="true" />
          <div className="about-avatar__ring">
            <div className="about-avatar__photo">
              <img
                src={profile.aboutPhoto}
                alt={`Portrait of ${profile.name}`}
                className="about-avatar__img h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-border pt-3.5 md:mt-5 md:space-y-2 md:pt-4">
        <a
          href={`mailto:${profile.email}`}
          className="about-profile-card__link flex items-start gap-2 text-slate transition hover:text-primary-deep"
        >
          <Mail size={15} className="mt-0.5 shrink-0" />
          <span className="min-w-0 break-all">{profile.email}</span>
        </a>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className="about-profile-card__link flex items-center gap-2 text-slate transition hover:text-primary-deep"
        >
          <Code2 size={15} className="shrink-0" />
          GitHub
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="about-profile-card__link flex items-center gap-2 text-slate transition hover:text-primary-deep"
        >
          <LinkIcon size={15} className="shrink-0" />
          LinkedIn
        </a>
      </div>

      <div className="mt-4 border-t border-border pt-3.5 text-left md:mt-5 md:pt-4">
        <p className="about-label flex items-center gap-1.5 text-primary-deep">
          <Compass size={12} className="shrink-0" aria-hidden />
          Looking forward
        </p>
        <p className="about-profile-card__body mt-1.5 md:mt-2">{about.lookingForward}</p>

        <Link
          to={about.researchWorldLink.href}
          state={{ from: "/#about" }}
          title={about.researchWorldLink.hint}
          className="about-explore-link about-label mt-3 inline-flex items-center gap-1.5 text-primary-deep md:mt-4"
        >
          <Sparkles size={12} className="about-explore-link__icon shrink-0" aria-hidden />
          <span className="about-explore-link__text">{about.researchWorldLink.label}</span>
          <ArrowRight size={12} className="about-explore-link__arrow shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
