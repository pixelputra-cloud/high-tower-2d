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

// §6.2 Answer panel — the panel is sized from the stack it holds rather than fixed:
// three blocks plus an even PANEL_PAD margin on every side. That keeps the art at the
// same 78% scale as the blocks (118×348 → 92×271) and the same 8px padding the
// source composite used, scaled down. The art is flat on its left edge, so x = 0
// lets it bleed off-stage exactly as the reference does.
export const PALETTE_GAP = 8;
export const PANEL_PAD = 6;
const PALETTE_STEP = BLOCK_H + PALETTE_GAP;
const PALETTE_STACK_H = 3 * BLOCK_H + 2 * PALETTE_GAP;
export const UI_PANEL: Rect = {
  x: 0,
  y: 191,
  w: BLOCK_W + 2 * PANEL_PAD,
  h: PALETTE_STACK_H + 2 * PANEL_PAD,
};
export const PALETTE_X = UI_PANEL.x + PANEL_PAD;
const PALETTE_TOP = UI_PANEL.y + PANEL_PAD;
export const PALETTE_Y = {
  '<': PALETTE_TOP,
  '=': PALETTE_TOP + PALETTE_STEP,
  '>': PALETTE_TOP + 2 * PALETTE_STEP,
} as const;
export const PALETTE_ORDER = ['<', '=', '>'] as const;
export const SYMBOL_FONT = 40;

// §6.3 Timer — same width and left edge as the answer panel below it, so the two
// line up as one column, and styled like the other panels (no border).
export const TIMER_RECT: Rect = { x: UI_PANEL.x, y: 10, w: UI_PANEL.w, h: 52 };
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

// Parallax background ------------------------------------------------------
//
// The static BG.png is replaced by seven layers that drift at different rates as
// the tower grows, so the scene gains depth. Every ground-anchored layer is
// positioned so its bottom edge sits below the stage: the art is meant to run off
// the bottom of the screen, and layers only ever drift DOWNWARD, so a flat bottom
// edge can never scroll into view.

export interface BgLayer {
  /** Key into ASSETS. */
  src: 'bgPlain' | 'bgBush' | 'bgBuilding' | 'mgBuilding' | 'fgBuilding';
  x: number;
  y: number;
  w: number;
  h: number;
  /** 0 = infinitely distant and never moves, 1 = nearest and moves the most. */
  depth: number;
}

/** Back to front. The tower and all UI render above every one of these. */
export const BG_LAYERS: BgLayer[] = [
  // The sky is infinitely distant, so it is pinned: anything else would open a gap
  // at the top of the stage, since it is exactly stage-sized.
  { src: 'bgPlain', x: 0, y: 0, w: 800, h: 601, depth: 0 },
  { src: 'bgBush', x: 0, y: 420, w: 800, h: 193, depth: 0.45 },
  { src: 'bgBuilding', x: 101, y: 252, w: 597, h: 582, depth: 0.6 },
  // clouds sit here, between the background and middle-ground buildings
  { src: 'mgBuilding', x: 37, y: 300, w: 725, h: 394, depth: 0.86 },
  { src: 'fgBuilding', x: 99, y: 466, w: 601, h: 178, depth: 1 },
];

/** Clouds drift between the background and middle-ground buildings. */
export const CLOUD_DEPTH = 0.72;
export const CLOUD_COUNT = 6;
/** Random size range for each cloud, as a fraction of the source art. */
export const CLOUD_SCALE_MIN = 0.56;
export const CLOUD_SCALE_MAX = 1.13;
/**
 * Vertical band the clouds scatter within. It reaches a little past the background
 * buildings' peaks (y 252) on purpose, so some clouds pass in front of those and
 * behind the middle-ground ones, which is what makes the layering read as depth.
 */
export const CLOUD_BAND = { top: 30, bottom: 292 };

/** Downward travel of the nearest layer once the parallax has fully saturated. */
export const PARALLAX_MAX_SHIFT = 70;
/**
 * Floors at which the drift reaches half of PARALLAX_MAX_SHIFT. The curve saturates
 * rather than scaling linearly, so total travel stays bounded and no layer edge can
 * ever be exposed. Keeping this low front-loads the movement into the early floors,
 * where the player is watching the tower grow: the first answer shifts the nearest
 * layer 14px and the background buildings 8px, which reads clearly, and the drift
 * then tapers off as the tower gets tall.
 */
export const PARALLAX_HALF_AT = 4;
/** The background settles a little after the tower, which reads as distance. */
export const PARALLAX_MS = 680;

// §6.5 Tower — ref: column centred on x≈388 like the question row (PRD said 254).
export const TOWER_X = 242;
export const TOWER_W = 292;
export const FLOOR_H = 119;
export const TOP_FLOOR_H = 101;
export const GROUND_Y = 600;
/**
 * Where the roof's top edge parks once the camera locks. The PRD said 60, but the
 * question row sits at y 14–95, so a roof pinned at 60 tucks its crenellations and
 * purple peak behind those blocks. Deriving it from the question row instead keeps
 * the whole roof clear of them, and stays correct if that row ever moves.
 */
export const TOWER_HEADROOM = 8;
export const CAMERA_LOCK_Y = ANSWER_SLOT.y + ANSWER_SLOT.h + TOWER_HEADROOM;

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
/**
 * A new floor does not drop in from above — it rises out of the tower. It starts a
 * full FLOOR_H below its slot, exactly covered by the floor beneath it, then pushes
 * up into place while the roof and camera travel the same distance on the same curve,
 * so the structure reads as one body extruding upward rather than a part appearing.
 * The first floor starts at the ground line, so the tower grows out of the ground.
 */
export const FLOOR_RISE_MS = 520;
/** Small overshoot so the rise settles with some weight instead of stopping dead. */
export const FLOOR_RISE_BOUNCE = 0.18;
/**
 * Floors paint lowest-on-top, so a rising floor stays hidden until it clears the one
 * below. These live on their own scale and must never compete with the stage layers
 * below — the tower group sets `isolation: isolate` so they stay contained even when
 * the camera offset is 0 and Framer Motion emits no transform of its own.
 */
export const FLOOR_Z_BASE = 500;
export const ROOF_Z = FLOOR_Z_BASE + 100;
export const LABEL_FADE_MS = 200;
export const EXPLODE_MS = 300;
export const SETTLE_MS = 350;
export const SNAP_BACK_MS = 200;

// §7.5 Scoring
export const POINTS_PER_FLOOR = 5;

// §7.8 Streak banner
export const STREAK_EVERY = 3;
export const BANNER_Y = 128;
/**
 * Paint order within the stage. The banner clears everything in the playfield —
 * tower, question row, panels — but deliberately stays under the results and review
 * modals, so a banner still on screen when the timer expires cannot cover them.
 */
export const BANNER_Z = 45;
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

export const CREDIT_LINE =
  'Number comparison game based on research by Dr. Kaye Stacey and others, University of Melbourne';

// Sampled from the art so the DOM-drawn panels and buttons match the PNGs.
export const NAVY = '#1a237e';
export const YELLOW = '#ffd600';
/** `UI Panel.png` / `Score panel.png` fill. The button yellow lives in global.css. */
export const PANEL_NAVY_RGB = '0, 15, 125';
