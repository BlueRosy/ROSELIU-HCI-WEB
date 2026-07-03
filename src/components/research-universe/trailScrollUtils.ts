import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_SECTIONS, type ScrollSection } from "./worldTrailConfig";

let activeScrollTween: gsap.core.Tween | null = null;
let snapSuspended = false;

export function isScrollTweenActive(): boolean {
  return activeScrollTween !== null;
}

export function isSnapSuspended(): boolean {
  return snapSuspended;
}

export function sectionIndex(section: ScrollSection): number {
  return SCROLL_SECTIONS.indexOf(section);
}

export function progressForSection(section: ScrollSection): number {
  const idx = sectionIndex(section);
  if (idx < 0) return 0;
  return idx / (SCROLL_SECTIONS.length - 1);
}

/** Scroll Y (px) when section top aligns with viewport top. */
export function getSectionScrollTarget(
  section: ScrollSection,
  scrollTrigger: ScrollTrigger | null,
): number | null {
  if (!scrollTrigger?.trigger) return null;
  const el = document.querySelector(
    `[data-section="${section}"]`,
  ) as HTMLElement | null;
  const root = scrollTrigger.trigger as HTMLElement;
  if (!el) return null;

  const rootTop = root.getBoundingClientRect().top + window.scrollY;
  const elTop = el.getBoundingClientRect().top + window.scrollY;
  const offset = elTop - rootTop;
  return scrollTrigger.start + offset;
}

export function progressFromScrollY(
  scrollY: number,
  scrollTrigger: ScrollTrigger | null,
): number {
  if (!scrollTrigger) return 0;
  const range = scrollTrigger.end - scrollTrigger.start;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (scrollY - scrollTrigger.start) / range));
}

export function sectionAtProgress(
  progress: number,
  scrollTrigger?: ScrollTrigger | null,
): ScrollSection {
  if (scrollTrigger?.trigger) {
    let best: ScrollSection = SCROLL_SECTIONS[0];
    let bestDist = Infinity;
    const range = scrollTrigger.end - scrollTrigger.start;
    const scrollY = scrollTrigger.start + progress * range;

    for (const section of SCROLL_SECTIONS) {
      const target = getSectionScrollTarget(section, scrollTrigger);
      if (target === null) continue;
      const dist = Math.abs(scrollY - target);
      if (dist < bestDist) {
        bestDist = dist;
        best = section;
      }
    }
    return best;
  }

  const idx = Math.min(
    SCROLL_SECTIONS.length - 1,
    Math.round(progress * (SCROLL_SECTIONS.length - 1)),
  );
  return SCROLL_SECTIONS[idx];
}

export type ScrollToSectionOptions = {
  duration?: number;
  invalidate?: () => void;
  isScrollingRef?: { current: boolean };
  scrollProgressRef?: { current: number };
  activeSectionRef?: { current: ScrollSection };
  onSectionChange?: (section: ScrollSection) => void;
};

export function scrollToSection(
  section: ScrollSection,
  scrollTrigger: ScrollTrigger | null,
  options: ScrollToSectionOptions = {},
) {
  if (!scrollTrigger) return;

  const y = getSectionScrollTarget(section, scrollTrigger);
  if (y === null) return;

  activeScrollTween?.kill();
  activeScrollTween = null;

  const {
    duration = 0.5,
    invalidate,
    isScrollingRef,
    scrollProgressRef,
    activeSectionRef,
    onSectionChange,
  } = options;

  snapSuspended = true;
  if (isScrollingRef) isScrollingRef.current = true;

  const scrollObj = { y: window.scrollY };
  activeScrollTween = gsap.to(scrollObj, {
    y,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      window.scrollTo(0, scrollObj.y);
      ScrollTrigger.update();

      const p = progressFromScrollY(scrollObj.y, scrollTrigger);
      if (scrollProgressRef) scrollProgressRef.current = p;
      if (activeSectionRef) activeSectionRef.current = section;

      invalidate?.();
    },
    onComplete: () => {
      snapSuspended = false;
      if (isScrollingRef) isScrollingRef.current = false;
      if (scrollProgressRef) {
        scrollProgressRef.current = progressFromScrollY(y, scrollTrigger);
      }
      if (activeSectionRef) activeSectionRef.current = section;
      onSectionChange?.(section);
      ScrollTrigger.refresh();
      invalidate?.();
      activeScrollTween = null;
    },
  });
}

export function nextSection(current: ScrollSection): ScrollSection {
  const idx = sectionIndex(current);
  return SCROLL_SECTIONS[Math.min(idx + 1, SCROLL_SECTIONS.length - 1)];
}

export function prevSection(current: ScrollSection): ScrollSection {
  const idx = sectionIndex(current);
  return SCROLL_SECTIONS[Math.max(idx - 1, 0)];
}

/** Snap progress to nearest section based on DOM positions. */
export function snapToNearestSection(
  progress: number,
  scrollTrigger: ScrollTrigger | null,
): number {
  if (!scrollTrigger?.trigger) {
    const step = 1 / (SCROLL_SECTIONS.length - 1);
    return Math.round(progress / step) * step;
  }

  let bestProgress = progress;
  let bestDist = Infinity;

  for (const section of SCROLL_SECTIONS) {
    const y = getSectionScrollTarget(section, scrollTrigger);
    if (y === null) continue;
    const p = progressFromScrollY(y, scrollTrigger);
    const dist = Math.abs(progress - p);
    if (dist < bestDist) {
      bestDist = dist;
      bestProgress = p;
    }
  }
  return bestProgress;
}
