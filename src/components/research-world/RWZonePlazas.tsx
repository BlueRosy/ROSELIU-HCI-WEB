import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { ZONE_PLAZAS, type ZonePlaza } from "./rwWorldConfig";

const ZONE_PLAZA_TEXTURES: Partial<Record<ZonePlaza["zoneId"], string>> = {
  signals: researchWorldAssets.zonePlazas.signals,
  states: researchWorldAssets.zonePlazas.states,
  support: researchWorldAssets.zonePlazas.support,
};

function PlazaParticles({
  position,
  radius,
  color,
  count = 24,
  zoneId,
  activeZoneRef,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  count?: number;
  zoneId?: string;
  activeZoneRef?: MutableRefObject<string>;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius * (0.4 + Math.random() * 0.5);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.3 + Math.random() * 1.2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (!points.current) return;
    const trailMode = Boolean(activeZoneRef && zoneId);
    const active = !trailMode || activeZoneRef!.current === zoneId;

    if (mat.current) {
      mat.current.opacity = active ? 0.55 : 0.22;
    }

    if (!active) return;

    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.003;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color={color}
        size={0.05}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function PlazaLabelAndParticles({
  plaza,
  hideLabels,
  activeZoneRef,
}: {
  plaza: ZonePlaza;
  hideLabels?: boolean;
  activeZoneRef?: MutableRefObject<string>;
}) {
  const hasTexture = Boolean(ZONE_PLAZA_TEXTURES[plaza.zoneId]);
  const trailMode = Boolean(activeZoneRef);
  return (
    <>
      {!hideLabels && (
        <Text
          position={[0, 0.5, -plaza.radius + 0.6]}
          fontSize={0.2}
          color={rwWonderland.text}
          anchorX="center"
          anchorY="middle"
        >
          {plaza.label}
        </Text>
      )}
      <PlazaParticles
        position={[0, 0, 0]}
        radius={plaza.radius}
        color={plaza.particleColor}
        count={
          plaza.zoneId === "loop" ? 36 : hasTexture ? (trailMode ? 12 : 12) : 20
        }
        zoneId={plaza.zoneId}
        activeZoneRef={activeZoneRef}
      />
    </>
  );
}

function SolidPlazaDisc({
  plaza,
  hideLabels,
  hideDiscs,
  activeZoneRef,
}: {
  plaza: ZonePlaza;
  hideLabels?: boolean;
  hideDiscs?: boolean;
  activeZoneRef?: MutableRefObject<string>;
}) {
  const discMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const boost = useRef(0);

  useFrame(() => {
    if (!discMat.current) return;
    if (activeZoneRef) {
      const target = activeZoneRef.current === plaza.zoneId ? 1 : 0;
      boost.current += (target - boost.current) * 0.08;
      discMat.current.emissiveIntensity = 0.12 + boost.current * 0.28;
    }
  });

  return (
    <group position={plaza.position}>
      {!hideDiscs && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[plaza.radius, 48]} />
            <meshPhysicalMaterial
              ref={discMat}
              color={plaza.color}
              emissive={plaza.emissive}
              emissiveIntensity={0.12}
              roughness={0.35}
              metalness={0.05}
              transparent
              opacity={0.72}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
            <ringGeometry args={[plaza.radius - 0.05, plaza.radius, 64]} />
            <meshBasicMaterial
              color={rwWonderland.panelBorder}
              transparent
              opacity={0.35}
            />
          </mesh>
        </>
      )}
      <PlazaLabelAndParticles
        plaza={plaza}
        hideLabels={hideLabels}
        activeZoneRef={activeZoneRef}
      />
    </group>
  );
}

function TexturedPlazaDisc({
  plaza,
  texturePath,
  hideLabels,
  hideDiscs,
  activeZoneRef,
}: {
  plaza: ZonePlaza;
  texturePath: string;
  hideLabels?: boolean;
  hideDiscs?: boolean;
  activeZoneRef?: MutableRefObject<string>;
}) {
  const map = useTexture(texturePath);
  const discMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const boost = useRef(0);

  useMemo(() => {
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
  }, [map]);

  useFrame(() => {
    if (!discMat.current) return;
    if (activeZoneRef) {
      const target = activeZoneRef.current === plaza.zoneId ? 1 : 0;
      boost.current += (target - boost.current) * 0.08;
      discMat.current.emissiveIntensity = 0.08 + boost.current * 0.22;
    }
  });

  return (
    <group position={plaza.position}>
      {!hideDiscs && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[plaza.radius, 64]} />
            <meshPhysicalMaterial
              ref={discMat}
              map={map}
              color="#ffffff"
              emissive={plaza.emissive}
              emissiveIntensity={0.08}
              roughness={0.45}
              metalness={0.03}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
            <ringGeometry args={[plaza.radius - 0.06, plaza.radius, 64]} />
            <meshBasicMaterial
              color={rwWonderland.panelBorder}
              transparent
              opacity={0.28}
            />
          </mesh>
        </>
      )}
      <PlazaLabelAndParticles
        plaza={plaza}
        hideLabels={hideLabels}
        activeZoneRef={activeZoneRef}
      />
    </group>
  );
}

function PlazaDisc({
  plaza,
  hideLabels,
  hideDiscs,
  activeZoneRef,
}: {
  plaza: ZonePlaza;
  hideLabels?: boolean;
  hideDiscs?: boolean;
  activeZoneRef?: MutableRefObject<string>;
}) {
  const texturePath = ZONE_PLAZA_TEXTURES[plaza.zoneId];
  if (texturePath) {
    return (
      <TexturedPlazaDisc
        plaza={plaza}
        texturePath={texturePath}
        hideLabels={hideLabels}
        hideDiscs={hideDiscs}
        activeZoneRef={activeZoneRef}
      />
    );
  }
  return (
    <SolidPlazaDisc
      plaza={plaza}
      hideLabels={hideLabels}
      hideDiscs={hideDiscs}
      activeZoneRef={activeZoneRef}
    />
  );
}

type RWZonePlazasProps = {
  trailMode?: boolean;
  activeZoneRef?: MutableRefObject<string>;
  hideLabels?: boolean;
  hideDiscs?: boolean;
};

export default function RWZonePlazas({
  trailMode = false,
  activeZoneRef,
  hideLabels = false,
  hideDiscs = false,
}: RWZonePlazasProps) {
  const zoneRef = trailMode ? activeZoneRef : undefined;

  return (
    <group>
      {ZONE_PLAZAS.map((plaza) => (
        <PlazaDisc
          key={plaza.zoneId}
          plaza={plaza}
          hideLabels={hideLabels || trailMode}
          hideDiscs={hideDiscs}
          activeZoneRef={zoneRef}
        />
      ))}
    </group>
  );
}
