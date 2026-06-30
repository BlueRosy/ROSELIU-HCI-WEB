import HeroBotanicalVines from "./HeroBotanicalVines";
import HeroRoseBlooms from "./HeroRoseBlooms";

export default function HeroBotanicalBackground() {
  return (
    <div className="hero-botanical" aria-hidden="true">
      <div className="hero-botanical__gradient" />
      <div className="hero-botanical__grain" />
      <HeroBotanicalVines />
      <HeroRoseBlooms />
      <div className="hero-botanical__scrim" />
    </div>
  );
}
