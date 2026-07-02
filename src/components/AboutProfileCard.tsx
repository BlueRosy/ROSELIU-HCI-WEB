import { Link } from "react-router-dom";
import { Code2, Link as LinkIcon, Mail, Sparkles } from "lucide-react";
import { about, currentLens, profile } from "../content/site";

export default function AboutProfileCard() {
  return (
    <div className="about-profile-card glass rounded-2xl p-6 shadow-soft lg:sticky lg:top-28">
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

      {profile.seekingPhd && (
        <p className="mb-4 rounded-xl border border-primary/25 bg-primary/[0.06] p-3 text-center text-[13px] leading-relaxed text-ink">
          {about.seekingLine}
        </p>
      )}

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
        {about.phdAreas}
      </p>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
        Current Lens
      </p>
      <ul className="mt-3 space-y-2.5">
        {currentLens.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[14px] leading-relaxed text-ink"
          >
            <span className="accent-dot inline-block h-2 w-2 shrink-0 rounded-full" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 border-t border-border pt-4">
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

      <Link
        to={about.researchWorldLink.href}
        title={about.researchWorldLink.hint}
        className="rw-portal-card group mt-6 block rounded-xl border border-primary/30 bg-gradient-to-br from-primary/8 to-sage/10 p-4 transition hover:border-primary/50 hover:shadow-soft"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-deep">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
              ✦ {about.researchWorldLink.label} →
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate">
              {about.researchWorldLink.description}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-wide text-slate/80">
              {about.researchWorldLink.tags}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
