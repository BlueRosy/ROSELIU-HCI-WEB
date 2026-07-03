import {
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEnable3D } from "../../hooks/useEnable3D";
import ProjectDetailPanel from "./ProjectDetailPanel";
import ResearchUniverseFallback from "./ResearchUniverseFallback";
import ScrollNarrative from "./ScrollNarrative";
import TrailAmbientAudio from "./TrailAmbientAudio";
import TrailIntroOverlay from "./TrailIntroOverlay";
import TrailProgressBar from "./TrailProgressBar";
import type { UniverseSceneState } from "./UniverseContext";
import {
  scrollToSection,
  sectionAtProgress,
  isScrollTweenActive,
} from "./trailScrollUtils";
import { useTrailKeyboard } from "./useTrailKeyboard";
import { SCROLL_SECTIONS, type ScrollSection } from "./worldTrailConfig";

gsap.registerPlugin(ScrollTrigger);

const ResearchUniverseCanvas = lazy(
  () => import("./ResearchUniverseCanvas"),
);

const PARALLAX_THRESHOLD = 0.012;
const INVALIDATE_MIN_MS = 1000 / 60;

export default function ResearchUniverseView() {
  const enable3D = useEnable3D();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastSectionRef = useRef<ScrollSection>("hero");
  const lastInvalidateTime = useRef(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<ScrollSection>("hero");

  const scrollProgress = useRef(0);
  const activeSection = useRef<ScrollSection>("hero");
  const activeZone = useRef("entry");
  const showProjectCards = useRef(false);
  const parallax = useRef({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);
  const pending = useRef({ x: 0, y: 0 });
  const invalidate = useRef<() => void>(() => {});
  const isScrollingRef = useRef(false);

  const throttledInvalidate = useCallback(() => {
    const now = performance.now();
    if (now - lastInvalidateTime.current < INVALIDATE_MIN_MS) return;
    lastInvalidateTime.current = now;
    invalidate.current();
  }, []);

  const onProjectSelect = useCallback((projectId: string) => {
    setSelectedProject(projectId);
  }, []);

  const navigateToSection = useCallback((section: ScrollSection) => {
    scrollToSection(section, scrollTriggerRef.current, {
      duration: 0.45,
      invalidate: () => invalidate.current(),
      isScrollingRef,
    });
  }, []);

  useTrailKeyboard(activeSection, scrollTriggerRef, invalidate, isScrollingRef);

  const sceneState: UniverseSceneState = {
    scrollProgress,
    activeSection,
    activeZone,
    showProjectCards,
    parallax,
    invalidate,
    isScrollingRef,
    onProjectSelect,
  };

  useLayoutEffect(() => {
    if (!enable3D || !scrollRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const dx = Math.abs(nx - pending.current.x);
      const dy = Math.abs(ny - pending.current.y);
      if (dx + dy < PARALLAX_THRESHOLD) return;

      pending.current.x = nx;
      pending.current.y = ny;
      if (parallaxRaf.current !== null) return;
      parallaxRaf.current = requestAnimationFrame(() => {
        parallax.current.x = pending.current.x;
        parallax.current.y = pending.current.y;
        parallaxRaf.current = null;
        throttledInvalidate();
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        snap: {
          snapTo: 1 / (SCROLL_SECTIONS.length - 1),
          duration: { min: 0.12, max: 0.4 },
          delay: 0.04,
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          const section = sectionAtProgress(self.progress);
          activeSection.current = section;

          if (section !== lastSectionRef.current) {
            lastSectionRef.current = section;
            setCurrentSection(section);
          }

          if (Math.abs(self.getVelocity()) > 0.5) {
            isScrollingRef.current = true;
          } else if (!isScrollTweenActive()) {
            isScrollingRef.current = false;
          }

          throttledInvalidate();
        },
      });
    }, scrollRef);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (parallaxRaf.current !== null) cancelAnimationFrame(parallaxRaf.current);
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [enable3D, throttledInvalidate]);

  if (!enable3D) {
    return <ResearchUniverseFallback />;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <Suspense fallback={null}>
          <ResearchUniverseCanvas sceneState={sceneState} />
        </Suspense>
      </div>

      <div ref={scrollRef} className="trail-scroll-root relative z-10">
        <ScrollNarrative />
      </div>

      <TrailProgressBar
        activeSection={currentSection}
        onNavigate={navigateToSection}
      />
      <TrailIntroOverlay />
      <TrailAmbientAudio />

      <ProjectDetailPanel
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
