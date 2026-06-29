import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { hero, profile, signalFlow } from "../content/site";

const ParticleField = lazy(() => import("../three/ParticleField"));
const Avatar3D = lazy(() => import("../three/Avatar3D"));

function HeroArt() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
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

/** Returns true only once the .glb avatar is confirmed reachable. */
function useGlbAvailable(url: string) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const type = res.headers.get("content-type") ?? "";
        // A dev server may answer 200 with index.html for missing files;
        // guard against that by rejecting html responses.
        if (active && res.ok && !type.includes("text/html")) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [url]);
  return available;
}

function HeroFigure({ enable3D }: { enable3D: boolean }) {
  const glbReady = useGlbAvailable(profile.avatar3d);
  const use3D = enable3D && glbReady;

  if (use3D) {
    return (
      <Suspense fallback={<HeroArt />}>
        <Avatar3D src={profile.avatar3d} fallback={<HeroArt />} />
      </Suspense>
    );
  }
  return <HeroArt />;
}

function SignalFlow() {
  return (
    <div className="mt-6">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
        Signals → States → Support
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {signalFlow.stages.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 items-stretch">
            {i > 0 && (
              <span
                className="flex shrink-0 items-center justify-center px-1 font-mono text-lg text-primary/50"
                aria-hidden="true"
              >
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">↓</span>
              </span>
            )}
            <div className="flex-1 rounded-xl border border-border bg-white/70 p-4 backdrop-blur-sm">
              <p className="font-serif text-base text-navy">{stage.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate">
                {stage.items.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
      {/* Pink-blue sky backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg,#fde8f0 0%,#f1ecfb 46%,#e6f1fc 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(46rem 34rem at 18% 6%, rgba(243,166,200,0.30), transparent 62%), radial-gradient(40rem 30rem at 86% 20%, rgba(107,166,255,0.24), transparent 60%), radial-gradient(34rem 26rem at 60% 85%, rgba(170,200,255,0.20), transparent 65%)",
          }}
        />
        {enable3D ? (
          <Suspense fallback={null}>
            <ParticleField active={inView} />
          </Suspense>
        ) : null}
        {/* Fade into the light content below */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-8 md:grid-cols-[1fr_400px] md:gap-12"
        >
          <div className="order-2 md:order-1">
            <p className="font-mono text-sm text-slate">
              {profile.name} <span className="opacity-50">·</span> {profile.nameZh}
            </p>
            <p className="mt-2 font-mono text-xs text-primary-deep">{profile.role}</p>

            <h1 className="mt-5 max-w-3xl font-serif text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              <span className="text-gradient">{hero.headline}</span>
              <span className="block text-navy">{hero.headlineSub}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">
              {hero.intro}
            </p>

            <SignalFlow />

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
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-primary/50 hover:text-primary-deep"
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

            <div className="mt-8">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                Research areas
              </p>
              <div className="flex flex-wrap gap-2">
                {hero.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1 font-mono text-xs text-slate"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[320px] md:order-2 md:max-w-[400px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lift">
              <HeroFigure enable3D={enable3D} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
