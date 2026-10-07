import {
  CAMERA_LOCK_Y,
  FLOOR_H,
  GROUND_Y,
  POINTS_PER_FLOOR,
  SESSION_MS,
  STREAK_EVERY,
  TOP_FLOOR_H,
} from './constants';
import { pickStreakMessage } from './encouragement';
import { generateQuestion, refillBag } from './questionGenerator';
import { createRng } from './rng';
import type { Attempt, Floor, GameState, Symbol } from './types';

export type GameAction =
  | { type: 'START_GAME'; seed: number }
  | { type: 'TICK'; dt: number }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_CANCEL' }
  | { type: 'DROP'; symbol: Symbol }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SHOW_REVIEW' }
  | { type: 'HIDE_REVIEW' }
  | { type: 'GO_HOME' };

export const points = (state: Pick<GameState, 'floors'>) => state.floors.length * POINTS_PER_FLOOR;

/** y of the top floor's top edge with no camera applied. */
export const towerTopY = (floorCount: number) => GROUND_Y - floorCount * FLOOR_H - TOP_FLOOR_H;

/** Once the roof would rise above y = 60 the camera follows it, pinning it there. */
export const cameraOffsetFor = (floorCount: number) => Math.max(0, CAMERA_LOCK_Y - towerTopY(floorCount));

/** Stack-space y of floor `index`'s top edge (before camera offset). */
export const floorY = (index: number) => GROUND_Y - (index + 1) * FLOOR_H;

export function createInitialState(bestScore: number, seed: number): GameState {
  return {
    phase: 'splash',
    timeRemaining: SESSION_MS,
    questionIndex: 0,
    currentQuestion: null,
    droppedSymbol: null,
    floors: [],
    cameraOffsetY: 0,
    attempts: [],
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    activeStreakMessage: null,
    streakMessageId: 0,
    lastStreakMessage: null,
    bestScore,
    isNewBest: false,
    resolution: null,
    session: 0,
    relationBag: [],
    seed,
  };
}

/** Advances to the next question, drawing its target relation from the bag. */
function withNextQuestion(state: GameState): GameState {
  const rng = createRng(state.seed);
  const bag = state.relationBag.length ? [...state.relationBag] : refillBag(rng);
  const relation = bag.shift()!;
  const questionIndex = state.questionIndex + 1;
  const currentQuestion = generateQuestion(questionIndex, relation, state.currentQuestion, rng);
  return {
    ...state,
    phase: 'playing',
    questionIndex,
    currentQuestion,
    droppedSymbol: null,
    relationBag: bag,
    seed: rng.state(),
  };
}

function finish(state: GameState): GameState {
  const score = points(state);
  const isNewBest = score > state.bestScore;
  return {
    ...state,
    phase: 'results',
    timeRemaining: 0,
    isNewBest,
    bestScore: isNewBest ? score : state.bestScore,
  };
}

function resolveDrop(state: GameState, symbol: Symbol): GameState {
  const q = state.currentQuestion!;
  const correct = symbol === q.correctSymbol;
  const questionNumber = state.questionIndex;
  const attempt: Attempt = {
    id: `s${state.session}-a${questionNumber}`,
    questionNumber,
    left: q.left,
    right: q.right,
    chosenSymbol: symbol,
    correctSymbol: q.correctSymbol,
    correct,
  };
  const attempts = [...state.attempts, attempt];
  const resolutionId = (state.resolution?.id ?? 0) + 1;

  if (correct) {
    const top = state.floors[state.floors.length - 1];
    const floor: Floor = {
      id: `s${state.session}-f${questionNumber}`,
      left: q.left,
      right: q.right,
      symbol,
      art: top ? (top.art === 0 ? 1 : 0) : 0,
    };
    const floors = [...state.floors, floor];
    const streak = state.streak + 1;
    let streakFields = {};
    if (streak % STREAK_EVERY === 0) {
      const rng = createRng(state.seed);
      const { message, base } = pickStreakMessage(streak, state.lastStreakMessage, rng);
      streakFields = {
        activeStreakMessage: message,
        lastStreakMessage: base,
        streakMessageId: state.streakMessageId + 1,
        seed: rng.state(),
      };
    }
    return {
      ...state,
      phase: 'resolving',
      droppedSymbol: symbol,
      floors,
      cameraOffsetY: cameraOffsetFor(floors.length),
      attempts,
      correctCount: state.correctCount + 1,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      resolution: { id: resolutionId, kind: 'correct', destroyedFloorScreenY: null },
      ...streakFields,
    };
  }

  const hadFloors = state.floors.length > 0;
  const floors = state.floors.slice(1); // the bottom floor is destroyed
  return {
    ...state,
    phase: 'resolving',
    droppedSymbol: symbol,
    floors,
    cameraOffsetY: cameraOffsetFor(floors.length),
    attempts,
    wrongCount: state.wrongCount + 1,
    streak: 0,
    resolution: {
      id: resolutionId,
      kind: hadFloors ? 'wrong' : 'wrongEmpty',
      destroyedFloorScreenY: hadFloors ? floorY(0) + state.cameraOffsetY : null,
    },
  };
}

const ACTIVE: GameState['phase'][] = ['playing', 'dragging', 'resolving'];

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const fresh = createInitialState(state.bestScore, action.seed);
      return withNextQuestion({ ...fresh, session: state.session + 1 });
    }
    case 'TICK': {
      if (!ACTIVE.includes(state.phase)) return state;
      const timeRemaining = state.timeRemaining - action.dt;
      return timeRemaining <= 0 ? finish(state) : { ...state, timeRemaining };
    }
    case 'DRAG_START':
      return state.phase === 'playing' ? { ...state, phase: 'dragging' } : state;
    case 'DRAG_CANCEL':
      return state.phase === 'dragging' ? { ...state, phase: 'playing' } : state;
    case 'DROP':
      return state.phase === 'dragging' ? resolveDrop(state, action.symbol) : state;
    case 'NEXT_QUESTION':
      return state.phase === 'resolving' ? withNextQuestion(state) : state;
    case 'SHOW_REVIEW':
      return state.phase === 'results' ? { ...state, phase: 'review' } : state;
    case 'HIDE_REVIEW':
      return state.phase === 'review' ? { ...state, phase: 'results' } : state;
    case 'GO_HOME':
      return { ...createInitialState(state.bestScore, state.seed), session: state.session };
  }
}
