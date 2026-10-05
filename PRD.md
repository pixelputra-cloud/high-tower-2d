# High Tower — Product Requirements Document

**Version:** 1.0
**Date:** 2026-10-05
**Owner:** Vidhu (Pixel Putra)
**Purpose of this doc:** hand-off spec for Claude Code to generate the full game.

---

## 1. Product Summary

**High Tower** is a browser-based math practice game for **Grade 1 & 2** students.
Players compare two numbers by dragging a comparison symbol (`<`, `=`, `>`) into the gap between them. Correct answers build a tower taller; wrong answers blow a floor out from under it. A 90-second timer creates urgency.

**Core loop:** read two numbers → drag the right symbol → tower grows or loses a floor → next question.

**Platform:** single-page web app, desktop + tablet browsers.

---

## 2. Objectives

| # | Objective |
|---|---|
| O1 | Drill number-comparison fluency (`<`, `=`, `>`) for 1-, 2- and 3-digit numbers |
| O2 | Give immediate, physical, visual feedback — the tower *is* the scoreboard |
| O3 | Keep a full session under 2 minutes so it can be replayed many times |
| O4 | Zero text instructions required — the UI teaches itself |

**Non-goals (v1):** audio, accounts, leaderboards, multiplayer, question banks from a server, analytics.

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build | **Vite** | Fast, zero-config, matches existing Pixel Putra projects |
| Framework | **React 18 + TypeScript** | Component-per-UI-element maps cleanly to the asset list |
| Rendering | **DOM + CSS transforms** (NOT canvas, NOT Phaser) | Assets are flat PNG UI panels; absolutely-positioned `<div>`s inside a fixed 800×600 stage are simpler, crisper, and far easier to debug than a game engine |
| Animation | **Framer Motion** | Tower rise, stack drop-in, explosion, score-card pop |
| Drag & drop | **Custom pointer events** (`pointerdown` / `pointermove` / `pointerup`) | HTML5 Drag-and-Drop API is broken on touch devices. Do **not** use `react-dnd` or the native DnD API. |
| State | **`useReducer`** in a single `gameMachine.ts` | One explicit state machine, no hidden state |
| Persistence | `localStorage` | Best score only |
| Deploy | **GitHub Pages** via GitHub Actions on push to `main` | Same as `dj-scratch-deck` |

**Do not add:** Redux, Tailwind (plain CSS modules are fine), a physics engine, a sound library.

---

## 4. Screen & Scaling

- **Stage size: fixed 800 × 600 px.** All coordinates in this doc are in stage space.
- The stage is wrapped in a container that applies `transform: scale(k)` where
  `k = min(window.innerWidth / 800, window.innerHeight / 600)`, with `transform-origin: center`.
- Letterbox the remainder with the page background colour.
- Recompute `k` on `resize`. Never re-flow the layout — only scale it.
- Drag coordinates must be divided by `k` to convert pointer position into stage space.

---

## 5. Assets

All assets live in `Assets/`. Copy them into `public/assets/` at the paths below, preserving names.

### 5.1 Splash screen — `Assets/Splash screen/`

| File | Size | Use |
|---|---|---|
| `Splash screen BG.png` | 800 × 605 | Full-bleed background (crop/anchor to 800×600) |
| `Game title.png` | 356 × 131 | Title, centred, top area |
| `Start game_button.png` | 156 × 50 | Start button |
| `High Tower - Splash Screen_ref.png` | 800 × 600 | **Reference composite — match this layout exactly. Do not ship this file.** |

> **Credit line:** the reference composite has baked-in text reading *"Developed by Mindspark team based on research by Dr. Kaye Stacey and others, The University of Melbourne, Australia."*
> Render the credit line as **DOM text**, not baked into an image, from a single exported constant:
> ```ts
> export const CREDIT_LINE = "TODO: Vidhu to supply final credit text";
> ```
> Position: bottom-centre, ~11px bold, white, 1px dark shadow. If `CREDIT_LINE` is an empty string, render nothing.

### 5.2 In-game screen — `Assets/In-Game screen/PNG/`

