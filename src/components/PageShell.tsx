import type { ReactNode } from "react";
import Nav from "./Nav";

type PageShellProps = {
  children: ReactNode;
  /** Softer background wash; default on. */
  breath?: boolean;
};

/** Shared chrome for multi-page academic site. */
export default function PageShell({ children, breath = true }: PageShellProps) {
  return (
    <div id="top" className="relative min-h-screen">
      {breath && (
        <div className="page-breath page-breath--calm" aria-hidden="true">
          <span className="page-breath__orb page-breath__orb--a" />
          <span className="page-breath__orb page-breath__orb--b" />
        </div>
      )}
      <Nav />
      <main className="relative z-[1]">{children}</main>
    </div>
  );
}
