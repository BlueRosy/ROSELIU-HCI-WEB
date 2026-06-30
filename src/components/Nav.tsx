import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "../content/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
        <a
          href="#top"
          onClick={closeMenu}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-serif text-base text-navy transition ${
            scrolled ? "glass shadow-soft" : ""
          }`}
        >
          <span className="accent-dot inline-block h-2.5 w-2.5 rounded-full" />
          {profile.name}
        </a>

        {/* Desktop nav */}
        <nav
          className={`hidden items-center gap-1 rounded-full px-2 py-1 sm:flex ${
            scrolled ? "glass shadow-soft" : ""
          }`}
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full px-3.5 py-1.5 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-navy transition sm:hidden ${
            scrolled || menuOpen ? "glass shadow-soft" : ""
          }`}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="glass mx-5 mt-2 rounded-2xl px-2 py-2 shadow-soft sm:hidden"
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm text-slate transition hover:bg-primary/10 hover:text-primary-deep"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
