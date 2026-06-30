import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Lock,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  projects,
  restrictedNote,
  type Project,
} from "../content/site";
import { Chip, Reveal, SectionHeading } from "./primitives";

function linkIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("code")) return Code2;
  if (l.includes("request")) return Lock;
  return ExternalLink;
}

/** Compact preview card — click to open full details. */
function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1"
    >
      {project.image && (
        <div className="aspect-[16/10] overflow-hidden border-b border-border bg-bg">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary-deep">
            {project.projectType}
          </span>
        </div>
        <p className="mt-2 font-mono text-xs text-slate">{project.context}</p>
        <h3 className="mt-2 font-serif text-lg leading-snug text-ink">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
          {project.question}
        </p>

        {project.status && (
          <p className="mt-3 text-xs text-slate/80">{project.status}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.focus.slice(0, 3).map((f) => (
            <Chip key={f} tone="accent">
              {f}
            </Chip>
          ))}
          {project.focus.length > 3 && (
            <span className="inline-flex items-center font-mono text-xs text-slate/70">
              +{project.focus.length - 3}
            </span>
          )}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-primary-deep">
          View details
          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </button>
  );
}

/** Full-detail modal for a selected project. */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const restricted = project.accessType === "private";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-surface shadow-lift sm:rounded-3xl"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.image && (
          <div className="aspect-[16/9] overflow-hidden rounded-t-3xl border-b border-border bg-bg">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-ink shadow-soft backdrop-blur transition hover:bg-white"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary-deep">
              {project.projectType}
            </span>
            {project.status && (
              <span className="text-xs text-slate">{project.status}</span>
            )}
          </div>
          <p className="mt-3 font-mono text-xs text-slate">{project.context}</p>
          <h3 className="mt-2 font-serif text-2xl leading-snug text-ink">
            {project.title}
          </h3>

          <p className="mt-4 text-[15px] leading-relaxed text-slate">
            {project.question}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            <span className="font-medium">Contribution — </span>
            {project.contribution}
          </p>

          {project.role && (
            <p className="mt-4 text-sm leading-relaxed text-slate/90">
              <span className="font-medium text-ink">Role — </span>
              {project.role}
            </p>
          )}

          <div className="mt-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
              Methods
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.methods.map((m) => (
                <Chip key={m}>{m}</Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
              Focus
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.focus.map((f) => (
                <Chip key={f} tone="accent">
                  {f}
                </Chip>
              ))}
            </div>
          </div>

          {restricted && (
            <p className="mt-4 rounded-lg border border-border bg-bg/60 p-3 text-xs leading-relaxed text-slate">
              {restrictedNote}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.links.map((link) => {
              const Icon = linkIcon(link.label);
              if (!link.href) {
                return (
                  <span
                    key={link.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/50 px-3.5 py-1.5 text-xs font-medium text-slate"
                  >
                    <Icon size={14} /> {link.label}
                  </span>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-primary/40 hover:text-primary-deep"
                >
                  <Icon size={14} /> {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const researchProjects = projects.filter((p) => p.group === "research");
  const tools = projects.filter((p) => p.group === "tool");
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  return (
    <section id="projects" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Selected Projects"
            title="Research systems and tools I have built"
            intro="Research prototypes that connect signals to support, alongside public tools that show how I turn analysis and design into working interfaces. Click any card for the full story."
          />
        </Reveal>

        <Reveal>
          <h3 className="mt-10 mb-6 font-mono text-xs uppercase tracking-[0.18em] text-primary-deep">
            Core Research Projects
          </h3>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {researchProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProjectCard project={p} onOpen={() => setActiveId(p.id)} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="mt-16 mb-6 font-mono text-xs uppercase tracking-[0.18em] text-accent-deep">
            Tools &amp; Prototypes
          </h3>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProjectCard project={p} onOpen={() => setActiveId(p.id)} />
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
