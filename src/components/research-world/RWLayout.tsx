import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Nav from "../Nav";
import { profile, researchWorld } from "../../content/site";

export default function RWLayout({
  children,
}: {
  children: React.ReactNode;
  /** @deprecated exploration mode removed — atlas is always default layout */
  variant?: "default" | "exploration";
}) {
  return (
    <div className="relative min-h-screen">
      <Nav variant="subpage" />
      <div className="fixed left-4 top-24 z-40">
        <Link
          to="/#about"
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate shadow-soft transition hover:text-primary-deep"
        >
          <ArrowLeft size={15} />
          {researchWorld.backLabel}
        </Link>
      </div>
      {children}
      <footer className="border-t border-border bg-section/50 py-16">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
              {researchWorld.conventionalCta}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/#research"
                className="rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm text-ink transition hover:border-primary/30"
              >
                View Research
              </Link>
              <Link
                to="/#projects"
                className="rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm text-ink transition hover:border-primary/30"
              >
                View Projects
              </Link>
              <a
                href={profile.cv}
                className="rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm text-ink transition hover:border-primary/30"
              >
                Download CV
              </a>
            </div>
          </div>
      </footer>
    </div>
  );
}
