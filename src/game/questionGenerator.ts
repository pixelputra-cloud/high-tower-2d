import type { Rng } from './rng';
import type { Question, Symbol } from './types';

export function rangeFor(questionIndex: number): [number, number] {
  if (questionIndex <= 3) return [0, 9];
  if (questionIndex <= 6) return [10, 99];
  return [100, 999];
}

export function compare(left: number, right: number): Symbol {
  return left < right ? '<' : left > right ? '>' : '=';
}

/** A shuffled bag holding each relation twice, so every 6 questions are an exact ⅓ split. */
export function refillBag(rng: Rng): Symbol[] {
  const bag: Symbol[] = ['<', '<', '=', '=', '>', '>'];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

function pairFor(relation: Symbol, [min, max]: [number, number], rng: Rng): [number, number] {
  if (relation === '=') {
    const n = rng.int(min, max);
    return [n, n];
  }
  const small = rng.int(min, max - 1);
  const big = rng.int(small + 1, max);
  return relation === '<' ? [small, big] : [big, small];
}

export function generateQuestion(
  questionIndex: number,
  relation: Symbol,
  previous: Question | null,
  rng: Rng,
): Question {
  const range = rangeFor(questionIndex);
  let left: number;
  let right: number;
  do {
    [left, right] = pairFor(relation, range, rng);
  } while (previous && previous.left === left && previous.right === right);
  return { left, right, correctSymbol: relation };
}

/** Numbers are zero-padded to 2 digits (`06`); 3-digit numbers render as-is. */
export function formatNumber(n: number): string {
  return String(n).padStart(2, '0');
}
