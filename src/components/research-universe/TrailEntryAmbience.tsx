import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroPetalPalette } from "../../theme/palette";
import { getRwWonderland } from "../../theme/rwWonderland";
import { decayRevealBoosts } from "./entryRevealBoost";
import { pathRevealT, sampleEntryCinematicCamera } from "./entryCinematic";
import TrailDoorArchLights from "./TrailDoorArchLights";
import { useUniverse } from "./UniverseContext";
import { TRAIL_CURVE } from "./worldTrailConfig";

/** World-space lantern positions (RWEntryPavilion group z≈3.2). */
const LANTERN_POSITIONS: [number, number, number][] = [
  [-2.5, 1.2, 4.45],
  [2.5, 1.2, 4.45],
];

const petalGeometry = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.18, 0.22, 0.28, 0, 0.42);
  shape.bezierCurveTo(-0.22, 0.28, -0.08, 0.18, 0, 0);
  return new THREE.ShapeGeometry(shape);
})();

const ENTRY_PETALS = [
  { position: [0.6, 2.1, 4.8] as [number, number, number], scale: 0.32, phase: 0, drift: [0.12, 0.09] as [number, number], color: heroPetalPalette[0] },
  { position: [-0.5, 1.8, 5.2] as [number, number, number], scale: 0.28, phase: 1.4, drift: [0.1, 0.08] as [number, number], color: heroPetalPalette[1] },
  { position: [0.2, 2.4, 3.9] as [number, number, number], scale: 0.26, phase: 2.6, drift: [0.09, 0.1] as [number, number], color: heroPetalPalette[2] },
];

