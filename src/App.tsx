import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Research from "./components/Research";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Methods from "./components/Methods";
import About from "./components/About";
import News from "./components/News";
import CV from "./components/CV";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import { useEnable3D } from "./hooks/useEnable3D";

export default function App() {
  const enable3D = useEnable3D();

  return (
    <div className="relative min-h-screen">
      <Nav />
      <main>
        <Hero enable3D={enable3D} />
        <About />
        <News />
        <Research enable3D={enable3D} />
        <Projects />
        <Publications />
        <Methods />
        <CV />
        <Journey />
      </main>
      <Contact />
    </div>
  );
}
