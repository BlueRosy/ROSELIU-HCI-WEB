import PageShell from "../components/PageShell";
import About from "../components/About";

/** Landing = About: profile, bio, recent news, research projects. */
export default function HomePage() {
  return (
    <PageShell>
      <About />
    </PageShell>
  );
}
