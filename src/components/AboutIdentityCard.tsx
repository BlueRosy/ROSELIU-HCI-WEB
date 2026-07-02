import { Code2, Link as LinkIcon, Mail } from "lucide-react";
import { about, profile } from "../content/site";

export default function AboutIdentityCard() {
  return (
    <div className="glass rounded-2xl p-5 shadow-soft">
      <div className="flex flex-col items-center text-center">
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

        {profile.seekingPhd && (
          <p className="rounded-xl border border-primary/25 bg-primary/[0.06] px-3 py-2 text-[13px] font-medium leading-relaxed text-ink">
            {about.seekingLine}
          </p>
        )}

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
          {about.phdAreas}
        </p>
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
