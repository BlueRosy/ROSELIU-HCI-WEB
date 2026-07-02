import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "../content/site";
import SiteLogo from "./SiteLogo";

export default function Nav({ variant = "home" }: { variant?: "home" | "subpage" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = variant === "subpage" ? "/#about" : "#about";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const logoClass = `flex items-center gap-2.5 rounded-full px-3 py-1.5 font-serif text-base text-ink transition ${
    scrolled ? "glass shadow-soft" : ""
  }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        {variant === "subpage" ? (
          <Link to={homeHref} onClick={closeMenu} className={logoClass}>
            <SiteLogo size="nav" />
            {profile.name}
          </Link>
        ) : (
          <a href={homeHref} onClick={closeMenu} className={logoClass}>
            <SiteLogo size="nav" />
            {profile.name}
          </a>
        )}

        <nav
          className={`hidden items-center gap-1 rounded-full px-2 py-1 sm:flex ${
            scrolled ? "glass shadow-soft" : ""
          }`}
        >
          {nav.map((item) => {
            const href = variant === "subpage" ? `/#${item.id}` : `#${item.id}`;
            return variant === "subpage" ? (
              <Link
                key={item.id}
                to={href}
                className="rounded-full px-3.5 py-1.5 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.id}
                href={href}
                className="rounded-full px-3.5 py-1.5 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

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
                className="block rounded-xl px-4 py-3 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.id}
                href={href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
