import PageShell from "../components/PageShell";
import CV from "../components/CV";

export default function CVPage() {
  return (
    <PageShell>
      <div className="pt-8 sm:pt-10">
        <CV />
      </div>
    </PageShell>
  );
}
