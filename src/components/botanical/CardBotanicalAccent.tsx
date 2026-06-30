import { palette } from "../../theme/palette";

type Position = "top-right" | "bottom-left";

const POSITION_CLASS: Record<Position, string> = {
  "top-right": "right-0 top-0",
  "bottom-left": "left-0 bottom-0",
};

/** Subtle corner vine flourish for glass / paper cards. */
export default function CardBotanicalAccent({
  position = "top-right",
  className = "",
}: {
  position?: Position;
  className?: string;
}) {
  const flip = position === "bottom-left";
  return (
    <svg
      className={`card-botanical-accent pointer-events-none absolute h-16 w-16 opacity-[0.16] ${POSITION_CLASS[position]} ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
    >
      <path
        d="M4 58 C18 48, 28 36, 38 24 S52 12, 58 6"
        fill="none"
        stroke={palette.sage}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 52 C22 44, 30 34, 36 26"
        fill="none"
        stroke={palette.line}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="58" cy="6" r="2.5" fill={palette.primary} opacity="0.45" />
      <circle cx="52" cy="12" r="1.5" fill={palette.sage} opacity="0.4" />
    </svg>
  );
}
