import { Suspense, lazy, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { hero, interests, profile } from "../content/site";
import { Chip } from "./primitives";

const ParticleField = lazy(() => import("../three/ParticleField"));

function HeroArt() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
        <span className="font-serif text-5xl text-navy/30">YL</span>
        <span className="sr-only">Hero art placeholder</span>
      </div>
    );
  }
  return (
    <img
      src={profile.heroArt}
      alt="Hand-drawn illustration of Rose as an HCI researcher at her desk"
      onError={() => setFailed(true)}
      className="aspect-square w-full object-contain"
    />
  );
}

export default function Hero({ enable3D }: { enable3D: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* 3D / gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {enable3D ? (
          <Suspense fallback={null}>
            <ParticleField active={inView} />
          </Suspense>
        ) : null}
        <div className="page-mesh absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-8 md:grid-cols-[1fr_400px] md:gap-12"
        >
          {/* Text column */}
          <div className="order-2 md:order-1">
            <p className="font-mono text-sm text-slate">
              {profile.name} <span className="opacity-50">·</span> {profile.nameZh}
            </p>
            <p className="mt-2 font-mono text-xs text-primary-deep">{profile.role}</p>

            <h1 className="mt-5 max-w-3xl font-serif text-3xl leading-[1.1] text-navy sm:text-4xl md:text-5xl">
              <span className="text-gradient">{hero.headline}</span>
              <span className="block text-navy">{hero.headlineSub}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">
              {hero.intro}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate/90">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
                Research interest —{" "}
              </span>
              {hero.researchInterest}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#research"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:translate-y-[-1px] hover:shadow-lift"
              >
                View Research <ArrowRight size={16} />
              </a>
              <a
                href={profile.cv}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-primary/40"
              >
                <Download size={16} /> Download CV
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate transition hover:text-primary-deep"
              >
                <Mail size={16} /> Contact
              </a>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                  Research areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {hero.tags.map((t) => (
                    <Chip key={t} tone="primary">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                  Beyond research
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((t) => (
                    <Chip key={t} tone="accent">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hand-drawn HCI scene column */}
          <div className="order-1 mx-auto w-full max-w-[320px] md:order-2 md:max-w-[400px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
              <HeroArt />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
