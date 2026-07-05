import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WATER_NAME = /water|fall|stream|pond|fountain|ripple|splash|mist|cascade|drip/i;

function isWaterfallMesh(mesh: THREE.Mesh): boolean {
  const name = (mesh.name || "").toLowerCase();
  if (WATER_NAME.test(name)) return true;

  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) return false;

  const sx = box.max.x - box.min.x;
  const sy = box.max.y - box.min.y;
  const sz = box.max.z - box.min.z;
  const dims = [sx, sy, sz].sort((a, b) => b - a);
  const isThinSheet = dims[1] / Math.max(dims[0], 0.001) < 0.28;

  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const mat of mats) {
    if (!mat || !("color" in mat)) continue;
    const c = (mat as THREE.MeshStandardMaterial).color;
    if (!c) continue;
    const { r, g, b } = c;
    const isPaleWater =
      (b > 0.42 && b >= r && g > r * 0.75) ||
      (r > 0.7 && g > 0.75 && b > 0.78);
    if (isThinSheet && isPaleWater && dims[0] < 10) return true;
  }

  return isThinSheet && sy > 0.4 && dims[0] < 6;
}

const flowVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vRipple;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float ripple = sin(pos.y * 7.0 + uTime * 2.8) * 0.018;
    ripple += sin(pos.y * 11.0 - uTime * 3.6 + pos.x * 4.0) * 0.01;
    pos.x += ripple;
    pos.z += cos(pos.y * 6.0 + uTime * 2.2) * 0.012;
    vRipple = ripple;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const flowFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vRipple;

  float streak(vec2 uv, float speed, float freq, float phase) {
    return sin(uv.y * freq - uTime * speed + sin(uv.x * 10.0 + phase) * 0.6) * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float edge = smoothstep(0.0, 0.22, uv.x) * smoothstep(1.0, 0.78, uv.x);

    float s1 = streak(uv, 3.8, 22.0, 0.0);
    float s2 = streak(uv, 3.0, 16.0, 1.7);
    float s3 = streak(uv, 4.6, 28.0, 3.1);
    float flow = s1 * 0.45 + s2 * 0.35 + s3 * 0.2;

    float sparkle = pow(max(0.0, sin(uv.y * 34.0 - uTime * 6.0 + uv.x * 20.0)), 10.0);
    float foam = smoothstep(0.72, 0.98, uv.y);
    float tailFade = smoothstep(0.0, 0.12, uv.y);

    vec3 deep = vec3(0.88, 0.94, 0.97);
    vec3 bright = vec3(0.98, 0.99, 1.0);
    vec3 col = mix(deep, bright, flow * 0.4 + sparkle * 0.55 + foam * 0.35);
    col += vec3(0.04, 0.05, 0.06) * abs(vRipple) * 12.0;

    float alpha = edge * tailFade * (0.18 + flow * 0.32 + foam * 0.22 + sparkle * 0.15);
    alpha = clamp(alpha, 0.0, 0.62);

    gl_FragColor = vec4(col, alpha);
  }
`;

export function createFlowWaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: flowVertexShader,
    fragmentShader: flowFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: false,
  });
}

/** Animate pale-blue regions baked into a single-mesh GLB (sky-castle).
 *  NOTE: varying must be declared before main() — do not inject mid-shader. */
export function applyCastleWaterFlowShader(
  root: THREE.Object3D,
): THREE.IUniform<number>[] {
  const timeUniforms: THREE.IUniform<number>[] = [];

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    for (const raw of materials) {
      if (!(raw instanceof THREE.MeshStandardMaterial)) continue;
      const mat = raw;
      const uTime: THREE.IUniform<number> = { value: 0 };
      timeUniforms.push(uTime);

      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uFlowTime = uTime;
        shader.vertexShader = shader.vertexShader.replace(
          "void main() {",
          "varying vec2 vCastleFlowUv;\nvoid main() {",
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <uv_vertex>",
          "#include <uv_vertex>\nvCastleFlowUv = vMapUv;",
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "void main() {",
          "uniform float uFlowTime;\nvarying vec2 vCastleFlowUv;\nvoid main() {",
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          `
          float flowMask = smoothstep(0.04, 0.2, diffuseColor.b - diffuseColor.r);
          flowMask *= smoothstep(0.32, 0.68, diffuseColor.b);
          flowMask *= smoothstep(0.45, 0.82, diffuseColor.g);
          if (flowMask > 0.025) {
            float streak = sin(vCastleFlowUv.y * 34.0 - uFlowTime * 4.8
              + sin(vCastleFlowUv.x * 16.0) * 0.8) * 0.5 + 0.5;
            float streak2 = sin(vCastleFlowUv.y * 24.0 - uFlowTime * 3.4
              + vCastleFlowUv.x * 28.0) * 0.5 + 0.5;
            float flow = streak * 0.55 + streak2 * 0.45;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.97, 0.99), flow * flowMask * 0.58);
            diffuseColor.rgb += vec3(0.09, 0.11, 0.13) * pow(flow, 2.2) * flowMask * 0.32;
          }
          #include <dithering_fragment>
          `,
        );
      };
      mat.customProgramCacheKey = () => "castle-water-flow-v2";
      mat.needsUpdate = true;
    }
  });

  return timeUniforms;
}

/** Replace separate GLB waterfall planes (multi-mesh exports) with flow shaders. */
export function enhanceGlbWaterMeshes(root: THREE.Object3D): THREE.ShaderMaterial[] {
  const materials: THREE.ShaderMaterial[] = [];
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !isWaterfallMesh(mesh)) return;
    const mat = createFlowWaterMaterial();
    mesh.material = mat;
    mesh.renderOrder = 12;
    materials.push(mat);
  });
  return materials;
}

type FallSpot = {
  pos: [number, number, number];
  size: [number, number];
  rotY: number;
};

/** Procedural vertical falls under the sky-city — reads as flowing water, not flat sheets. */
const SKY_CITY_FALLS: FallSpot[] = [
  { pos: [-0.85, -0.35, 0.35], size: [0.22, 1.65], rotY: 0.15 },
  { pos: [-0.25, -0.55, 0.55], size: [0.18, 1.9], rotY: -0.08 },
  { pos: [0.35, -0.45, 0.25], size: [0.22, 1.75], rotY: 0.22 },
  { pos: [0.78, -0.3, -0.05], size: [0.2, 1.5], rotY: -0.18 },
  { pos: [-0.45, -0.25, -0.35], size: [0.17, 1.4], rotY: 0.35 },
  { pos: [0.05, -0.65, -0.15], size: [0.24, 2.0], rotY: 0.05 },
];

export function SkyCityWaterfallSheets() {
  const materials = useMemo(
    () => SKY_CITY_FALLS.map(() => createFlowWaterMaterial()),
    [],
  );

  return (
    <>
      <FlowingWaterDriver materials={materials} />
      {SKY_CITY_FALLS.map((fall, i) => (
        <mesh
          key={i}
          position={fall.pos}
          rotation={[0, fall.rotY, 0]}
          renderOrder={14}
          material={materials[i]}
        >
          <planeGeometry args={fall.size} />
        </mesh>
      ))}
    </>
  );
}

type FlowDriverProps = {
  materials?: THREE.ShaderMaterial[];
  uniforms?: THREE.IUniform<number>[];
};

/** Drives flow animation on shader materials and/or injected GLB uniforms. */
export function FlowingWaterDriver({
  materials = [],
  uniforms = [],
}: FlowDriverProps) {
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mat of materials) {
      mat.uniforms.uTime.value = t;
    }
    for (const u of uniforms) {
      u.value = t;
    }
  });
  return null;
}
