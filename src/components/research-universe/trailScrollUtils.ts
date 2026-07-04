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

/**
 * Scroll Y (px) that centres a section in the viewport. This is the "anchor"
 * where the section's caption reads as active AND the camera should sit on that
 * section's landmark — so labels, snap, and camera all agree.
 */
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
  const centerOffset = el.offsetHeight / 2 - window.innerHeight / 2;
  const anchor = scrollTrigger.start + (elTop - rootTop) + centerOffset;
  return Math.max(scrollTrigger.start, Math.min(scrollTrigger.end, anchor));
}

/**
 * Cached section anchors (scroll Y that centres each section). Reading rects
 * every scroll frame risks layout thrash, so we recompute only on refresh.
 */
let anchorCache: number[] | null = null;

export function refreshSectionAnchors(scrollTrigger: ScrollTrigger | null): void {
  if (!scrollTrigger?.trigger) {
    anchorCache = null;
    return;
  }
  const arr: number[] = [];
  for (const s of SCROLL_SECTIONS) {
    const a = getSectionScrollTarget(s, scrollTrigger);
    if (a === null) {
      anchorCache = null;
      return;
    }
    arr.push(a);
  }
  anchorCache = arr;
}

function getAnchors(scrollTrigger: ScrollTrigger | null): number[] | null {
  if (!anchorCache) refreshSectionAnchors(scrollTrigger);
  return anchorCache;
}

/**
 * Normalised progress in [0,1] where each section anchor lands on an even
 * boundary k/(N-1). Decouples the camera + labels from uneven section heights,
 * so caption, landmark, and snap target always line up.
 */
export function measuredProgressAt(
  scrollY: number,
  scrollTrigger: ScrollTrigger | null,
): number {
  const anchors = getAnchors(scrollTrigger);
  if (!anchors) return progressFromScrollY(scrollY, scrollTrigger);
  const n = anchors.length - 1;
  if (scrollY <= anchors[0]) return 0;
  if (scrollY >= anchors[n]) return 1;
  for (let k = 0; k < n; k++) {
    const y0 = anchors[k];
    const y1 = anchors[k + 1];
    if (scrollY >= y0 && scrollY <= y1) {
      const span = Math.max(1, y1 - y0);
      return (k + (scrollY - y0) / span) / n;
    }
  }
  return 1;
}

/** Nearest section for a normalised (section-space) progress value. */
export function sectionFromProgress(progress: number): ScrollSection {
  const n = SCROLL_SECTIONS.length - 1;
  const idx = Math.max(0, Math.min(n, Math.round(progress * n)));
  return SCROLL_SECTIONS[idx];
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

      const p = measuredProgressAt(scrollObj.y, scrollTrigger);
      if (scrollProgressRef) scrollProgressRef.current = p;
      if (activeSectionRef) activeSectionRef.current = section;

      invalidate?.();
    },
    onComplete: () => {
      snapSuspended = false;
      if (isScrollingRef) isScrollingRef.current = false;
      if (scrollProgressRef) {
        scrollProgressRef.current = measuredProgressAt(y, scrollTrigger);
      }
      if (activeSectionRef) activeSectionRef.current = section;
      onSectionChange?.(section);
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

/** Snap progress (ScrollTrigger space) to the nearest section anchor. */
export function snapToNearestSection(
  progress: number,
  scrollTrigger: ScrollTrigger | null,
): number {
  const anchors = getAnchors(scrollTrigger);
  if (!anchors || !scrollTrigger) {
    const step = 1 / (SCROLL_SECTIONS.length - 1);
    return Math.round(progress / step) * step;
  }

  let bestProgress = progress;
  let bestDist = Infinity;
  for (const y of anchors) {
    const p = progressFromScrollY(y, scrollTrigger);
    const dist = Math.abs(progress - p);
    if (dist < bestDist) {
      bestDist = dist;
      bestProgress = p;
    }
  }
  return bestProgress;
}
