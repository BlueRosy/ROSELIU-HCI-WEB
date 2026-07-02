import { useState } from "react";
import { motion } from "framer-motion";
import ClosedLoop from "../ClosedLoop";
import { Reveal, SectionHeading } from "../primitives";
import { researchAtlas, researchWorld, signalFlow } from "../../content/site";
import { palette } from "../../theme/palette";
import ResearchAtlasDetail from "./ResearchAtlasDetail";
import ResearchAtlasMap from "./ResearchAtlasMap";
import ResearchAtlasProjects from "./ResearchAtlasProjects";
import type { AtlasSelection } from "./types";

function OpeningDiagram() {
  const stages = signalFlow.pipeline;
  const w = 520;
  const h = 48;
  const step = w / (stages.length - 1);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mx-auto mt-10 h-12 w-full max-w-md"
      aria-hidden
    >
      <defs>
        <linearGradient id="openPipe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.sage} />
          <stop offset="50%" stopColor="#9AA8B5" />
          <stop offset="100%" stopColor={palette.primary} />
        </linearGradient>
      </defs>
      <motion.path
        d={`M 24 ${h / 2} L ${w - 24} ${h / 2}`}
        fill="none"
        stroke="url(#openPipe)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {stages.map((label, i) => {
        const x = 24 + i * step;
        return (
          <g key={label}>
            <motion.circle
              cx={x}
              cy={h / 2}
              r={6}
              fill={palette.bg}
              stroke={i === 0 ? palette.sage : i === 1 ? "#9AA8B5" : palette.primary}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 260 }}
            />
            <text
              x={x}
              y={h - 6}
              textAnchor="middle"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              fill={palette.slate}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ResearchAtlasView() {
  const [selection, setSelection] = useState<AtlasSelection>({
    kind: "pipeline",
    id: "signals",
  });

  return (
    <main className="pb-20 pt-24">
      {/* Opening */}
      <section className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            {researchWorld.subtitle}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {researchWorld.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
            {researchAtlas.openingLine}
          </p>
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 font-serif text-lg italic leading-relaxed text-ink">
            {researchAtlas.researchQuestion}
          </p>
          <OpeningDiagram />
        </Reveal>
      </section>

      {/* Interactive atlas */}
      <section className="mx-auto mt-20 max-w-7xl px-5" aria-label="Interactive research atlas">
        <Reveal>
          <SectionHeading
            eyebrow="Research atlas"
            title="From signals to support"
            intro={researchWorld.intro}
          />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10">
          <ResearchAtlasDetail selection={selection} />
          <Reveal delay={0.08}>
            <ResearchAtlasMap selection={selection} onSelect={setSelection} />
          </Reveal>
        </div>
      </section>

      {/* Closed-loop */}
      <section className="mx-auto mt-24 max-w-6xl px-5" aria-label="Closed-loop framework">
        <Reveal>
          <SectionHeading
            eyebrow="Closed-loop systems"
            title="Sensing through sustainability"
            intro="My work asks how human-centered systems can sense, interpret, support, and sustain everyday mental wellbeing over time."
          />
        </Reveal>
        <div className="mt-10">
          <ClosedLoop enable3D={false} />
        </div>
      </section>

      {/* Project evidence */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <ResearchAtlasProjects />
      </section>
    </main>
  );
}
