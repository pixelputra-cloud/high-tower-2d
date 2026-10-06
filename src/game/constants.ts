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

// Blocks render at 78% of the source art (102×103), so the question row and the
// palette read as part of the scene rather than dominating it.
export const BLOCK_W = 80;
export const BLOCK_H = 81;

// §6.1 Question row — ref: blocks interlock (the slot's side tabs sit in the
// number blocks' notches); the 92px step scales down with them. Centred on x = 389.
const QUESTION_STEP = 72;
const SLOT_X = 349;
export const LEFT_BLOCK: Rect = { x: SLOT_X - QUESTION_STEP, y: 14, w: BLOCK_W, h: BLOCK_H };
export const ANSWER_SLOT: Rect = { x: SLOT_X, y: 14, w: BLOCK_W, h: BLOCK_H };
export const RIGHT_BLOCK: Rect = { x: SLOT_X + QUESTION_STEP, y: 14, w: BLOCK_W, h: BLOCK_H };
export const QUESTION_FONT = 34;
export const QUESTION_FONT_3DIGIT = 28;
export const DROP_TOLERANCE = 20;

// §6.2 Answer panel — the three blocks are centred both ways on the panel, leaving
// (348 − 3×81 − 2×8) / 2 = 44px of breathing room above and below.
export const UI_PANEL: Rect = { x: 0, y: 152, w: 118, h: 348 };
export const PALETTE_X = (118 - BLOCK_W) / 2;
export const PALETTE_GAP = 8;
const PALETTE_TOP = UI_PANEL.y + (UI_PANEL.h - (3 * BLOCK_H + 2 * PALETTE_GAP)) / 2;
const PALETTE_STEP = BLOCK_H + PALETTE_GAP;
export const PALETTE_Y = {
  '<': PALETTE_TOP,
  '=': PALETTE_TOP + PALETTE_STEP,
  '>': PALETTE_TOP + 2 * PALETTE_STEP,
} as const;
export const PALETTE_ORDER = ['<', '=', '>'] as const;
export const SYMBOL_FONT = 40;

// §6.3 Timer
export const TIMER_RECT: Rect = { x: 8, y: 10, w: 102, h: 56 };
export const TIMER_WARNING_MS = 10_000;

// §6.4 Score panel — cards stack upward from the foot of the panel, the way floors
// stack on the tower: oldest visible card at the bottom, newest on top.
export const SCORE_PANEL: Rect = { x: 727, y: 0, w: 73, h: 600 };
export const SCORE_HEADER: Rect = { x: 727, y: 10, w: 73, h: 90 };
export const CARD_X = 738;
/** Top edge of the bottom-most card slot. */
export const CARD_BOTTOM_Y = 538;
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

// Sampled from the art so the DOM-drawn panels and buttons match the PNGs.
export const NAVY = '#1a237e';
export const YELLOW = '#ffd600';
/** `UI Panel.png` / `Score panel.png` fill. */
export const PANEL_NAVY_RGB = '0, 15, 125';
/** `User_Input Button_Main.png` face and its darker top band. */
export const BUTTON_YELLOW = '#ffdf00';
export const BUTTON_AMBER = '#f0b100';
