import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { researchWorld } from "../../content/site";
import ResearchAtlasProjects from "../research-atlas/ResearchAtlasProjects";
import HeroEntryCaption from "./HeroEntryCaption";
import { TRAIL_STOPS, type ScrollSection } from "./worldTrailConfig";

function TrailCaption({
  eyebrow,
  title,
  body,
  edge,
  edgeClassExtra,
  night = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  edge: "left" | "right" | "center";
  edgeClassExtra?: string;
  night?: boolean;
}) {
  const edgeClass =
    edge === "left"
      ? "trail-caption--edge-left"
      : edge === "right"
        ? "trail-caption--edge-right"
        : "trail-caption--center";

  return (
    <div
      className={`trail-caption glass rounded-2xl border border-primary/15 p-6 shadow-lift ring-1 ring-primary/10 backdrop-blur-md sm:p-8 ${edgeClass}${edgeClassExtra ? ` ${edgeClassExtra}` : ""}${night ? " trail-caption--night" : ""}`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate">{body}</p>
    </div>
  );
}

const SECTION_EDGE: Record<string, "left" | "right" | "center"> = {
  hero: "center",
  signals: "left",
  states: "left",
  support: "right",
  loop: "left",
};

/** Fade loop caption as the projects header rises into view — not at section midpoint. */
function useLoopCaptionFade(activeSection: ScrollSection) {
  const [opacity, setOpacity] = useState(1);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (activeSection !== "loop") {
      setOpacity(1);
      return;
    }

    const measure = () => {
      const header = document.querySelector<HTMLElement>(".trail-projects-header");
      if (!header) {
        setOpacity(1);
        return;
      }
      const top = header.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const fadeStart = vh + 48;
      const fadeEnd = vh * 0.58;
      let next = 1;
      if (top >= fadeStart) next = 1;
      else if (top <= fadeEnd) next = 0;
      else next = (top - fadeEnd) / (fadeStart - fadeEnd);
      setOpacity(next);
    };

    const onScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", measure);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [activeSection]);

  return opacity;
}

function ActiveTrailCaption({
  activeSection,
}: {
  activeSection: ScrollSection;
}) {
  const loopFade = useLoopCaptionFade(activeSection);

  if (activeSection === "hero" || activeSection === "projects") return null;

  const stop = TRAIL_STOPS.find((s) => s.section === activeSection);
  const zone = stop ? researchWorld.zones.find((z) => z.id === stop.zoneId) : null;
  if (!stop || !zone) return null;

  const edge = SECTION_EDGE[stop.section] ?? "left";
  const index = String(TRAIL_STOPS.indexOf(stop) + 1).padStart(2, "0");
  const supportNudge = stop.section === "support";

  return (
    <div
      className="trail-active-caption pointer-events-none fixed inset-x-0 top-0 z-[15] flex h-screen items-center px-5 py-20"
      style={{
        opacity: activeSection === "loop" ? loopFade : 1,
        visibility:
          activeSection === "loop" && loopFade < 0.04 ? "hidden" : "visible",
      }}
      aria-live="polite"
    >
      <div
        className={
          edge === "left"
            ? "w-full md:mr-auto md:max-w-none"
            : edge === "right"
              ? "w-full"
              : "mx-auto"
        }
      >
        <TrailCaption
          eyebrow={`${index} · ${zone.label}`}
          title={zone.title}
          body={zone.body}
          edge={edge}
          edgeClassExtra={supportNudge ? "trail-caption--support-nudge" : undefined}
        />
      </div>
    </div>
  );
}

export default function ScrollNarrative({
  heroCaptionVisible = false,
  activeSection = "hero",
}: {
  heroCaptionVisible?: boolean;
  activeSection?: ScrollSection;
}) {
  const narrativeStops = TRAIL_STOPS.filter((s) => s.section !== "projects");

  return (
    <div className="pointer-events-none">
      <ActiveTrailCaption activeSection={activeSection} />

      {narrativeStops.map((stop) => {
        const zone = researchWorld.zones.find((z) => z.id === stop.zoneId);
        if (!zone) return null;

        return (
          <section
            key={stop.section}
            data-section={stop.section}
            className={`trail-section flex h-[132vh] px-5 py-20 ${
              stop.section === "hero"
                ? "items-start justify-center pt-28"
                : "items-center"
            }`}
            aria-hidden={activeSection !== stop.section && stop.section !== "hero"}
          >
            {stop.section === "hero" ? (
              <HeroEntryCaption
                visible={heroCaptionVisible && activeSection === "hero"}
              />
            ) : (
              <div className="sr-only">
                {zone.title}
              </div>
            )}
          </section>
        );
      })}

      <section
        data-section="projects"
        className="trail-section trail-section--projects pointer-events-auto flex min-h-[150vh] flex-col items-center px-5 pb-48 pt-14"
      >
        <div className="trail-caption trail-caption--center trail-caption--bare trail-projects-header mx-auto mb-8 max-w-xl shrink-0 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            06 · Project evidence
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            How projects support the agenda
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate">
            Each project is evidence for a part of the signals-to-support pipeline
            — not a standalone demo.
          </p>
        </div>
        <div className="w-full max-w-4xl pb-8">
          <ResearchAtlasProjects />
        </div>
      </section>

      <div className="h-[22vh]" aria-hidden />
    </div>
  );
}
