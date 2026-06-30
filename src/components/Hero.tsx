import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { hero, profile } from "../content/site";
import { HeroParallaxProvider } from "../hooks/useHeroParallax.tsx";
import HeroBotanicalBackground from "./HeroBotanicalBackground";
import HeroFigureBody from "./HeroBotanicalFigure";
import HeroSignalCards from "./HeroSignalCards";
import HeroSignalVineLayer from "./HeroSignalVineLayer";

function HeroCopy() {
  return (
    <>
      <p className="font-mono text-sm text-slate">
        <span
          className="accent-dot mr-2 inline-block h-2 w-2 rounded-full align-middle"
          aria-hidden="true"
        />
        {profile.name} <span className="opacity-50">·</span> {profile.nameZh}
      </p>
      <p className="mt-2 font-mono text-xs text-primary-deep">{profile.role}</p>

      <h1 className="mt-5 max-w-3xl font-serif text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
        <span className="text-gradient">{hero.headline}</span>
        <span className="mt-2 block text-xl font-normal leading-snug text-ink/90 sm:text-2xl md:text-[1.65rem]">
          {hero.headlineSub}
        </span>
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
          className="inline-flex items-center gap-2 rounded-full bg-primary-deep px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:translate-y-[-1px] hover:bg-primary hover:shadow-lift"
        >
          View Research <ArrowRight size={16} />
        </a>
        <a
          href={profile.cv}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-primary/50 hover:text-primary-deep"
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
              className="inline-flex items-center rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-slate"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Hero({ enable3D: _enable3D }: { enable3D: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const illustrationColumnRef = useRef<HTMLDivElement>(null);

  return (
    <HeroParallaxProvider>
      <section
        id="top"
        ref={ref}
        className="relative overflow-hidden py-24 md:flex md:min-h-[92vh] md:items-center md:py-28 md:pb-12"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <HeroBotanicalBackground />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-stretch gap-8 md:grid-cols-[1fr_1.05fr] md:gap-8 lg:gap-12"
          >
            <div className="relative z-20 order-1">
              <HeroCopy />
            </div>

            {/* Desktop — figure + floating signal cards */}
            <div
              ref={illustrationColumnRef}
              className="relative order-2 hidden min-h-[480px] md:block"
            >
              <HeroSignalVineLayer rootRef={illustrationColumnRef} />
              <div className="pointer-events-none absolute inset-0 z-[8] overflow-visible">
                <HeroFigureBody />
              </div>
              <div className="relative z-[11] h-full min-h-[inherit]">
                <HeroSignalCards />
              </div>
            </div>

            {/* Mobile — cards first, compact figure below (no wallpaper overlap) */}
            <div className="order-2 md:hidden">
              <HeroSignalCards />
              <div className="hero-mobile-figure mt-6">
                <div className="relative mx-auto h-52 w-full max-w-[17rem] sm:max-w-xs">
                  <HeroFigureBody />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </HeroParallaxProvider>
  );
}
