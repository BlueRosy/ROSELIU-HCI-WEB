import Nav from "./components/Nav";
import Hero from "./components/Hero";
import News from "./components/News";
import Research from "./components/Research";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Methods from "./components/Methods";
import About from "./components/About";
import Journey from "./components/Journey";
import CV from "./components/CV";
import Contact from "./components/Contact";
import RoseCursor from "./components/RoseCursor";
import { useEnable3D } from "./hooks/useEnable3D";

export default function App() {
  const enable3D = useEnable3D();

  return (
    <div className="relative min-h-screen">
      <RoseCursor />
      <Nav />
      <main>
        <Hero enable3D={enable3D} />
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
