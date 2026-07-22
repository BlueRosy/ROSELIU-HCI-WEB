import { Code2, Link as LinkIcon, Mail } from "lucide-react";
import { profile } from "../content/site";

/** @param compact — mobile profile header (centered, no card). */
export default function AboutIdentityCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="about-mobile-profile flex flex-col items-center text-center">
        <div className="about-avatar about-avatar--mobile mb-3">
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

        <h1 className="font-serif text-[1.75rem] leading-tight text-ink">{profile.name}</h1>

        <div className="mt-4 flex items-center justify-center gap-5">
          <a
            href={`mailto:${profile.email}`}
            className="text-slate transition hover:text-primary-deep"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-slate transition hover:text-primary-deep"
            aria-label="GitHub"
          >
            <Code2 size={18} />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-slate transition hover:text-primary-deep"
            aria-label="LinkedIn"
          >
            <LinkIcon size={18} />
          </a>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="about-mobile-email mt-2.5 font-mono text-[12px] text-primary-deep/90"
        >
          {profile.email}
        </a>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 shadow-soft sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="about-avatar mb-1">
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
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
        >
          <Mail size={15} />
          <span className="truncate">{profile.email}</span>
        </a>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
        >
          <Code2 size={15} />
          GitHub
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-slate transition hover:text-primary-deep"
        >
          <LinkIcon size={15} />
          LinkedIn
        </a>
      </div>
    </div>
  );
}