| File | Size | Use |
|---|---|---|
| `BG.png` | 800 × 601 | Game background (green city skyline) |
| `Question Block Left.png` | 102 × 103 | Left number block (top of screen) |
| `Question Block Right.png` | 102 × 103 | Right number block (top of screen) |
| `Answer Block.png` | 102 × 103 | The empty yellow slot between the two numbers |
| `User_Input Button_Main.png` | 102 × 103 | The three draggable symbol blocks |
| `UI Panel.png` | 118 × 348 | Dark panel behind the three symbol blocks (left edge) |
| `Score panel.png` | 73 × 600 | Right-hand status panel |
| `Right Score card.png` | 52 × 52 | Green tick card |
| `Wrong Score card.png` | 52 × 52 | Red cross card |
| `Top Floor.png` | 292 × 101 | Tower roof — always the topmost piece |
| `Stack 01.png` | 292 × 119 | Purple floor |
| `Stack 02.png` | 292 × 119 | Green floor |
| `High Tower - In Game screen.png` | 800 × 600 | **Reference composite — match this layout exactly. Do not ship this file.** |

> All numbers and symbols are **DOM text rendered on top of the blocks**, not images. Use a heavy rounded sans (e.g. bundled **Fredoka** or **Baloo 2**), black, with the sizes given in §6.

---

## 6. In-Game Layout (stage coordinates, top-left origin)

Match `High Tower - In Game screen.png`. Tolerance ±4px.

### 6.1 Question row (top)
| Element | x | y | w | h |
|---|---|---|---|---|
| Left number block | 230 | 14 | 102 | 103 |
| Answer slot (empty, yellow) | 349 | 14 | 102 | 103 |
| Right number block | 468 | 14 | 102 | 103 |

- Number text: ~44px bold, black, centred in block.
- Numbers are **zero-padded to 2 digits** in the 1-digit level (`06`, `07`). 3-digit numbers render as-is (`200`) at ~36px so they fit.
- The empty slot shows a `?` in ~44px bold until an answer is dropped.

### 6.2 Answer panel (left)
| Element | x | y | w | h |
|---|---|---|---|---|
| `UI Panel.png` | 0 | 152 | 118 | 348 |
| `<` block | 8 | 168 | 102 | 103 |
| `=` block | 8 | 258 | 102 | 103 |
| `>` block | 8 | 348 | 102 | 103 |

- Symbol text: ~52px bold, black, centred.
- These three blocks are **always present and always draggable** — they are a palette, not consumed. Dragging one leaves the original in place (drag a visual clone).

### 6.3 Timer (top-left)
- Badge at **x: 8, y: 10, w: 102, h: 56**.
- Rounded rect, dark navy fill (`#1a237e`), 3px black border, 12px radius — visually consistent with the score panel.
- Label `TIME` in ~12px yellow bold, value `0:90` → `0:00` in ~28px yellow bold.
- Turns red and pulses (scale 1.0 ↔ 1.08, 0.5s loop) in the final 10 seconds.

### 6.4 Score panel (right)
| Element | x | y | w | h |
|---|---|---|---|---|
| `Score panel.png` | 727 | 0 | 73 | 600 |
| Header text block | 727 | 10 | 73 | 90 |
| Score card slot *i* (i = 0..7) | 738 | 185 + (i × 60) | 52 | 52 |

- Header: `Total` (~13px yellow bold) / points value (~30px yellow bold) / `Points` (~13px yellow bold), all centred.
- Cards use `Right Score card.png` or `Wrong Score card.png`.
- **Overflow behaviour:** the panel shows the **last 8 attempts**. On the 9th attempt, all cards slide up by 60px over 250ms, the oldest fades out at the top, the newest fades in at the bottom slot.

### 6.5 Tower
- Tower column is horizontally centred: **x = 254** (`(800 − 292) / 2`), width 292.
- Vertical step between floors: **119px** (stack height, no overlap).
- Ground line: **y = 600** (bottom of the lowest stack sits on the stage bottom edge).

