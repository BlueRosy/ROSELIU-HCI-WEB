import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type * as THREE from "three";
import { projects, researchAtlas } from "../../content/site";
import { PROJECT_CARD_POSITIONS } from "./universeConfig";
import { useUniverse } from "./UniverseContext";

function ProjectCard3D({
  projectId,
  mapping,
  position,
  title,
}: {
  projectId: string;
  mapping: string;
  position: [number, number, number];
  title: string;
}) {
  const group = useRef<THREE.Group>(null);
  const { showProjectCards, onProjectSelect } = useUniverse();
  const alpha = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = showProjectCards.current ? 1 : 0;
    alpha.current += (target - alpha.current) * Math.min(1, delta * 2.5);
    group.current.visible = alpha.current > 0.03;
    group.current.scale.setScalar(0.85 + alpha.current * 0.15);
  });

  return (
    <group ref={group} position={position} visible={false}>
      <Html center distanceFactor={8} zIndexRange={[10, 0]}>
        <button
          type="button"
          onClick={() => onProjectSelect(projectId)}
          className="glass w-[190px] rounded-xl border border-border/60 p-3 text-left shadow-soft backdrop-blur-md transition hover:border-primary/40"
        >
          <span className="font-mono text-[9px] uppercase tracking-wider text-primary-deep">
            {mapping}
          </span>
          <p className="mt-1 font-serif text-sm leading-snug text-ink">
            {title.length > 48 ? `${title.slice(0, 48)}…` : title}
          </p>
        </button>
      </Html>
    </group>
  );
}

export default function FloatingProjectCards() {
  return (
    <group>
      {researchAtlas.projectEvidence.map((entry) => {
        const pos = PROJECT_CARD_POSITIONS[entry.projectId];
        const project = projects.find((p) => p.id === entry.projectId);
        if (!pos || !project) return null;
        return (
          <ProjectCard3D
            key={entry.projectId}
            projectId={entry.projectId}
            mapping={entry.mapping}
            position={pos}
            title={project.title}
          />
        );
      })}
    </group>
  );
}
