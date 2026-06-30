/** Corner vine accents + signal-path curve for the Hero botanical layer. */
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

      {/* top-right corner vine */}
      <path
        d="M1180 40 C1080 60, 1020 120, 980 200 S880 320, 820 380"
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M1150 80 C1100 100, 1060 140, 1040 180"
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* bottom-left corner vine */}
      <path
        d="M20 760 C120 720, 180 660, 240 580 S360 460, 440 420"
        fill="none"
        stroke="url(#vineStroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* signal path — roots → buds → bloom */}
      <path
        d="M720 620 C680 560, 640 480, 580 400 S480 280, 420 220 C380 180, 340 140, 300 100"
        fill="none"
        stroke="#B9786F"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.35"
      />

      {/* node dots along signal path */}
      <circle cx="720" cy="620" r="3" fill="#8A9275" opacity="0.45" />
      <circle cx="580" cy="400" r="3" fill="#B9786F" opacity="0.5" />
      <circle cx="300" cy="100" r="3.5" fill="#8F514C" opacity="0.45" />
    </svg>
  );
}
