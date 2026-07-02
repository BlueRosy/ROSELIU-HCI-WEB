import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../../content/site";

export default function ProjectDetailPanel({
  projectId,
  onClose,
}: {
  projectId: string | null;
  onClose: () => void;
}) {
  const project = projectId ? projects.find((p) => p.id === projectId) : null;

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.button
            type="button"
            aria-label="Close project panel"
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="glass fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/60 p-6 shadow-soft backdrop-blur-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
                Project evidence
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border p-1.5 text-slate transition hover:text-ink"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <h2 className="mt-3 font-serif text-2xl text-ink">{project.title}</h2>
            <p className="mt-1 text-sm text-slate">{project.context}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate">{project.question}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate">{project.contribution}</p>
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                Methods
              </p>
              <ul className="flex flex-wrap gap-2">
                {project.methods.map((m) => (
                  <li
                    key={m}
                    className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-xs text-primary-deep"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-8">
              <Link
                to="/#projects"
                className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary-deep transition hover:bg-primary/15"
                onClick={onClose}
              >
                View full project →
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
