import { palette } from "../../theme/palette";

/** Shared SVG gradient defs for botanical illustrations. */
export default function BotanicalDefs({ prefix = "" }: { prefix?: string }) {
  const p = prefix;
  return (
    <defs>
      <linearGradient id={`${p}vineStroke`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={palette.sage} stopOpacity="0.55" />
        <stop offset="100%" stopColor={palette.line} stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id={`${p}rosePetalFill`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={palette.roseSoft} />
        <stop offset="55%" stopColor={palette.primary} />
        <stop offset="100%" stopColor={palette.primaryDeep} stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={`${p}rosePetalInner`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8C4BE" />
        <stop offset="100%" stopColor={palette.primary} />
      </linearGradient>
    </defs>
  );
}
