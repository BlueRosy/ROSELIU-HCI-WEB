import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
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
  const mesh = useRef<THREE.Mesh>(null);
  const { showProjectCards, onProjectSelect } = useUniverse();

  useFrame((_, delta) => {
    if (!group.current || !mesh.current) return;
    const visible = showProjectCards.current;
    const targetOpacity = visible ? 1 : 0;
    const targetScale = visible ? 1 : 0.6;
    group.current.visible = visible || group.current.scale.x > 0.65;

    const s = group.current.scale.x;
    group.current.scale.setScalar(s + (targetScale - s) * Math.min(1, delta * 3));

    const mat = mesh.current.material as THREE.MeshPhysicalMaterial;
    mat.opacity += (targetOpacity * 0.85 - mat.opacity) * Math.min(1, delta * 4);

    group.current.position.y = position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.08;
  });

  return (
    <group ref={group} position={position} visible={false}>
      <Billboard follow lockX lockZ>
        <mesh
          ref={mesh}
          onClick={(e) => {
            e.stopPropagation();
            onProjectSelect(projectId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <planeGeometry args={[1.8, 0.9]} />
          <meshPhysicalMaterial
            color="#FFFCF7"
            transparent
            opacity={0}
            roughness={0.2}
            metalness={0.05}
            transmission={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html
          transform
          occlude
          distanceFactor={6}
          style={{ pointerEvents: "auto", width: "180px" }}
        >
          <button
            type="button"
            onClick={() => onProjectSelect(projectId)}
            className="glass w-full rounded-xl border border-border/60 p-3 text-left shadow-soft backdrop-blur-md transition hover:border-primary/40"
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-primary-deep">
              {mapping}
            </span>
            <p className="mt-1 font-serif text-sm leading-snug text-ink">
              {title.length > 48 ? `${title.slice(0, 48)}…` : title}
            </p>
          </button>
        </Html>
      </Billboard>
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
