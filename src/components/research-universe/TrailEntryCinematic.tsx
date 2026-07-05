import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CINEMATIC_DURATION,
  CINEMATIC_DURATION_REDUCED,
  entryCinematicPhase,
  entryCinematicProgress,
} from "./entryCinematic";
import { useUniverse } from "./UniverseContext";

export default function TrailEntryCinematic() {
  const {
    entryRevealArmed,
    entryCinematicActive,
    entryCinematicT,
    entryCinematicDone,
    entryCinematicPhase: phaseRef,
    entryCinematicElapsed,
    heroCaptionVisible,
    reducedMotion,
    invalidate,
    onCinematicComplete,
    onCaptionReveal,
  } = useUniverse();

  const started = useRef(false);
  const captionTriggered = useRef(false);

  useFrame((_, delta) => {
    if (
      !entryRevealArmed.current ||
      !entryCinematicActive.current ||
      entryCinematicDone.current
    ) {
      return;
    }

    if (!started.current) {
      started.current = true;
      entryCinematicElapsed.current = 0;
      entryCinematicT.current = 0;
    }

    const reduced = reducedMotion.current;
    const dur = reduced ? CINEMATIC_DURATION_REDUCED : CINEMATIC_DURATION;
    entryCinematicElapsed.current = Math.min(
      dur,
      entryCinematicElapsed.current + delta,
    );

    const elapsed = entryCinematicElapsed.current;
    const phase = entryCinematicPhase(elapsed, reduced);
    phaseRef.current = phase;
    entryCinematicT.current = entryCinematicProgress(elapsed, reduced);

    if (
      (phase === "caption" || (reduced && elapsed >= 0.25)) &&
      !captionTriggered.current
    ) {
      captionTriggered.current = true;
      heroCaptionVisible.current = true;
      onCaptionReveal?.();
    }

    if (phase === "done") {
      entryCinematicDone.current = true;
      entryCinematicActive.current = false;
      entryRevealArmed.current = false;
      onCinematicComplete?.();
    }

    invalidate.current();
  });

  return null;
}
