import { Suspense, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWEntryPavilion from "../research-world/RWEntryPavilion";
import RWLoopCenter from "../research-world/RWLoopCenter";
import {
  RWObservatoryPlatform,
  RWPathStones,
  RWSignalsGardenBeds,
  RWSupportSanctuary,
} from "../research-world/RWZoneAssets";
import {
  DISC_CENTER,
  DISC_RADIUS,
  LANDMARKS,
} from "../research-world/rwWorldConfig";
import TrailGroundScatter from "./TrailGroundScatter";
import TrailLandmarkEffects from "./TrailLandmarkEffects";
import TrailNarrativePaths from "./TrailNarrativePaths";
import TrailPetalField from "./TrailPetalField";
import TrailProjectsFinale from "./TrailProjectsFinale";
import TrailTwilightSky from "./TrailTwilightSky";
import { TRAIL_CURVE } from "./worldTrailConfig";

/** Match TrailTwilightSky horizon so ground ↔ sky reads as one warm bowl. */
const SKY_HORIZON = rwWonderland.skyHorizon;
const GROUND_CENTER_Z = -10;
/** Circle replaces the old 52×52 square — removes hard corner cuts at entry. */
const GROUND_RADIUS = 37;
const GROUND_BLEND_INNER = GROUND_RADIUS * 0.78;
const GROUND_BLEND_OUTER = GROUND_RADIUS * 1.08;
/** Radius of the ring that threads the three tripod vertices. */
const LAND_RING_WIDTH = 0.24;

function landmarkTriangleRibbon() {
  const verts = LANDMARKS.filter((l) => l.id !== "loop").map(
    (l) => new THREE.Vector3(l.position[0], 0, l.position[2]),
  );
  verts.push(verts[0].clone());
  const curve = new THREE.CatmullRomCurve3(verts, true);
  const points = curve.getSpacedPoints(72);
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const tangent =
      i < points.length - 1
        ? new THREE.Vector3().subVectors(points[i + 1], p).normalize()
        : new THREE.Vector3().subVectors(p, points[i - 1]).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(LAND_RING_WIDTH / 2);
    const left = p.clone().add(side);
    const right = p.clone().sub(side);
    positions.push(left.x, 0.045, left.z, right.x, 0.045, right.z);
    if (i < points.length - 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function TrailGround() {
  const landTex = useTexture(researchWorldAssets.land);
  landTex.wrapS = landTex.wrapT = THREE.RepeatWrapping;
  landTex.repeat.set(5, 5);

  const horizonBlendMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        innerColor: { value: new THREE.Color(rwWonderland.ground) },
        outerColor: { value: new THREE.Color(SKY_HORIZON) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;
        void main() {
          float t = smoothstep(0.0, 1.0, vUv.x);
          t = t * t * (3.0 - 2.0 * t);
          vec3 col = mix(innerColor, outerColor, t);
          float alpha = mix(0.98, 0.0, smoothstep(0.35, 1.0, t));
          gl_FragColor = vec4(col, alpha);
        }
      `,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <group position={[0, 0, GROUND_CENTER_Z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[GROUND_BLEND_INNER, 80]} />
        <meshStandardMaterial color={rwWonderland.ground} roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[GROUND_BLEND_INNER, 80]} />
        <meshBasicMaterial map={landTex} transparent opacity={0.12} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.018, 0]}
        material={horizonBlendMat}
        renderOrder={-1}
      >
        <ringGeometry args={[GROUND_BLEND_INNER, GROUND_BLEND_OUTER, 80, 1]} />
      </mesh>
    </group>
  );
}

function TrailPath() {
  const geometry = useMemo(() => {
    const points = TRAIL_CURVE.getSpacedPoints(80);
    const positions: number[] = [];
    const indices: number[] = [];
    const width = 0.7;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tangent =
        i < points.length - 1
          ? new THREE.Vector3().subVectors(points[i + 1], p).normalize()
          : new THREE.Vector3().subVectors(p, points[i - 1]).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2);
      const left = p.clone().add(side);
      const right = p.clone().sub(side);
      positions.push(left.x, 0.06, left.z, right.x, 0.06, right.z);
      if (i < points.length - 1) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={rwWonderland.pathRibbon}
        emissive={rwWonderland.pathGlow}
        emissiveIntensity={0.35}
        roughness={0.4}
      />
    </mesh>
  );
}

/** The tripod plaza floor: a big rose-stone disc, a rim glow, a ring threading
 * the three vertices, and spokes running from the glowing centre out to each. */
function TrailDiscPlaza() {
  const spokes = useMemo(() => {
    const [cx, , cz] = DISC_CENTER;
    return LANDMARKS.filter((l) => l.id !== "loop").map((l) => {
      const dx = l.position[0] - cx;
      const dz = l.position[2] - cz;
      return {
        angle: Math.atan2(dx, dz),
        len: Math.hypot(dx, dz),
        mx: cx + dx / 2,
        mz: cz + dz / 2,
      };
    });
  }, []);
  const triangleGeo = useMemo(() => landmarkTriangleRibbon(), []);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[DISC_CENTER[0], 0.015, DISC_CENTER[2]]}
        receiveShadow
      >
        <circleGeometry args={[DISC_RADIUS, 64]} />
        <meshStandardMaterial
          color="#F0E8E4"
          roughness={0.5}
          metalness={0.05}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[DISC_CENTER[0], 0.035, DISC_CENTER[2]]}
      >
        <ringGeometry args={[DISC_RADIUS - 0.28, DISC_RADIUS, 64]} />
        <meshBasicMaterial
          color={rwWonderland.pathGlowBright}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={triangleGeo}>
        <meshStandardMaterial
          color={rwWonderland.pathRibbon}
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.18}
          roughness={0.4}
          transparent
          opacity={0.55}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {spokes.map((s, i) => (
        <mesh key={i} position={[s.mx, 0.05, s.mz]} rotation={[0, s.angle, 0]}>
          <boxGeometry args={[0.34, 0.04, s.len]} />
          <meshStandardMaterial
            color={rwWonderland.pathRibbon}
            emissive={rwWonderland.pathGlow}
            emissiveIntensity={0.28}
            roughness={0.4}
          />
        </mesh>
      ))}
      <pointLight
        position={[DISC_CENTER[0], 2.5, DISC_CENTER[2]]}
        intensity={0.35}
        color="#FFE8EE"
        distance={16}
      />
    </group>
  );
}

export default function ResearchWorldTrailScene() {
  return (
    <Suspense fallback={null}>
      <TrailTwilightSky />
      <TrailGround />
      <TrailDiscPlaza />
      <TrailGroundScatter />
      <TrailNarrativePaths />
      <TrailPath />
      <TrailPetalField />
      <TrailLandmarkEffects />
      <RWEntryPavilion />
      <RWSignalsGardenBeds />
      <RWObservatoryPlatform />
      <RWSupportSanctuary />
      <RWPathStones />
      <RWLoopCenter trailMode />
      <TrailProjectsFinale />
    </Suspense>
  );
}

useGLTF.preload(researchWorldAssets.gardenDoor, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.entryLanternTower, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.designLandmarks.signalsGarden, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.designLandmarks.statesObservatory, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.designLandmarks.supportSanctuary, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.designLandmarks.closedLoop, "/draco/gltf/");
useGLTF.preload(researchWorldAssets.pathStone);
