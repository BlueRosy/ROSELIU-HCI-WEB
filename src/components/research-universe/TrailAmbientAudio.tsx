import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AMBIENT_SRC = "/audio/trail/research-world-ambient.mp3";
const VOLUME = 0.35;

export default function TrailAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const startedRef = useRef(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || startedRef.current) return;
    audio.volume = VOLUME;
    try {
      await audio.play();
      startedRef.current = true;
      setMuted(false);
    } catch {
      // Autoplay blocked — retry on next user gesture
    }
  }, []);

  useEffect(() => {
    void tryPlay();

    const onGesture = () => {
      void tryPlay();
    };
    window.addEventListener("wheel", onGesture, { passive: true });
    window.addEventListener("click", onGesture);
    window.addEventListener("keydown", onGesture);

    return () => {
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("click", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [tryPlay]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setMuted((prev) => {
      const next = !prev;
      if (next) {
        audio.pause();
      } else {
        audio.volume = VOLUME;
        startedRef.current = true;
        void audio.play().catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <>
      <audio ref={audioRef} src={AMBIENT_SRC} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        className="pointer-events-auto fixed bottom-8 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-surface/85 text-slate shadow-soft backdrop-blur-md transition hover:text-primary-deep"
        aria-label={muted ? "Play ambient music" : "Mute ambient music"}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </>
  );
}
