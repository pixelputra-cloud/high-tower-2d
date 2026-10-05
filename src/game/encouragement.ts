import type { Rng } from './rng';

export const STREAK_MESSAGES = [
  "Bravo!",
  "You're on a streak!",
  "Three in a row!",
  "Brilliant!",
  "On fire!",
  "Keep it up!",
  "Superb!",
  "Unstoppable!",
  "Nailed it!",
  "Tower's climbing!",
];

export const HIGH_ENERGY_MESSAGES = ['On fire!', 'Unstoppable!', 'Brilliant!'];

/**
 * Picks a banner for a streak that just hit a multiple of 3.
 * `message` is what to show; `base` is the pool entry, used to avoid back-to-back repeats.
 */
export function pickStreakMessage(
  streak: number,
  lastBase: string | null,
  rng: Rng,
): { message: string; base: string } {
  const pool = (streak >= 6 ? HIGH_ENERGY_MESSAGES : STREAK_MESSAGES).filter((m) => m !== lastBase);
  const base = pool[rng.int(0, pool.length - 1)];
  return { base, message: streak >= 6 ? `${base} ${streak} in a row` : base };
}