**Stacking model**
- The tower is an array of floors, index `0` = bottom-most, index `n−1` = top-most.
- `Top Floor.png` always sits directly above floor `n−1`, i.e. its bottom edge touches that floor's top edge.
- Floor art alternates by index: even index → `Stack 01.png` (purple), odd index → `Stack 02.png` (green).
- **At game start the tower has 0 floors**: only `Top Floor.png` is visible, resting on the ground — its top edge at y = 499, bottom at y = 600.

**Camera / 90% cap** (see `Assets/Recording 2026-10-05 115511.mp4`)
- Define `towerTopY = 600 − (floorCount × 119) − 101` — the y of the top floor's top edge.
- While `towerTopY ≥ 60`, the tower renders with **no camera offset**: the base stays at y = 600 and the whole tower visibly rises as floors are added.
- Once a new floor would push `towerTopY` above 60 (≈90% of screen height), **lock the camera**: apply `cameraOffsetY = 60 − towerTopY` as a `translateY` on the whole tower group, so the top floor stays pinned at y = 60 and the lower floors slide off the bottom of the stage.
- The tower group must be inside a container with `overflow: hidden` clipped to the stage, so floors leaving the bottom are simply cut off.
- When floors are destroyed, the camera un-locks symmetrically (offset reduces back toward 0).

**Floor labels**
- Every floor added by a **correct** answer carries the question it came from, rendered on top of the stack art:

| Element | offset from stack left edge | offset from stack top | w | h |
|---|---|---|---|---|
| Left number mini-block | 43 | 28 | 61 | 62 |
| Symbol mini-block | 116 | 28 | 61 | 62 |
| Right number mini-block | 189 | 28 | 61 | 62 |

- These reuse `Question Block Left.png`, `User_Input Button_Main.png`, `Question Block Right.png` scaled to 61×62.
- Number text ~26px bold (~20px for 3-digit), symbol text ~30px bold, black.
- Labels scroll with the tower and clip at the stage edge like the floors.

---

## 7. Game Logic

### 7.1 Session
- **Duration: 90 seconds.** Timer starts on the first question render after Start Game.
- Questions are unlimited within the 90s — a new one appears immediately after each answer resolves.
- Timer does **not** pause during answer-resolution animations.
- At 0:00, freeze input immediately (even mid-drag: cancel the drag) and show the results overlay.

### 7.2 Question generation
Progressive difficulty by question index `q` (1-based):

| Question | Number range |
|---|---|
| 1 – 3 | 0 – 9 (rendered zero-padded: `06`) |
| 4 – 6 | 10 – 99 |
| 7 + | 100 – 999 |

**Answer distribution:** force an even split — each question picks its target relation first (`<`, `=`, `>`, ⅓ each), then generates a number pair that satisfies it.
- For `=`, generate one number and use it for both sides.
- Never repeat the exact same `(left, right)` pair twice in a row.

### 7.3 Answering
- The player **drags** one of the three symbol blocks onto the empty slot. Drag-and-drop is the **only** input method in v1 (no click-to-place, no keyboard).
- Drop is accepted if the pointer is released while over the answer slot's bounding box, expanded by a 20px tolerance margin.
- A drop outside that zone animates the clone back to its origin (200ms) and does nothing.
- While a block is being dragged, the answer slot highlights (e.g. 1.06 scale + brightness 1.15).
- Input is locked during resolution (§7.4) and unlocked when the next question appears.

### 7.4 Resolution

**Correct answer**
1. The dropped symbol snaps into the answer slot. Slot flashes green (150ms).
2. A new floor is **inserted at the top of the stack array** (index `n`), directly under the top floor.
3. The new floor drops in from 60px above with a slight bounce (Framer Motion spring), 400ms, while the top floor and camera translate to their new positions over the same 400ms.
4. The floor's labels (§6.5) fade in over 200ms after the drop lands.
5. A green tick card is appended to the score panel.
6. Points update (§7.5).
7. After 600ms total, clear the question and generate the next.

