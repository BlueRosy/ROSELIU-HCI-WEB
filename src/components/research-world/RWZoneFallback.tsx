import { palette } from "../../theme/palette";

type ZoneId = "entry" | "signals" | "states" | "support" | "loop";

const ZONE_GRADIENTS: Record<ZoneId, string> = {
  entry: `radial-gradient(ellipse 80% 60% at 50% 40%, ${palette.roseSoft}33, transparent 70%), linear-gradient(180deg, ${palette.bg} 0%, ${palette.section} 100%)`,
  signals: `radial-gradient(ellipse 70% 50% at 30% 50%, ${palette.sage}22, transparent 65%), linear-gradient(180deg, ${palette.bg} 0%, ${palette.cream} 100%)`,
  states: `radial-gradient(ellipse 60% 55% at 60% 45%, ${palette.primary}28, transparent 70%), linear-gradient(180deg, ${palette.section} 0%, ${palette.bg} 100%)`,
  support: `radial-gradient(ellipse 65% 50% at 50% 55%, ${palette.roseSoft}30, transparent 68%), linear-gradient(180deg, ${palette.bg} 0%, ${palette.section} 100%)`,
  loop: `radial-gradient(ellipse 75% 60% at 50% 50%, ${palette.sage}25, transparent 72%), linear-gradient(180deg, ${palette.cream} 0%, ${palette.bg} 100%)`,
};

export default function RWZoneFallback({ zoneId }: { zoneId: ZoneId }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: ZONE_GRADIENTS[zoneId] }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-40">
        {zoneId === "entry" && <EntryFallbackArt />}
        {zoneId === "signals" && <SignalsFallbackArt />}
        {zoneId === "states" && <StatesFallbackArt />}
        {zoneId === "support" && <SupportFallbackArt />}
        {zoneId === "loop" && <LoopFallbackArt />}
      </div>
    </div>
  );
}

function EntryFallbackArt() {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rw-entry-path" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={palette.primaryDeep} stopOpacity="0.2" />
          <stop offset="1" stopColor={palette.sage} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[120, 280, 440].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={80 + i * 20}
          width={140}
          height={320}
          rx={8}
          fill="white"
          fillOpacity={0.12}
          stroke={palette.primary}
          strokeOpacity={0.25}
          transform={`skewX(-6) rotate(${-4 + i * 2} ${x + 70} ${240})`}
        />
      ))}
      <path
        d="M 120 520 Q 400 380 680 120"
        fill="none"
        stroke="url(#rw-entry-path)"
        strokeWidth="3"
        strokeDasharray="8 12"
      />
      <ellipse cx={400} cy={500} rx={12} ry={28} fill={palette.ink} fillOpacity={0.15} />
    </svg>
  );
}

function SignalsFallbackArt() {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={80 + (i % 6) * 120 + (i % 3) * 8}
          cy={100 + Math.floor(i / 6) * 110}
          r={4 + (i % 3)}
          fill={palette.primaryDeep}
          fillOpacity={0.15 + (i % 5) * 0.04}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={180 + i * 160}
          y={200 + i * 30}
          width={100}
          height={60}
          rx={6}
          fill="white"
          fillOpacity={0.2}
          stroke={palette.sage}
          strokeOpacity={0.3}
        />
      ))}
    </svg>
  );
}

function StatesFallbackArt() {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={400}
          cy={280}
          r={60 + i * 45}
          fill="none"
          stroke={palette.primary}
          strokeOpacity={0.12 + i * 0.06}
          strokeWidth="2"
        />
      ))}
      <circle cx={400} cy={280} r={28} fill={palette.primaryDeep} fillOpacity={0.2} />
    </svg>
  );
}

function SupportFallbackArt() {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle
        cx={400}
        cy={300}
        r={160}
        fill="none"
        stroke={palette.sage}
        strokeOpacity={0.35}
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={300 + i * 50}
          y={220 + i * 40}
          width={80}
          height={50}
          rx={6}
          fill="white"
          fillOpacity={0.18}
          stroke={palette.roseSoft}
          strokeOpacity={0.4}
        />
      ))}
    </svg>
  );
}

function LoopFallbackArt() {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle
        cx={400}
        cy={300}
        r={140}
        fill="none"
        stroke={palette.primary}
        strokeOpacity={0.3}
        strokeWidth="2"
        strokeDasharray="4 8"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = 400 + Math.cos(angle) * 140;
        const y = 300 + Math.sin(angle) * 140;
        return <circle key={i} cx={x} cy={y} r={10} fill={palette.sage} fillOpacity={0.5} />;
      })}
    </svg>
  );
}
