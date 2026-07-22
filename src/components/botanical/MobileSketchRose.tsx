/**
 * Faint ink-sketch rose for the mobile About avatar — line only, soft motion.
 * Decorative; hidden from assistive tech.
 */
export default function MobileSketchRose() {
  return (
    <svg
      className="about-mobile-sketch-rose"
      viewBox="0 0 120 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="about-mobile-sketch-rose__draw">
        {/* stem */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--stem"
          d="M58 52 C 56 72, 54 92, 57 118 C 58 126, 60 132, 62 136"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        {/* leaf left */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--leaf"
          d="M56 96 C 42 90, 34 78, 38 70 C 46 74, 52 84, 56 96"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--leaf"
          d="M46 82 C 50 86, 53 90, 55 94"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* outer petal ring — open rose, sketchy */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--petal"
          d="M58 48 C 40 46, 28 34, 32 22 C 38 12, 52 10, 60 18 C 66 10, 80 10, 88 20 C 94 32, 86 46, 70 48 C 66 50, 62 50, 58 48"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* mid petals */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--petal"
          d="M52 40 C 44 36, 40 28, 44 22 C 48 18, 56 20, 58 26 C 60 20, 68 18, 74 24 C 78 30, 74 38, 66 40 C 62 42, 56 42, 52 40"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* inner spiral — the sketch signature */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--core"
          d="M58 34 C 54 32, 52 28, 54 26 C 57 24, 61 26, 60 30 C 59 33, 56 34, 54 32"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* loose construction marks — pencil feel */}
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--mark"
          d="M78 28 C 84 24, 90 26, 92 32"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__stroke--mark"
          d="M36 30 C 30 34, 28 40, 32 44"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
