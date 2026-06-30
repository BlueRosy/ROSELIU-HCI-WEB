import { HERO_VINE_PATHS } from "./botanical/heroVinePaths";

/** Corner vine accents + dashed signal-path curve. */
export default function HeroBotanicalVines() {
  return (
    <svg
      className="hero-botanical__vines h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vineStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A9275" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7A6658" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <path
        id="vine-topRightMain"
        d={HERO_VINE_PATHS.topRightMain}
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        id="vine-topRightBranch"
        d={HERO_VINE_PATHS.topRightBranch}
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        id="vine-bottomLeft"
        d={HERO_VINE_PATHS.bottomLeft}
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d={HERO_VINE_PATHS.signalPath}
        fill="none"
        stroke="#B9786F"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.35"
      />

      <circle cx="720" cy="620" r="3" fill="#8A9275" opacity="0.45" />
      <circle cx="580" cy="400" r="3" fill="#B9786F" opacity="0.5" />
      <circle cx="300" cy="100" r="3.5" fill="#8F514C" opacity="0.45" />
    </svg>
  );
}
