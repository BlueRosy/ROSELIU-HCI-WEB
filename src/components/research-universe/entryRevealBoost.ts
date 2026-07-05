export type EntryRevealBoost = {
  signals: number;
  states: number;
  support: number;
  loop: number;
  projects: number;
};

export const entryRevealBoost: { current: EntryRevealBoost } = {
  current: { signals: 0, states: 0, support: 0, loop: 0, projects: 0 },
};

export function pulseRevealBoost(zone: keyof EntryRevealBoost, peak = 0.18) {
  entryRevealBoost.current[zone] = peak;
}

export function decayRevealBoosts(delta: number, rate = 1.4) {
  const b = entryRevealBoost.current;
  b.signals = Math.max(0, b.signals - delta * rate);
  b.states = Math.max(0, b.states - delta * rate);
  b.support = Math.max(0, b.support - delta * rate);
  b.loop = Math.max(0, b.loop - delta * rate);
  b.projects = Math.max(0, b.projects - delta * rate);
}
