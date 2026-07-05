export default function TrailIntroOverlay({
  cinematicDone,
  hideHint = false,
}: {
  cinematicDone: boolean;
  hideHint?: boolean;
}) {
  if (!cinematicDone || hideHint) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center pb-36"
      aria-hidden
    >
      <p className="trail-intro-hint font-mono text-[11px] uppercase tracking-[0.2em] text-slate/90">
        Scroll · ↑ ↓ · Space to walk the trail
      </p>
    </div>
  );
}
