import { describe, expect, it } from 'vitest';
import { ANSWER_SLOT, CAMERA_LOCK_Y, FLOOR_H, GROUND_Y, TOP_FLOOR_H } from './constants';
import { STREAK_MESSAGES } from './encouragement';
import { cameraOffsetFor, createInitialState, floorY, gameReducer, points, towerTopY, type GameAction } from './gameMachine';
import type { GameState, Symbol } from './types';

const start = (seed = 42) => gameReducer(createInitialState(0, 1), { type: 'START_GAME', seed });

const answer = (s: GameState, correct: boolean): GameState => {
  const q = s.currentQuestion!;
  const wrong: Symbol = q.correctSymbol === '<' ? '>' : '<';
  const actions: GameAction[] = [
    { type: 'DRAG_START' },
    { type: 'DROP', symbol: correct ? q.correctSymbol : wrong },
    { type: 'NEXT_QUESTION' },
  ];
  return actions.reduce(gameReducer, s);
};

describe('question generation', () => {
  it('A6: digit count follows question index', () => {
    let s = start();
    for (let q = 1; q <= 20; q++) {
      const { left, right } = s.currentQuestion!;
      const [min, max] = q <= 3 ? [0, 9] : q <= 6 ? [10, 99] : [100, 999];
      for (const n of [left, right]) {
        expect(n).toBeGreaterThanOrEqual(min);
        expect(n).toBeLessThanOrEqual(max);
      }
      s = answer(s, true);
    }
  });

  it('A7: each relation is 25–42% of 60 questions, answers are correct, no back-to-back repeats', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      let s = start(seed);
      const counts = { '<': 0, '=': 0, '>': 0 };
      let prev: string | null = null;
      for (let i = 0; i < 60; i++) {
        const q = s.currentQuestion!;
        const actual = q.left < q.right ? '<' : q.left > q.right ? '>' : '=';
        expect(actual).toBe(q.correctSymbol);
        const key = `${q.left},${q.right}`;
        expect(key).not.toBe(prev);
        prev = key;
        counts[q.correctSymbol]++;
        s = answer(s, i % 2 === 0);
      }
      for (const c of Object.values(counts)) {
        expect(c / 60).toBeGreaterThanOrEqual(0.25);
        expect(c / 60).toBeLessThanOrEqual(0.42);
      }
    }
  });
});

describe('tower', () => {
  it('starts with only the roof resting on the ground', () => {
    const s = start();
    expect(s.floors).toHaveLength(0);
    // The roof's bottom edge sits exactly on the ground line.
    expect(towerTopY(0)).toBe(GROUND_Y - TOP_FLOOR_H);
  });

  it('A8: correct answers add floors on top with alternating art and their own labels', () => {
    let s = start();
    s = answer(s, true);
    s = answer(s, true);
    s = answer(s, true);
    expect(s.floors.map((f) => f.art)).toEqual([0, 1, 0]);
    expect(s.floors[2].left).toBe(s.attempts[2].left);
    expect(points(s)).toBe(15);
  });

  it('A10/A11: wrong destroys the bottom floor; at 0 floors it records a miss and continues', () => {
    let s = start();
    s = answer(s, true);
    s = answer(s, true);
    const [, second] = s.floors;
    s = answer(s, false);
    expect(s.floors).toEqual([second]);
    expect(floorY(0) - floorY(1)).toBe(FLOOR_H);
    s = answer(s, false);
    s = answer(s, false);
    expect(s.floors).toHaveLength(0);
    expect(s.resolution!.kind).toBe('wrongEmpty');
    expect(s.attempts.filter((a) => !a.correct)).toHaveLength(3);
    expect(points(s)).toBe(0);
    expect(s.phase).toBe('playing');
  });

  it('A12: camera locks once the roof would rise past the question row', () => {
    // Derived from the constants rather than hard-coded, so rescaling the tower art
    // changes which floor locks the camera without silently breaking this test.
    const firstLocked = [...Array(20).keys()].find((n) => cameraOffsetFor(n) > 0)!;
    expect(towerTopY(firstLocked - 1)).toBeGreaterThanOrEqual(CAMERA_LOCK_Y);
    expect(cameraOffsetFor(firstLocked - 1)).toBe(0);
    expect(towerTopY(firstLocked)).toBeLessThan(CAMERA_LOCK_Y);
    expect(cameraOffsetFor(firstLocked)).toBe(CAMERA_LOCK_Y - towerTopY(firstLocked));
    // Past the lock each floor shifts the camera by exactly one floor height.
    expect(cameraOffsetFor(10) - cameraOffsetFor(9)).toBe(FLOOR_H);
  });

  it('the tower builds up gradually: the camera holds for at least 4 answers', () => {
    expect(cameraOffsetFor(4)).toBe(0);
  });

  it('the parked roof clears the question blocks, so it is never hidden behind them', () => {
    expect(CAMERA_LOCK_Y).toBeGreaterThanOrEqual(ANSWER_SLOT.y + ANSWER_SLOT.h);
    // ...and the whole roof, not just its top edge, stays on stage.
    expect(CAMERA_LOCK_Y + TOP_FLOOR_H).toBeLessThan(GROUND_Y);
  });
});

describe('streaks', () => {
  it('A18/A19: banner at 3, 6, 9…, resets on a wrong answer, never repeats back-to-back', () => {
    let s = start(7);
    const fired: number[] = [];
    const messages: string[] = [];
    const pattern = [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    pattern.forEach((ok, i) => {
      const before = s.streakMessageId;
      s = answer(s, !!ok);
      if (s.streakMessageId !== before) {
        fired.push(i + 1);
        messages.push(s.lastStreakMessage!);
      }
    });
    // streaks hit 3 and 6 at Q3, Q6; wrong at Q7; then 3, 6, 9, 12 at Q10, Q13, Q16, Q19.
    expect(fired).toEqual([3, 6, 10, 13, 16, 19]);
    for (let i = 1; i < messages.length; i++) expect(messages[i]).not.toBe(messages[i - 1]);
    expect(STREAK_MESSAGES).toContain(messages[0]);
    expect(s.activeStreakMessage).toMatch(/12 in a row$/);
  });
});

describe('session', () => {
  it('A15/A16: timer expiry freezes into results and records a new best', () => {
    let s = answer(start(), true);
    s = gameReducer(s, { type: 'DRAG_START' });
    s = gameReducer(s, { type: 'TICK', dt: 90_000 });
    expect(s.phase).toBe('results');
    expect(s.isNewBest).toBe(true);
    expect(s.bestScore).toBe(5);
    expect(gameReducer(s, { type: 'DROP', symbol: '<' })).toBe(s);
  });

  it('A17/A23: review round-trips; play again resets; menu returns to splash', () => {
    let s = answer(start(), true);
    s = gameReducer(s, { type: 'TICK', dt: 100_000 });
    const review = gameReducer(s, { type: 'SHOW_REVIEW' });
    expect(review.phase).toBe('review');
    expect(gameReducer(review, { type: 'HIDE_REVIEW' })).toEqual(s);
    const again = gameReducer(s, { type: 'START_GAME', seed: 5 });
    expect(again).toMatchObject({ phase: 'playing', floors: [], attempts: [], questionIndex: 1, timeRemaining: 90_000, bestScore: 5 });
    expect(gameReducer(s, { type: 'GO_HOME' }).phase).toBe('splash');
  });
});