**Wrong answer**
1. The dropped symbol snaps into the slot. Slot flashes red (150ms).
2. The **bottom-most floor (index 0) explodes**: scale to 1.15, opacity to 0, with a short particle/debris burst, over 300ms.
3. All remaining floors and the top floor **settle down by 119px** over 350ms (ease-out), landing back on the ground line. Add a 4px screen-shake on landing.
4. A red cross card is appended to the score panel.
5. Points update (§7.5).
6. After 700ms total, clear the question and generate the next.

**Wrong answer with 0 floors**
- Nothing explodes. The tower cannot go below zero floors.
- Top floor does a short shake (±6px horizontal, 250ms).
- A red cross card is still appended; points stay at 0.
- The game **continues** — there is no game-over before the timer expires.

### 7.5 Scoring
- **Points = standing floor count × 5.** Displayed live in the score panel header.
- Because wrong answers remove a floor, the score can go down. It never goes below 0.
- Final score = points at the moment the timer hits 0:00.

### 7.6 Results overlay (timer expiry)
Modal panel centred over the frozen game, ~440 × 320, same visual language as the score panel (navy fill, yellow text, black border, rounded).

Contents:
- `TIME UP!` heading
- **Final Score** — points, large
- **Tower Height** — floors standing
- **Correct / Wrong** — totals for the session
- **Best Score** — read from `localStorage` key `highTower.bestScore`. If the new score beats it, write it and show a `NEW BEST!` badge.
- **Review Answers** button → opens the review screen (§7.7)
- **Play Again** button → full reset back to a fresh game (not the splash screen)
- **Menu** button → return to splash screen

### 7.7 Review screen

Opened from the results overlay via **Review Answers**. Lists **every** question attempted in the session, in order, so the player (or a teacher) can see exactly what went wrong.

**Layout** — full-stage panel over a dimmed, frozen game screen.

| Element | x | y | w | h |
|---|---|---|---|---|
| Panel | 60 | 30 | 680 | 540 |
| Header row | 60 | 30 | 680 | 64 |
| Scroll viewport | 76 | 102 | 648 | 420 |
| Footer row | 60 | 522 | 680 | 48 |

- Panel styling matches the score panel: navy fill (`#1a237e`), 4px black border, 16px radius.
- **Header:** `YOUR ANSWERS` (~24px yellow bold, left) and `12 / 18 correct` (~18px white bold, right).
- **Footer:** `Back` button (returns to the results overlay). No other navigation from here.

**Row spec** — one row per attempt, 60px tall, 8px gap, rendered in attempt order (Q1 at top).

| Column | x offset (from viewport left) | w | Content |
|---|---|---|---|
| Question number | 0 | 52 | `Q1`, `Q2`… ~16px white bold |
| Left number | 60 | 96 | mini number block, ~26px bold black |
| Player's symbol | 164 | 60 | mini symbol block, ~28px bold black |
| Right number | 232 | 96 | mini number block, ~26px bold black |
| Verdict | 344 | 52 | `Right Score card.png` or `Wrong Score card.png`, 44×44 |
| Correction | 408 | 240 | see below |

- Row background: translucent green (`rgba(76,175,80,0.18)`) when correct, translucent red (`rgba(244,67,54,0.18)`) when wrong. 10px radius.
- Mini blocks reuse `Question Block Left.png` / `User_Input Button_Main.png` / `Question Block Right.png`, scaled to fit the column.
- **Correction column:**
  - Correct attempt → empty.
  - Wrong attempt → `Correct: 21 > 12` in ~16px yellow bold, where the symbol is the correct one. This is the teaching moment — make it legible, not decorative.

**Scrolling**
- The viewport shows 7 rows at a time and scrolls vertically when there are more.
- Native scroll (`overflow-y: auto`) with a styled thin scrollbar; mouse wheel and touch drag both work.
- The scroll container is inside the scaled stage, so no coordinate conversion is needed — it is a normal DOM scroll.
- If the session had 0 attempts, show `No questions attempted` centred in the viewport.

### 7.8 Streak encouragement

**Trigger:** every time `streak` reaches a multiple of 3 (3, 6, 9, 12…). `streak` increments on each correct answer and **resets to 0 on any wrong answer**.

