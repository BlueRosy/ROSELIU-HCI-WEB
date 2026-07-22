/**
 * A small sketch bouquet beside the mobile avatar —
 * open rose + bud + side bloom, each with its own sway.
 */
export default function MobileSketchRose() {
  return (
    <svg
      className="about-mobile-sketch-rose"
      viewBox="0 0 130 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* floating sketch dust */}
      <g className="about-mobile-sketch-rose__dust" opacity="0.45">
        <circle className="about-mobile-sketch-rose__dot about-mobile-sketch-rose__dot--a" cx="96" cy="28" r="1.1" fill="currentColor" />
        <circle className="about-mobile-sketch-rose__dot about-mobile-sketch-rose__dot--b" cx="108" cy="48" r="0.9" fill="currentColor" />
        <circle className="about-mobile-sketch-rose__dot about-mobile-sketch-rose__dot--c" cx="88" cy="62" r="0.75" fill="currentColor" />
      </g>

      {/* shared ground stems */}
      <g className="about-mobile-sketch-rose__stems">
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M42 70 C 40 96, 38 122, 44 152"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M58 78 C 62 104, 70 128, 78 150"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M70 64 C 78 90, 92 118, 102 146"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        {/* leaves */}
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M40 108 C 22 100, 14 86, 20 76 C 30 84, 36 96, 40 108"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M74 118 C 88 112, 98 100, 94 90 C 84 96, 78 108, 74 118"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* main open rose */}
      <g className="about-mobile-sketch-rose__bloom about-mobile-sketch-rose__bloom--main">
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M30 52 C 34 58, 38 60, 42 54 C 46 60, 52 60, 56 52"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M42 16
             C 30 14, 20 22, 18 34
             C 16 44, 22 52, 30 52
             C 24 42, 26 34, 34 30
             C 38 20, 48 18, 52 26
             C 58 18, 70 20, 72 32
             C 74 42, 68 52, 58 52
             C 66 44, 68 34, 62 28
             C 56 18, 48 14, 42 16 Z"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M34 38 C 32 28, 40 24, 46 28 C 50 24, 58 26, 58 34 C 58 42, 50 46, 44 44 C 38 44, 34 42, 34 38"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__core"
          d="M44 36 C 42 34, 42 31, 44 30 C 47 29, 49 31, 48 34 C 47 37, 44 38, 42 36"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>

      {/* side open bloom — smaller */}
      <g className="about-mobile-sketch-rose__bloom about-mobile-sketch-rose__bloom--side">
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M78 48
             C 70 46, 64 50, 64 58
             C 64 64, 70 68, 76 66
             C 72 60, 74 56, 78 54
             C 82 50, 88 50, 90 56
             C 92 62, 88 68, 82 68
             C 88 62, 88 56, 84 52
             C 82 48, 80 48, 78 48 Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__core"
          d="M76 58 C 75 56, 76 54, 78 54 C 80 54, 80 56, 79 58 C 78 59, 76 59, 76 58"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>

      {/* bud — nodding */}
      <g className="about-mobile-sketch-rose__bloom about-mobile-sketch-rose__bloom--bud">
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M102 72 C 96 70, 92 74, 94 82 C 96 88, 102 90, 106 86 C 110 82, 108 74, 102 72 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke"
          d="M96 84 C 100 88, 104 88, 108 84"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="about-mobile-sketch-rose__stroke about-mobile-sketch-rose__core"
          d="M100 78 C 100 76, 102 76, 102 78"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
