import { Code2, FileDown, Link as LinkIcon, Mail } from "lucide-react";
import { profile } from "../content/site";

type AboutContactsProps = {
  /** Stack under avatar (compact) vs horizontal under bio. */
  stacked?: boolean;
  /** Center links under a top portrait (mobile). */
  centered?: boolean;
};

const linkClass =
  "inline-flex items-center gap-1 transition hover:text-primary-deep";

/** Contact links — prefer under the portrait. */
export default function AboutContacts({
  stacked = false,
  centered = false,
}: AboutContactsProps) {
  const socialRow = (
    <p
      className={`flex flex-wrap items-center gap-x-1.5 text-slate ${
        stacked ? "text-[12px]" : "text-[13px]"
      } ${centered ? "justify-center" : ""}`}
    >
      <a
        href={profile.socials.github}
        target="_blank"
        rel="noreferrer"
        className={linkClass}
      >
        <Code2 size={stacked ? 12 : 13} className="shrink-0" aria-hidden />
        GitHub
      </a>
      <span className="text-slate/40" aria-hidden>
        |
      </span>
      <a
        href={profile.socials.linkedin}
        target="_blank"
        rel="noreferrer"
        className={linkClass}
      >
        <LinkIcon size={stacked ? 12 : 13} className="shrink-0" aria-hidden />
        LinkedIn
      </a>
      <span className="text-slate/40" aria-hidden>
        |
      </span>
      <a href={profile.cv} target="_blank" rel="noreferrer" className={linkClass}>
        <FileDown size={stacked ? 12 : 13} className="shrink-0" aria-hidden />
        CV
      </a>
    </p>
  );

  if (stacked) {
    return (
      <div
        className={`about-contacts about-contacts--stacked mt-3 space-y-2 text-[12px] text-slate ${
          centered ? "mt-4 space-y-2.5" : ""
        }`}
      >
        <a
          href={`mailto:${profile.email}`}
          className={`${linkClass} gap-1.5 ${
            centered
              ? "mx-auto max-w-full justify-center text-center"
              : "items-start"
          }`}
        >
          <Mail size={13} className={`shrink-0 ${centered ? "" : "mt-0.5"}`} />
          <span className="min-w-0 break-all leading-snug">{profile.email}</span>
        </a>
        {socialRow}
      </div>
    );
  }

  return (
    <div className="about-contacts flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-[13px] text-slate">
      <a href={`mailto:${profile.email}`} className={linkClass}>
        <Mail size={14} className="shrink-0" />
        <span className="break-all">{profile.email}</span>
      </a>
      {socialRow}
    </div>
  );
}
