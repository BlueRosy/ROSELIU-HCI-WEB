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
