/**
 * Layer 1 — soft blue-white sky gradient (static). Galaxy motion lives in Three.js.
 */
export default function HeroSkyBackground() {
  return (
    <div className="hero-sky" aria-hidden="true">
      <div className="hero-sky__gradient" />
      <div className="hero-sky__scrim" />
    </div>
  );
}
