export type Symbol = '<' | '=' | '>';

export type Phase = 'splash' | 'playing' | 'dragging' | 'resolving' | 'results' | 'review';

export interface Question {
  left: number;
  right: number;
  correctSymbol: Symbol;
}

export interface Floor {
  id: string; // stable key for animation
  left: number;
  right: number;
  symbol: Symbol;
  /** 0 = Stack 01 (purple), 1 = Stack 02 (green). Fixed at creation so floors don't recolour when the bottom one is destroyed. */
  art: 0 | 1;
}

export interface Attempt {
  id: string;
  questionNumber: number; // 1-based
  left: number;
  right: number;
  chosenSymbol: Symbol;
  correctSymbol: Symbol;
  correct: boolean;
}

export type ResolutionKind = 'correct' | 'wrong' | 'wrongEmpty';

/** The most recent answer's outcome; components key their one-shot animations off `id`. */
export interface Resolution {
  id: number;
  kind: ResolutionKind;
  /** Screen-space y of the destroyed floor's top edge (before the camera moved). */
  destroyedFloorScreenY: number | null;
}

export interface GameState {
  phase: Phase;
  timeRemaining: number; // ms, counts down from 90_000
  questionIndex: number; // 1-based, drives difficulty
  currentQuestion: Question | null;
  droppedSymbol: Symbol | null;
  floors: Floor[]; // index 0 = bottom
  cameraOffsetY: number;
  attempts: Attempt[]; // full history; panel renders last 8, review renders all
  correctCount: number;
  wrongCount: number;
  streak: number; // consecutive correct; resets to 0 on wrong
  bestStreak: number;
  activeStreakMessage: string | null;
  streakMessageId: number;
  lastStreakMessage: string | null; // so the same message never repeats back-to-back
  bestScore: number;
  isNewBest: boolean;
  resolution: Resolution | null;
  /** Session counter, folded into ids so keys never collide across Play Again. */
  session: number;
  /** Shuffled bag of upcoming target relations (§7.2 even split). */
  relationBag: Symbol[];
  /** PRNG state — keeps the reducer pure. */
  seed: number;
}
