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
import TrailProgressBar from "./TrailProgressBar";
import type { UniverseSceneState } from "./UniverseContext";
import { SCROLL_SECTIONS, type ScrollSection } from "./worldTrailConfig";

gsap.registerPlugin(ScrollTrigger);

const ResearchUniverseCanvas = lazy(
  () => import("./ResearchUniverseCanvas"),
);

export default function ResearchUniverseView() {
  const enable3D = useEnable3D();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<ScrollSection>("hero");

  const scrollProgress = useRef(0);
  const activeSection = useRef<ScrollSection>("hero");
  const activeZone = useRef("entry");
  const showProjectCards = useRef(false);
  const parallax = useRef({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);
  const pending = useRef({ x: 0, y: 0 });

  const onProjectSelect = useCallback((projectId: string) => {
    setSelectedProject(projectId);
  }, []);

  const sceneState: UniverseSceneState = {
    scrollProgress,
    activeSection,
    activeZone,
    showProjectCards,
    parallax,
    onProjectSelect,
  };

  useLayoutEffect(() => {
    if (!enable3D || !scrollRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      pending.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pending.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (parallaxRaf.current !== null) return;
      parallaxRaf.current = requestAnimationFrame(() => {
        parallax.current = { x: pending.current.x, y: pending.current.y };
        parallaxRaf.current = null;
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          const idx = Math.min(
            SCROLL_SECTIONS.length - 1,
            Math.floor(self.progress * SCROLL_SECTIONS.length),
          );
          activeSection.current = SCROLL_SECTIONS[idx];
          setCurrentSection(SCROLL_SECTIONS[idx]);
        },
      });
    }, scrollRef);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (parallaxRaf.current !== null) cancelAnimationFrame(parallaxRaf.current);
      ctx.revert();
    };
  }, [enable3D]);

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

      <div ref={scrollRef} className="relative z-10">
        <ScrollNarrative />
      </div>

      <TrailProgressBar activeSection={currentSection} />

      <ProjectDetailPanel
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
