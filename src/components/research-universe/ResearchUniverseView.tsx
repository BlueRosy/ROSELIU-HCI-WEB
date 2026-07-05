import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEnable3D } from "../../hooks/useEnable3D";
import type { TimeOfDay } from "../../hooks/useLocalTimeOfDay";
import ProjectDetailPanel from "./ProjectDetailPanel";
import ResearchUniverseFallback from "./ResearchUniverseFallback";
import ScrollNarrative from "./ScrollNarrative";
import TrailAmbientAudio from "./TrailAmbientAudio";
import TrailIntroOverlay from "./TrailIntroOverlay";
import TrailProgressBar from "./TrailProgressBar";
import TrailSceneLoader from "./TrailSceneLoader";
import TrailSkyCityIntro from "./TrailSkyCityIntro";
import type { UniverseSceneState } from "./UniverseContext";
import type { EntryCinematicPhase } from "./entryCinematic";
import {
  isScrollTweenActive,
  isSnapSuspended,
  measuredProgressAt,
  refreshSectionAnchors,
  scrollToSection,
  sectionFromProgress,
  setCinematicLocked,
  snapToNearestSection,
  TRAIL_SECTION_SCROLL_DURATION,
} from "./trailScrollUtils";
import { useTrailKeyboard } from "./useTrailKeyboard";
import type { ScrollSection } from "./worldTrailConfig";

gsap.registerPlugin(ScrollTrigger);

const ResearchUniverseCanvas = lazy(
  () => import("./ResearchUniverseCanvas"),
);

const PARALLAX_THRESHOLD = 0.015;

