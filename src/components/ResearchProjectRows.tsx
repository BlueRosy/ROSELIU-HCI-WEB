import { ExternalLink } from "lucide-react";
import { about, projects, type Project } from "../content/site";
import SmartImage from "./SmartImage";

function isRaster(src: string) {
  return /\.(jpe?g|png|webp)$/i.test(src.split("?")[0] ?? "");
}

/** Prefer real screenshots; diagrams stay contained on the blue field. */
function ProjectMedia({ project }: { project: Project }) {
  const src = project.image ?? project.gallery?.[0]?.src ?? null;

  if (!src) {
    return (
      <div className="project-row__media project-row__media--empty">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate/50">
          {project.projectType}
        </span>
      </div>
    );
  }

  const photo = isRaster(src);

  return (
    <div
      className={`project-row__media project-row__media--zoom ${
        photo ? "project-row__media--photo" : "project-row__media--diagram"
      }`}
    >
      <SmartImage
        src={src}
        alt={`${project.shortTitle ?? project.title} preview`}
        className="project-row__media-frame h-full w-full"
        imgClassName={
          photo
            ? "project-row__media-img h-full w-full object-cover object-center"
            : "project-row__media-img project-row__media-img--diagram h-full w-full object-contain object-center p-2.5"
        }
      />
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const title = project.shortTitle ?? project.title;
  const liveLinks = project.links.filter((l) => l.href);

  return (
    <article className="project-row group/project grid items-stretch gap-3.5 py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5 md:grid-cols-[200px_minmax(0,1fr)] md:gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
      <ProjectMedia project={project} />

      <div className="project-row__copy flex min-w-0 flex-col justify-center">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="font-sans text-[15px] font-semibold leading-snug text-ink sm:text-base md:text-lg">
            {title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary-deep">
            {project.projectType}
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate">
          {project.context}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink/90 sm:text-[14px]">
          {project.blurb}
        </p>
        {project.status && (
          <p className="mt-2 font-mono text-[11px] text-primary-deep/90">
            {project.status}
          </p>
        )}
        {liveLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {liveLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-deep underline-offset-2 hover:underline"
              >
                {link.label}
                <ExternalLink size={11} aria-hidden />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

type ResearchProjectRowsProps = {
  group?: "research" | "tool";
  showIntro?: boolean;
};

export default function ResearchProjectRows({
  group = "research",
  showIntro = false,
}: ResearchProjectRowsProps) {
  const list = projects.filter((p) => p.group === group);

  return (
    <section className="project-rows" aria-labelledby="project-rows-heading">
      <h2
        id="project-rows-heading"
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate"
      >
        Projects
      </h2>
      {showIntro && (
        <p className="project-rows__intro mt-3 text-[13.5px] leading-[1.7] text-ink/90 sm:text-[14px]">
          {about.projectsIntro}
        </p>
      )}
      <div className="mt-4 divide-y divide-border/70 sm:mt-5">
        {list.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
