// mulberry32 — a tiny seeded PRNG so the reducer stays pure and tests are reproducible.
export interface Rng {
  next(): number; // [0, 1)
  int(min: number, max: number): number; // inclusive
  state(): number;
}

export function createRng(seed: number): Rng {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    state: () => s,
  };
}

export function newSeed(): number {
  return (Math.random() * 2 ** 32) >>> 0;
}