**Message pool** — pick at random, never the same message twice in a row within one session:

```ts
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
```

- For streaks of **6 or more**, prefer the higher-energy entries (`On fire!`, `Unstoppable!`, `Brilliant!`) and append the count: `On fire! 6 in a row`.

**Presentation — a banner, not a modal.** It must never block the tower or the next question.

| Property | Value |
|---|---|
| Position | centred horizontally on the stage (centre x = 400), y = 128 |
| Size | auto-width, ~56px tall, 20px horizontal padding |
| Style | yellow fill (`#ffd600`), 3px black border, 14px radius, text ~28px bold black |
| Enter | scale 0.6 → 1.0 with spring overshoot + fade in, 300ms |
| Hold | 900ms |
| Exit | translateY −30px + fade out, 300ms |

- The banner appears **after** the new floor has landed (i.e. ~400ms into the correct-answer resolution), so it does not compete with the tower animation.
- It does not extend the resolution delay — the next question still appears on the normal schedule and the banner finishes over the top of it.
- Only one banner on screen at a time; a new trigger replaces the current one.
- **No point bonus.** Streaks are purely encouragement in v1; scoring stays floors × 5.

---

## 8. Screen Flow

```
SPLASH  ──[Start Game]──►  PLAYING  ──[timer 0:00]──►  RESULTS
                              ▲                        │   ▲
                              │                        │   │
                              └────[Play Again]────────┘   │
                                                           │
                            RESULTS ──[Review Answers]──► REVIEW
                                    ◄──────[Back]─────────┘

RESULTS ──[Menu]──► SPLASH
```

### 8.1 Splash screen
- `Splash screen BG.png` full-bleed.
- `Game title.png` centred, ~y 20.
- `Start game_button.png` centred, ~y 500. Hover: scale 1.05. Press: scale 0.95.
- `CREDIT_LINE` DOM text at bottom-centre (§5.1).

---

## 9. State Machine

```ts
type Phase = 'splash' | 'playing' | 'dragging' | 'resolving' | 'results' | 'review';

interface GameState {
  phase: Phase;
  timeRemaining: number;        // ms, counts down from 90_000
  questionIndex: number;        // 1-based, drives difficulty
  currentQuestion: {
    left: number;
    right: number;
    correctSymbol: '<' | '=' | '>';
  } | null;
  droppedSymbol: '<' | '=' | '>' | null;
  floors: Floor[];              // index 0 = bottom
  cameraOffsetY: number;
  attempts: Attempt[];          // full history; panel renders last 8, review renders all
  correctCount: number;
  wrongCount: number;
  streak: number;               // consecutive correct; resets to 0 on wrong
  bestStreak: number;           // best streak this session
  activeStreakMessage: string | null;
  lastStreakMessage: string | null;  // so the same message never repeats back-to-back
  bestScore: number;
}

interface Floor {
  id: string;                   // stable key for animation
  left: number;
  right: number;
  symbol: '<' | '=' | '>';
}

interface Attempt {
  id: string;
  questionNumber: number;       // 1-based
  left: number;
  right: number;
  chosenSymbol: '<' | '=' | '>';
  correctSymbol: '<' | '=' | '>';
  correct: boolean;
}
```

Derived values (not stored): `points = floors.length * 5`.

---

## 10. Suggested File Structure

