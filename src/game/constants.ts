// All stage-space coordinates (800×600, top-left origin), timings and scoring.
//
// Where the PRD's §6 tables disagree with the reference composite
// (`High Tower - In Game screen.png`), the reference wins, because A2 requires
// a ±4px match against it. Those values are marked "ref:".

export const STAGE_W = 800;
export const STAGE_H = 600;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const BLOCK_W = 102;
export const BLOCK_H = 103;

// §6.1 Question row — ref: blocks interlock (the slot's side tabs sit in the
// number blocks' notches), 92px step. PRD table said 230 / 349 / 468.
export const LEFT_BLOCK: Rect = { x: 246, y: 13, w: BLOCK_W, h: BLOCK_H };
export const ANSWER_SLOT: Rect = { x: 338, y: 13, w: BLOCK_W, h: BLOCK_H };
export const RIGHT_BLOCK: Rect = { x: 430, y: 13, w: BLOCK_W, h: BLOCK_H };
export const QUESTION_FONT = 44;
export const QUESTION_FONT_3DIGIT = 36;
export const DROP_TOLERANCE = 20;

// §6.2 Answer panel — ref: 113px step (PRD's 90px step would overlap 103px blocks).
export const UI_PANEL: Rect = { x: 0, y: 152, w: 118, h: 348 };
export const PALETTE_X = 8;
export const PALETTE_Y = { '<': 168, '=': 281, '>': 394 } as const;
export const PALETTE_ORDER = ['<', '=', '>'] as const;
export const SYMBOL_FONT = 52;

// §6.3 Timer
export const TIMER_RECT: Rect = { x: 8, y: 10, w: 102, h: 56 };
export const TIMER_WARNING_MS = 10_000;

// §6.4 Score panel — ref: cards are 52px apart (a 60px step pushes slot 7 off-stage).
export const SCORE_PANEL: Rect = { x: 727, y: 0, w: 73, h: 600 };
export const SCORE_HEADER: Rect = { x: 727, y: 10, w: 73, h: 90 };
export const CARD_X = 738;
export const CARD_Y0 = 185;
export const CARD_STEP = 52;
export const CARD_SIZE = 52;
export const VISIBLE_CARDS = 8;
export const CARD_SLIDE_MS = 250;

// §6.5 Tower — ref: column centred on x≈388 like the question row (PRD said 254).
export const TOWER_X = 242;
export const TOWER_W = 292;
export const FLOOR_H = 119;
export const TOP_FLOOR_H = 101;
export const GROUND_Y = 600;
export const CAMERA_LOCK_Y = 60;

// Floor label mini-blocks, offsets from the stack's top-left — ref measurements.
export const MINI_LEFT: Rect = { x: 37, y: 42, w: 73, h: 66 };
export const MINI_SYMBOL: Rect = { x: 119, y: 48, w: 55, h: 53 };
export const MINI_RIGHT: Rect = { x: 183, y: 42, w: 73, h: 66 };

// §7 Timings (ms)
export const SESSION_MS = 90_000;
export const TICK_MS = 100;
export const CORRECT_RESOLVE_MS = 600;
export const WRONG_RESOLVE_MS = 700;
export const SLOT_FLASH_MS = 150;
export const FLOOR_DROP_MS = 400;
export const FLOOR_DROP_FROM = 60;
export const LABEL_FADE_MS = 200;
export const EXPLODE_MS = 300;
export const SETTLE_MS = 350;
export const SNAP_BACK_MS = 200;

// §7.5 Scoring
export const POINTS_PER_FLOOR = 5;

// §7.8 Streak banner
export const STREAK_EVERY = 3;
export const BANNER_Y = 128;
export const BANNER_DELAY_MS = 400;
export const BANNER_ENTER_MS = 300;
export const BANNER_HOLD_MS = 900;
export const BANNER_EXIT_MS = 300;

// §7.6 Results overlay
export const RESULTS_RECT: Rect = { x: 180, y: 140, w: 440, h: 320 };

// §7.7 Review screen
export const REVIEW_PANEL: Rect = { x: 60, y: 30, w: 680, h: 540 };
export const REVIEW_HEADER_H = 64;
export const REVIEW_VIEWPORT: Rect = { x: 76, y: 102, w: 648, h: 420 };
export const REVIEW_FOOTER_H = 48;
export const REVIEW_ROW_H = 60;
export const REVIEW_ROW_GAP = 8;
// Column x offsets / widths inside a row (row content is 648 wide).
export const REVIEW_COLS = {
  number: { x: 0, w: 52 },
  left: { x: 60, w: 96 },
  symbol: { x: 164, w: 60 },
  right: { x: 232, w: 96 },
  verdict: { x: 344, w: 52 },
  correction: { x: 408, w: 240 },
} as const;
export const REVIEW_MINI_H = 48;
export const REVIEW_CARD = 44;

// §8.1 Splash
// ref: title art has 18px of top padding, so the image sits at y = -3 to match the composite.
export const TITLE_RECT: Rect = { x: 222, y: -3, w: 356, h: 131 };
export const START_BUTTON_RECT: Rect = { x: 327, y: 501, w: 156, h: 50 };

export const BEST_SCORE_KEY = 'highTower.bestScore';

export const CREDIT_LINE = 'TODO: Vidhu to supply final credit text';

export const NAVY = '#1a237e';
export const YELLOW = '#ffd600';
