import { Link } from "react-router-dom";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import { nav, profile, studioHub } from "../content/site";
import { useIsMobileViewport } from "../hooks/useEnable3D";
import SiteLogo from "./SiteLogo";

const NAV_ITEM =
  "inline-flex h-8 items-center rounded-full px-3 text-[13px] leading-none text-slate transition hover:bg-primary/10 hover:text-primary-deep";

export default function Nav({ variant = "home" }: { variant?: "home" | "subpage" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [mobileStudioOpen, setMobileStudioOpen] = useState(false);
  const studioRef = useRef<HTMLDivElement>(null);
  const studioMenuId = useId();
  const homeHref = variant === "subpage" ? "/#about" : "#about";
  const isMobile = useIsMobileViewport();
  const studioItems = studioHub.items.filter((item) => !(item.desktopOnly && isMobile));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen && !studioOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setStudioOpen(false);
        setMobileStudioOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, studioOpen]);

  useEffect(() => {
    if (!studioOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!studioRef.current?.contains(e.target as Node)) {
        setStudioOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [studioOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileStudioOpen(false);
  };

  const brandClass = `inline-flex h-10 max-w-[min(100%,14.5rem)] items-center gap-2 rounded-full px-2.5 font-serif text-[15px] leading-none tracking-[-0.01em] text-ink transition sm:max-w-none ${
    scrolled ? "glass shadow-soft" : ""
  }`;

  const studioItemClass =
    "flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-primary/10";

  const renderStudioItems = (onNavigate: () => void) =>
    studioItems.map((item) => {
      const body = (
        <>
          <span>
            <span className="block text-sm font-medium text-ink">{item.title}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-slate">
              {item.hint}
            </span>
          </span>
          {item.external && (
            <ExternalLink size={14} className="mt-1 shrink-0 text-slate/70" />
          )}
        </>
      );

      if (item.external) {
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className={studioItemClass}
          >
            {body}
          </a>
        );
      }

      return (
        <Link
          key={item.id}
          to={item.href}
          onClick={onNavigate}
          className={studioItemClass}
        >
          {body}
        </Link>
      );
    });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="mx-auto flex h-11 min-w-0 max-w-5xl items-center justify-between gap-3 px-5">
        {variant === "subpage" ? (
          <Link to={homeHref} onClick={closeMenu} className={brandClass}>
            <SiteLogo size="nav" />
            <span className="truncate">{profile.name}</span>
          </Link>
        ) : (
          <a href={homeHref} onClick={closeMenu} className={brandClass}>
            <SiteLogo size="nav" />
            <span className="truncate">{profile.name}</span>
          </a>
        )}

        <div
          className={`relative hidden h-10 items-center rounded-full px-1.5 sm:flex ${
            scrolled ? "glass shadow-soft" : ""
          }`}
          ref={studioRef}
        >
          <nav className="flex h-full items-center gap-0.5" aria-label="Primary">
            {nav.map((item) => {
              const href = variant === "subpage" ? `/#${item.id}` : `#${item.id}`;
              return variant === "subpage" ? (
                <Link key={item.id} to={href} className={NAV_ITEM}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.id} href={href} className={NAV_ITEM}>
                  {item.label}
                </a>
              );
            })}
          </nav>

          <span className="mx-1 hidden h-4 w-px bg-border lg:block" aria-hidden />

          <button
            type="button"
            aria-expanded={studioOpen}
            aria-controls={studioMenuId}
            onClick={() => setStudioOpen((o) => !o)}
            className={`${NAV_ITEM} gap-1 ${
              studioOpen ? "bg-primary/10 text-primary-deep" : ""
            }`}
          >
            {studioHub.label}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                studioOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {studioOpen && (
            <div
              id={studioMenuId}
              role="menu"
              className="glass absolute right-0 top-[calc(100%+0.5rem)] w-72 rounded-2xl p-2 shadow-lift"
            >
              <p className="px-3 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                Enter a built space
              </p>
              {renderStudioItems(() => setStudioOpen(false))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-ink transition sm:hidden ${
            scrolled || menuOpen ? "glass shadow-soft" : ""
          }`}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="glass mx-5 mt-2 rounded-2xl px-2 py-2 shadow-soft sm:hidden"
        >
          {nav.map((item) => {
            const href = variant === "subpage" ? `/#${item.id}` : `#${item.id}`;
            return variant === "subpage" ? (
              <Link
                key={item.id}
                to={href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-[13px] text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.id}
                href={href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-[13px] text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </a>
            );
          })}

          <div className="mt-1 border-t border-border/70 pt-1">
            <button
              type="button"
              aria-expanded={mobileStudioOpen}
              onClick={() => setMobileStudioOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[13px] text-slate transition hover:bg-primary/10 hover:text-primary-deep"
            >
              {studioHub.label}
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileStudioOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileStudioOpen && (
              <div className="pb-1 pl-2">{renderStudioItems(closeMenu)}</div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
