type SiteLogoProps = {
  className?: string;
  size?: "nav" | "sm" | "md";
};

const SIZE_CLASS = {
  nav: "site-logo site-logo--nav",
  sm: "site-logo site-logo--sm",
  md: "site-logo site-logo--md",
} as const;

/** Blue star mark — replaces the rose logo for the cool palette. */
export default function SiteLogo({ className = "", size = "nav" }: SiteLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`${SIZE_CLASS[size]} ${className}`.trim()}
    >
      <defs>
        <linearGradient id="brand-star" x1="4" y1="2" x2="28" y2="30">
          <stop offset="0%" stopColor="#4A7FA3" />
          <stop offset="55%" stopColor="#1B4F72" />
          <stop offset="100%" stopColor="#0B2540" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="#F3F7FB" stroke="#7BA7C9" strokeWidth="1" />
      <path
        fill="url(#brand-star)"
        d="M16 5.2l2.4 6.2 6.6.4-5.1 4.2 1.7 6.4L16 18.9l-5.6 3.5 1.7-6.4-5.1-4.2 6.6-.4z"
      />
    </svg>
  );
}