function buildPathWaveGeometry() {
  const curve = TRAIL_CURVE;
  const endT = 0.72;
  const segments = 72;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const t = u * endT;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const wobble =
      0.88 +
      0.14 * Math.sin(u * 14.2 + 0.4) +
      0.1 * Math.sin(u * 27.5 + 1.8);
    const halfW = THREE.MathUtils.lerp(0.34, 0.16, u) * wobble;
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(halfW);
    const left = p.clone().add(side);
    const right = p.clone().sub(side);
    positions.push(left.x, 0.16, left.z, right.x, 0.16, right.z);
    uvs.push(u, 0, u, 1);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

const PATH_GLIMMER_COUNT = 32;

function hash1D(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function buildPathGlimmers(): {
  position: THREE.Vector3;
  along: number;
  stagger: number;
  scale: number;
}[] {
  const curve = TRAIL_CURVE;
  const endT = 0.72;
  const glimmers: {
    position: THREE.Vector3;
    along: number;
    stagger: number;
    scale: number;
  }[] = [];

  for (let i = 0; i < PATH_GLIMMER_COUNT; i++) {
    const along = i / (PATH_GLIMMER_COUNT - 1);
    const t = along * endT;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const lateral = (hash1D(i * 1.7 + 2.3) - 0.5) * 0.42;
    const lift = 0.14 + hash1D(i * 3.1 + 0.8) * 0.1;
    glimmers.push({
      position: p.clone().add(side.multiplyScalar(lateral)).add(new THREE.Vector3(0, lift, 0)),
      along,
      stagger: (hash1D(i * 2.9 + 5.1) - 0.5) * 0.2,
      scale: 0.55 + hash1D(i * 4.3) * 0.65,
    });
  }

  return glimmers;
}

const PATH_GLIMMERS = buildPathGlimmers();
const glimmerGeo = new THREE.CircleGeometry(0.11, 8);

function EntryPetal({
  position,
  scale,
  phase,
  drift,
  color,
}: (typeof ENTRY_PETALS)[number]) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.set(
      position[0] + Math.sin(t * 0.32 + phase) * drift[0],
      position[1] + Math.sin(t * 0.26 + phase * 1.3) * drift[1],
      position[2],
    );
    ref.current.rotation.z = Math.sin(t * 0.22 + phase) * 0.15;
  });

  return (
    <mesh ref={ref} scale={scale}>
      <primitive object={petalGeometry} attach="geometry" />
      <meshBasicMaterial color={color} transparent opacity={0.32} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function CinematicBloomPulse() {
  const { gl } = useThree();
  const { entryCinematicActive, entryCinematicElapsed, reducedMotion } = useUniverse();
  const baseExposure = useRef(gl.toneMappingExposure);
  const pulsed = useRef(false);

  useFrame(() => {
    if (!entryCinematicActive.current || reducedMotion.current) return;
    const sample = sampleEntryCinematicCamera(entryCinematicElapsed.current, false);
    if (sample.crossedThreshold && !pulsed.current) {
      pulsed.current = true;
      baseExposure.current = gl.toneMappingExposure;
      gl.toneMappingExposure = baseExposure.current + 0.08;
    } else if (pulsed.current) {
      gl.toneMappingExposure += (baseExposure.current - gl.toneMappingExposure) * 0.04;
    }
  });

  return null;
}

export default function TrailEntryAmbience() {
  const {
    scrollProgress,
    timeOfDay,
    reducedMotion,
    entryCinematicActive,
    entryCinematicDone,
    entryCinematicElapsed,
    entryCinematicPhase,
    invalidate,
  } = useUniverse();

  const leftLantern = useRef<THREE.PointLight>(null);
  const rightLantern = useRef<THREE.PointLight>(null);
  const petalGroup = useRef<THREE.Group>(null);
  const pathTrailHold = useRef(0);
  const glimmerRefs = useRef<(THREE.Mesh | null)[]>([]);

  const pathWaveGeo = useMemo(() => buildPathWaveGeometry(), []);
  const pathWaveMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        side: THREE.DoubleSide,
        uniforms: {
          uWaveFront: { value: 0 },
          uOpacity: { value: 0 },
          uTrail: { value: 0 },
          uColor: { value: new THREE.Color("#F8B8C8") },
          uColorTrail: { value: new THREE.Color("#F5D0DC") },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uWaveFront;
          uniform float uOpacity;
          uniform float uTrail;
          uniform vec3 uColor;
          uniform vec3 uColorTrail;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise1d(float x) {
            float i = floor(x);
            float f = fract(x);
            float a = hash(vec2(i, 0.0));
            float b = hash(vec2(i + 1.0, 0.0));
            return mix(a, b, f * f * (3.0 - 2.0 * f));
          }

          void main() {
            float along = vUv.x;
            float stagger = (noise1d(along * 13.0) - 0.5) * 0.24
              + (noise1d(along * 31.0 + 2.4) - 0.5) * 0.12;
            float localT = uWaveFront - along - stagger;

            float bloom = smoothstep(0.0, 0.14, localT)
              * (1.0 - smoothstep(0.14, 0.32, localT));
            float persist = smoothstep(0.02, 0.22, localT) * uTrail;

            float cluster = noise1d(along * 19.0 + vUv.y * 6.0);
            float petalMask = smoothstep(0.38, 0.72, cluster);
            float widthWobble = 0.28 + noise1d(along * 8.0 + 1.7) * 0.42;
            float edge = smoothstep(0.0, widthWobble, vUv.y)
              * (1.0 - smoothstep(1.0 - widthWobble, 1.0, vUv.y));

            float sparkle = noise1d(along * 47.0 + vUv.y * 13.0);
            float speck = step(0.62, sparkle) * bloom;

            float glow = (bloom * (0.45 + petalMask * 0.55) + persist * 0.7 + speck * 0.35) * edge;
            vec3 col = mix(uColorTrail, uColor, bloom + speck * 0.5);
            gl_FragColor = vec4(col, uOpacity * glow);
          }
        `,
      }),
    [],
  );

  const palette = getRwWonderland(timeOfDay.current);
  const night = timeOfDay.current === "night";

  useFrame((_, delta) => {
    decayRevealBoosts(delta);

    const phase = entryCinematicPhase.current;
    const cinematic = entryCinematicActive.current && !entryCinematicDone.current;
    const elapsed = entryCinematicElapsed.current;
    const done = entryCinematicDone.current;
    const reduced = reducedMotion.current;

    const pathRevealing = cinematic && (phase === "through" || phase === "inside");

    if (pathRevealing) {
      const sample = sampleEntryCinematicCamera(elapsed, reduced);
      const reveal = pathRevealT(sample.position.z);
      pathWaveMaterial.uniforms.uWaveFront.value = reveal;
      pathWaveMaterial.uniforms.uOpacity.value = 0.38 + reveal * 0.28;
      pathWaveMaterial.uniforms.uTrail.value = Math.min(0.55, reveal * 0.65 + 0.12);
      pathTrailHold.current = pathWaveMaterial.uniforms.uTrail.value as number;
    } else if (phase === "caption" && cinematic) {
      pathWaveMaterial.uniforms.uWaveFront.value = 1;
      pathWaveMaterial.uniforms.uOpacity.value = Math.max(
        0,
        (pathWaveMaterial.uniforms.uOpacity.value as number) - delta * 0.22,
      );
      pathWaveMaterial.uniforms.uTrail.value = Math.max(
        0,
        pathTrailHold.current - delta * 0.18,
      );
    } else if (done && scrollProgress.current < 0.08) {
      pathWaveMaterial.uniforms.uWaveFront.value = 1;
      pathWaveMaterial.uniforms.uOpacity.value = 0.14;
      pathWaveMaterial.uniforms.uTrail.value = 0.22;
    } else {
      pathWaveMaterial.uniforms.uOpacity.value = Math.max(
        0,
        pathWaveMaterial.uniforms.uOpacity.value - delta * 0.45,
      );
      pathWaveMaterial.uniforms.uTrail.value = Math.max(
        0,
        pathWaveMaterial.uniforms.uTrail.value - delta * 0.35,
      );
    }

    const pal = getRwWonderland(timeOfDay.current);
    pathWaveMaterial.uniforms.uColor.value.set(pal.pathGlowBright);
    pathWaveMaterial.uniforms.uColorTrail.value.set(pal.pathGlow);

    const waveFront = pathWaveMaterial.uniforms.uWaveFront.value as number;
    const waveOpacity = pathWaveMaterial.uniforms.uOpacity.value as number;
    const waveTrail = pathWaveMaterial.uniforms.uTrail.value as number;

    PATH_GLIMMERS.forEach((glimmer, i) => {
      const mesh = glimmerRefs.current[i];
      if (!mesh) return;
      const localT = waveFront - glimmer.along - glimmer.stagger;
      const bloom = THREE.MathUtils.clamp(localT / 0.16, 0, 1);
      const persist = THREE.MathUtils.clamp((localT - 0.05) / 0.2, 0, 1) * waveTrail;
      const lit = Math.max(bloom * (1 - bloom) * 4, persist * 0.65);
      const on = lit > 0.04 && waveOpacity > 0.02;
      mesh.visible = on;
      if (!on) return;
      mesh.scale.setScalar(glimmer.scale * (0.35 + lit * 0.85));
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.min(0.85, waveOpacity * lit * 0.95);
      mat.color.set(pal.pathGlowBright);
    });

    const lanternBase =
      cinematic && (phase === "framing" || phase === "approach")
        ? Math.min(1, elapsed / 0.5) * 0.22
        : done
          ? 0.24 + Math.sin(elapsed * 0.38) * 0.08
          : cinematic
            ? 0.18
            : 0.12;

    const isNight = timeOfDay.current === "night";
    const lanternIntensity = isNight ? lanternBase * 1.4 : lanternBase;
    if (leftLantern.current) {
      leftLantern.current.intensity = lanternIntensity;
      leftLantern.current.color.set(isNight ? pal.campfire : pal.pathGlowBright);
    }
    if (rightLantern.current) {
      rightLantern.current.intensity = lanternIntensity;
      rightLantern.current.color.set(isNight ? pal.campfire : pal.pathGlowBright);
    }

    if (petalGroup.current) {
      petalGroup.current.visible = done && !reducedMotion.current;
    }

    const hero = done && scrollProgress.current < 0.1;
    if ((cinematic || hero || pathRevealing) && !reduced) invalidate.current();
  });

  return (
    <group>
      <mesh geometry={pathWaveGeo} material={pathWaveMaterial} renderOrder={3} />

      {PATH_GLIMMERS.map((glimmer, i) => (
        <mesh
          key={`path-glimmer-${i}`}
          ref={(node) => {
            glimmerRefs.current[i] = node;
          }}
          position={glimmer.position}
          rotation={[-Math.PI / 2, 0, hash1D(i * 5.7) * Math.PI * 2]}
          visible={false}
          renderOrder={4}
        >
          <primitive object={glimmerGeo} attach="geometry" />
          <meshBasicMaterial
            color={palette.pathGlowBright}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <TrailDoorArchLights />

      {LANTERN_POSITIONS.map((pos, i) => (
        <pointLight
          key={`lantern-${i}`}
          ref={i === 0 ? leftLantern : rightLantern}
          position={pos}
          color={night ? palette.campfire : palette.pathGlowBright}
          intensity={0.12}
          distance={9}
          decay={2}
        />
      ))}

      {!reducedMotion.current && (
        <group ref={petalGroup} visible={false}>
          {ENTRY_PETALS.map((spec, i) => (
            <EntryPetal key={`entry-petal-${i}`} {...spec} />
          ))}
        </group>
      )}
    </group>
  );
}