```
high-tower/
├─ public/
│  └─ assets/
│     ├─ splash/        (bg, title, start button)
│     └─ game/          (bg, blocks, panels, stacks, cards)
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                    // phase router
│  ├─ game/
│  │  ├─ gameMachine.ts          // reducer + actions
│  │  ├─ questionGenerator.ts    // §7.2
│  │  ├─ encouragement.ts        // STREAK_MESSAGES + picker, §7.8
│  │  ├─ constants.ts            // all coordinates from §6, timings, scoring
│  │  └─ types.ts
│  ├─ components/
│  │  ├─ Stage.tsx               // 800×600 + scale-to-fit wrapper
│  │  ├─ SplashScreen.tsx
│  │  ├─ GameScreen.tsx
│  │  ├─ QuestionRow.tsx
│  │  ├─ AnswerPanel.tsx         // the three draggable symbols
│  │  ├─ DragLayer.tsx           // the floating clone during a drag
│  │  ├─ Timer.tsx
│  │  ├─ ScorePanel.tsx
│  │  ├─ Tower.tsx               // floors + top floor + camera offset
│  │  ├─ Floor.tsx               // one stack + its 3 mini-blocks
│  │  ├─ StreakBanner.tsx        // §7.8
│  │  ├─ ResultsOverlay.tsx
│  │  ├─ ReviewScreen.tsx        // §7.7
│  │  └─ ReviewRow.tsx
│  ├─ hooks/
│  │  ├─ useStageScale.ts
│  │  ├─ usePointerDrag.ts       // §7.3, stage-space coordinate conversion
│  │  └─ useCountdown.ts
│  └─ styles/
└─ .github/workflows/deploy.yml
```

**All magic numbers from §6 go in `constants.ts`.** No hard-coded coordinates in components.

---

## 11. Acceptance Criteria

| # | Criterion |
|---|---|
| A1 | Splash screen matches `High Tower - Splash Screen_ref.png` within ±4px; credit line is DOM text driven by `CREDIT_LINE` |
| A2 | In-game screen matches `High Tower - In Game screen.png` within ±4px at scale 1.0 |
| A3 | Stage scales correctly and stays centred at 1280×720, 1920×1080, and an iPad in landscape |
| A4 | Dragging works with both mouse and touch; drop coordinates are correct at every scale factor |
| A5 | The symbol palette is never consumed — all three blocks remain after any number of drags |
| A6 | Q1–3 produce 1-digit numbers, Q4–6 two-digit, Q7+ three-digit |
| A7 | Across 60 generated questions, each of `<`, `=`, `>` appears between 25% and 42% of the time |
| A8 | Correct answer inserts a floor beneath the top floor; floor art alternates purple/green by index |
| A9 | Each correct floor displays its own question numbers and symbol, correctly positioned |
| A10 | Wrong answer destroys the **bottom** floor and the tower settles down by exactly 119px |
| A11 | Wrong answer at 0 floors shakes the top floor, records a red card, and the game continues |
| A12 | Tower rises until the top floor reaches y = 60, then the camera locks and the tower grows in place with lower floors clipping off the bottom |
| A13 | Score panel shows the last 8 attempts and slides correctly from the 9th onward |
| A14 | Points = floors × 5, updated live, never below 0 |
| A15 | Timer counts 90 → 0, turns red and pulses under 10s, and freezes all input at 0 |
| A16 | Results overlay shows final score, height, correct/wrong, and best score; best score persists across reloads |
| A17 | Play Again returns to a fully reset game; Menu returns to splash |
| A18 | A streak banner fires at exactly 3, 6, 9… consecutive correct answers and never repeats the same message twice in a row |
| A19 | A wrong answer resets the streak to 0; the next banner requires 3 fresh correct answers |
| A20 | The streak banner never blocks a drag, delays the next question, or overlaps two banners at once |
| A21 | Review screen lists **every** attempt in order with the player's symbol, a tick/cross, and — for wrong answers only — the correct comparison spelled out |
| A22 | Review screen scrolls correctly with 20+ attempts and handles the 0-attempt case |
| A23 | Back from review returns to the results overlay with the same final figures intact |
| A24 | No console errors; no audio |

---

## 12. Open Items for Vidhu

1. **Final credit line text** — needed for `CREDIT_LINE`.
2. **Font licence** — confirm which rounded display font to bundle (Fredoka / Baloo 2 are both SIL OFL and free to ship).
3. **Repo name** for GitHub Pages deploy (suggest `high-tower`, published under `pixelputra-cloud`).

---

## 13. Deferred to v2

- SFX (correct chime, explosion, timer tick) and background music
- Tap-to-answer and keyboard input for accessibility
- Difficulty selector on the splash screen
- Streak bonuses / combo multipliers
- Responsive phone layout
