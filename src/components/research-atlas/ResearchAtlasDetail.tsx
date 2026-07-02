import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  loop,
  projects,
  researchAtlas,
  researchWorld,
  signalFlow,
  type ResearchWorldZone,
} from "../../content/site";
import RWFocusCards from "../research-world/RWFocusCards";
import type { AtlasSelection, PipelineZoneId } from "./types";

function zoneById(id: PipelineZoneId): ResearchWorldZone | undefined {
  return researchWorld.zones.find((z) => z.id === id);
}

function stageItems(id: PipelineZoneId): readonly string[] {
  const idx = id === "signals" ? 0 : id === "states" ? 1 : 2;
  return signalFlow.stages[idx]?.items ?? [];
}

function PipelineDetail({ id }: { id: PipelineZoneId }) {
  const zone = zoneById(id);
  if (!zone) return null;

  const linkedProjects =
    zone.projectIds?.map((pid) => projects.find((p) => p.id === pid)).filter(Boolean) ?? [];
  const methods = researchAtlas.zoneMethods[id];
  const examples = stageItems(id);

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl border border-border/60 p-6 shadow-soft backdrop-blur-md"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep">
        {zone.label}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink">{zone.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{zone.body}</p>

      {examples.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Examples
          </p>
          <ul className="flex flex-wrap gap-2">
            {examples.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary-deep"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {zone.focusCards && zone.focusCards.length > 0 && (
        <RWFocusCards cards={zone.focusCards} />
      )}

      {methods.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Methods
          </p>
          <ul className="flex flex-wrap gap-2">
            {methods.map((m) => (
              <li
                key={m}
                className="rounded-lg border border-sage/25 bg-sage/8 px-2.5 py-1 font-mono text-xs text-sage"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {linkedProjects.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Related projects
          </p>
          <ul className="space-y-2">
            {linkedProjects.map((project) =>
              project ? (
                <li key={project.id}>
                  <Link
                    to="/#projects"
                    className="block rounded-lg border border-border/80 bg-surface/50 px-3 py-2 text-sm text-ink transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="font-medium">{project.title}</span>
                    <span className="mt-0.5 block text-xs text-slate">{project.context}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

function LoopDetail({ loopKey }: { loopKey: string }) {
  const node = loop.find((n) => n.key === loopKey) ?? loop[0];

  return (
    <motion.div
      key={loopKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl border border-border/60 border-l-[3px] border-l-sage p-6 shadow-soft backdrop-blur-md"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
        Closed-loop · {node.label}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink">{node.short}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{node.body}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {node.items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary-deep"
          >
            {item}
          </li>
        ))}
      </ul>
      {node.current && (
        <p className="mt-4 inline-flex rounded-full bg-accent/12 px-3 py-1 font-mono text-[10px] text-accent-deep">
          Current research focus
        </p>
      )}
    </motion.div>
  );
}

export default function ResearchAtlasDetail({ selection }: { selection: AtlasSelection }) {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate">
        Selected node
      </p>
      <AnimatePresence mode="wait">
        {selection.kind === "pipeline" ? (
          <PipelineDetail id={selection.id} />
        ) : (
          <LoopDetail loopKey={selection.key} />
        )}
      </AnimatePresence>
    </div>
  );
}