export default function ResearchUniverseView() {
  const enable3D = useEnable3D();
  const timeOfDayRef = useRef<TimeOfDay>("day");
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastSectionRef = useRef<ScrollSection>("hero");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<ScrollSection>("hero");
  const [entered, setEntered] = useState(false);
  // Trail canvas mounts slightly after intro tears down so two WebGL contexts
  // never overlap (that overlap was blanking the sky-city view).
  const [trailCanvasLive, setTrailCanvasLive] = useState(false);
  // `entering` covers the sky-city → entry hand-off (loader visible until the
  // main scene's models finish streaming in); `sceneReady` retires the loader.
  const [entering, setEntering] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [cinematicDone, setCinematicDone] = useState(false);
  const [heroCaptionVisible, setHeroCaptionVisible] = useState(false);
  const [cinematicSession, setCinematicSession] = useState(0);
  const showLoader = entering && !sceneReady;

  const scrollProgress = useRef(0);
  const activeSection = useRef<ScrollSection>("hero");
  const activeZone = useRef("entry");
  const showProjectCards = useRef(false);
  const parallax = useRef({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);
  const pending = useRef({ x: 0, y: 0 });
  const lastParallax = useRef({ x: 0, y: 0 });
  const invalidate = useRef<() => void>(() => {});
  const isScrollingRef = useRef(false);
  const entryRevealArmed = useRef(false);
  const entryCinematicActive = useRef(false);
  const entryCinematicDone = useRef(false);
  const entryCinematicT = useRef(0);
  const entryCinematicElapsed = useRef(0);
  const entryCinematicPhase = useRef<EntryCinematicPhase>("idle");
  const heroCaptionVisibleRef = useRef(false);

  const onSectionChange = useCallback((section: ScrollSection) => {
    lastSectionRef.current = section;
    setCurrentSection(section);
  }, []);

  const onProjectSelect = useCallback((projectId: string) => {
    setSelectedProject(projectId);
  }, []);

  // Fires the moment "Enter" is clicked (before the intro finishes fading) so
  // the loader is already up behind the intro — no white flash in the gap.
  const handleEnterStart = useCallback(() => {
    setSceneReady(false);
    setEntering(true);
    // Warm the main scene chunk + its GLB preloads now (no WebGL context yet),
    // so models are already downloading while the intro fades out.
    void import("./ResearchUniverseCanvas");
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    window.scrollTo(0, 0);
  }, []);

  // Let visitors fly back up to the sky-city intro at any time.
  const handleReplayIntro = useCallback(() => {
    window.scrollTo(0, 0);
    entryRevealArmed.current = false;
    entryCinematicActive.current = false;
    entryCinematicDone.current = false;
    entryCinematicT.current = 0;
    entryCinematicElapsed.current = 0;
    entryCinematicPhase.current = "idle";
    heroCaptionVisibleRef.current = false;
    setCinematicLocked(false);
    setCinematicDone(false);
    setHeroCaptionVisible(false);
    setCinematicSession((n) => n + 1);
    scrollTriggerRef.current?.enable();
    setEntered(false);
    setEntering(false);
    setSceneReady(false);
  }, []);

  const handleCinematicComplete = useCallback(() => {
    entryCinematicDone.current = true;
    entryCinematicActive.current = false;
    setCinematicLocked(false);
    setCinematicDone(true);
    scrollTriggerRef.current?.enable();
    ScrollTrigger.refresh();
  }, []);

  const handleCaptionReveal = useCallback(() => {
    heroCaptionVisibleRef.current = true;
    setHeroCaptionVisible(true);
  }, []);

  const startEntryCinematic = useCallback(() => {
    entryRevealArmed.current = true;
    entryCinematicActive.current = true;
    entryCinematicDone.current = false;
    entryCinematicT.current = 0;
    entryCinematicElapsed.current = 0;
    entryCinematicPhase.current = "framing";
    heroCaptionVisibleRef.current = false;
    setCinematicDone(false);
    setHeroCaptionVisible(false);
    scrollTriggerRef.current?.disable();
    window.scrollTo(0, 0);
  }, []);

  // Lock page scroll (and stray keyboard nav) while the sky-city intro is up.
  useEffect(() => {
    if (!enable3D || entered) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [enable3D, entered]);

  // Lock scroll during entry cinematic (~4s).
  useEffect(() => {
    if (!enable3D || !entered || cinematicDone) return;

    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("wheel", block, { passive: false, capture: true });
    window.addEventListener("touchmove", block, { passive: false, capture: true });
    window.addEventListener("keydown", block, { capture: true });

    return () => {
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
      window.removeEventListener("keydown", block, { capture: true });
    };
  }, [enable3D, entered, cinematicDone]);

  // After the intro unlocks scrolling, re-measure so anchors/range are correct.
  useEffect(() => {
    if (!enable3D || !entered) return;
    ScrollTrigger.refresh();
  }, [enable3D, entered]);

  useEffect(() => {
    if (!entered) {
      setTrailCanvasLive(false);
      return;
    }
    const t = window.setTimeout(() => setTrailCanvasLive(true), 600);
    return () => window.clearTimeout(t);
  }, [entered]);

  const navigateToSection = useCallback(
    (section: ScrollSection) => {
      scrollToSection(section, scrollTriggerRef.current, {
        duration: TRAIL_SECTION_SCROLL_DURATION,
        ease: "power2.inOut",
        invalidate: () => invalidate.current(),
        isScrollingRef,
        scrollProgressRef: scrollProgress,
        activeSectionRef: activeSection,
        onSectionChange,
      });
    },
    [onSectionChange],
  );

  useTrailKeyboard(
    activeSection,
    scrollTriggerRef,
    invalidate,
    isScrollingRef,
    scrollProgress,
    onSectionChange,
  );

  const sceneState: UniverseSceneState = {
    scrollProgress,
    activeSection,
    activeZone,
    showProjectCards,
    parallax,
    invalidate,
    isScrollingRef,
    entryRevealArmed,
    entryCinematicActive,
    entryCinematicDone,
    entryCinematicT,
    entryCinematicElapsed,
    entryCinematicPhase,
    heroCaptionVisible: heroCaptionVisibleRef,
    timeOfDay: timeOfDayRef,
    reducedMotion,
    onProjectSelect,
    onCinematicComplete: handleCinematicComplete,
    onCaptionReveal: handleCaptionReveal,
  };

  useLayoutEffect(() => {
    if (!enable3D || !scrollRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const dx = Math.abs(nx - lastParallax.current.x);
      const dy = Math.abs(ny - lastParallax.current.y);
      if (dx + dy < PARALLAX_THRESHOLD) return;

      pending.current.x = nx;
      pending.current.y = ny;
      if (parallaxRaf.current !== null) return;
      parallaxRaf.current = requestAnimationFrame(() => {
        lastParallax.current.x = pending.current.x;
        lastParallax.current.y = pending.current.y;
        parallax.current.x = pending.current.x;
        parallax.current.y = pending.current.y;
        parallaxRaf.current = null;
        if (!isScrollingRef.current) invalidate.current();
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        snap: {
          snapTo: (progress) => {
            if (isSnapSuspended()) return progress;
            const st = scrollTriggerRef.current;
            if (!st) return progress;
            const range = st.end - st.start;
            const scrollY = st.start + progress * range;
            if (sectionFromProgress(measuredProgressAt(scrollY, st)) === "projects") {
              return progress;
            }
            return snapToNearestSection(progress, st);
          },
          duration: { min: 0.3, max: 0.8 },
          delay: 0.12,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const st = scrollTriggerRef.current;
          const range = (st?.end ?? 0) - (st?.start ?? 0);
          const scrollY = (st?.start ?? 0) + self.progress * range;
          const p = measuredProgressAt(scrollY, st);
          scrollProgress.current = p;

          const section = sectionFromProgress(p);
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

          invalidate.current();
        },
      });
    }, scrollRef);

    const refreshAnchors = () => refreshSectionAnchors(scrollTriggerRef.current);
    ScrollTrigger.addEventListener("refresh", refreshAnchors);
    refreshAnchors();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ScrollTrigger.removeEventListener("refresh", refreshAnchors);
      if (parallaxRaf.current !== null) cancelAnimationFrame(parallaxRaf.current);
      scrollTriggerRef.current = null;
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
        {/* Only mount the main WebGL canvas after the intro is gone, so the two
            heavy contexts never run at once (was causing "Context Lost"). */}
        {trailCanvasLive && (
          <Suspense fallback={null}>
            <ResearchUniverseCanvas sceneState={sceneState} />
          </Suspense>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`trail-scroll-root relative z-10 ${entered ? "" : "invisible"}`}
        aria-hidden={!entered}
      >
        <ScrollNarrative
          key={cinematicSession}
          heroCaptionVisible={heroCaptionVisible}
          activeSection={currentSection}
        />
      </div>

      {!showLoader && (
        <TrailProgressBar
          activeSection={currentSection}
          onNavigate={navigateToSection}
          onReplayIntro={handleReplayIntro}
          cinematicLocked={!cinematicDone && entered}
        />
      )}
      {!showLoader && (
        <TrailIntroOverlay
          cinematicDone={cinematicDone}
          hideHint={currentSection === "projects"}
        />
      )}
      <TrailAmbientAudio />

      <ProjectDetailPanel
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {showLoader && (
        <TrailSceneLoader
          trailActive={trailCanvasLive}
          onReady={() => {
            setSceneReady(true);
            setEntering(false);
            setCinematicLocked(true);
            startEntryCinematic();
          }}
        />
      )}

      {!entered && (
        <TrailSkyCityIntro
          onEnter={handleEnter}
          onEnterStart={handleEnterStart}
        />
      )}
    </>
  );
}
