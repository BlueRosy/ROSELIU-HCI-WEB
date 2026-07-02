import { useCallback, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AMBIENT_SRC = "/audio/trail/research-world-ambient.mp3";

export default function TrailAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (!audio) return next;
      if (next) {
        audio.pause();
      } else {
        audio.volume = 0.35;
        void audio.play().catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <>
      <audio ref={audioRef} src={AMBIENT_SRC} loop preload="none" />
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
