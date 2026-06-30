import { Canvas } from "@react-three/fiber";
import Starfield from "./Starfield";

export default function ParticleField({ active }: { active: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 11], fov: 55 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Starfield count={1400} rotationSpeed={0.01} />
    </Canvas>
  );
}
