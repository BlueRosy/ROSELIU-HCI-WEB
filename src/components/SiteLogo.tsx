const LOGO_SRC = "/Rose-PersonalImage/website-logo-transparent.png";

type SiteLogoProps = {
  className?: string;
  size?: "nav" | "sm" | "md";
};

const SIZE_CLASS = {
  nav: "site-logo site-logo--nav",
  sm: "site-logo site-logo--sm",
  md: "site-logo site-logo--md",
} as const;

/** Botanical mark — transparent PNG so it sits cleanly on glass/cream backgrounds. */
export default function SiteLogo({ className = "", size = "nav" }: SiteLogoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt=""
      aria-hidden="true"
      className={`${SIZE_CLASS[size]} ${className}`.trim()}
      decoding="async"
      draggable={false}
    />
  );
}
