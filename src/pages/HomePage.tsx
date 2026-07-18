import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import About from "../components/About";
import News from "../components/News";
import Research from "../components/Research";
import Projects from "../components/Projects";
import Publications from "../components/Publications";
import Methods from "../components/Methods";
import Journey from "../components/Journey";
import CV from "../components/CV";
import Contact from "../components/Contact";
import { useEnable3D } from "../hooks/useEnable3D";

export default function HomePage() {
  const enable3D = useEnable3D();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    if (!id) return;

    const scrollToHash = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Wait a frame so section layout is ready after client navigation
    const frame = requestAnimationFrame(scrollToHash);
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div id="top" className="relative min-h-screen">
      <Nav />
      <main>
        <About />
        <News />
        <Research enable3D={enable3D} />
        <Projects />
        <Publications />
        <Methods />
        <Journey />
        <CV />
      </main>
      <Contact />
    </div>
  );
}
