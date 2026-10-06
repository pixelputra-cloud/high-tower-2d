import { AnimatePresence, motion } from 'framer-motion';
import { ASSETS } from '../game/assets';
import {
  CARD_BOTTOM_Y,
  CARD_SIZE,
  CARD_SLIDE_MS,
  CARD_STEP,
  CARD_X,
  SCORE_HEADER,
  SCORE_PANEL,
  VISIBLE_CARDS,
} from '../game/constants';
import { rectStyle } from '../game/layout';
import type { Attempt } from '../game/types';

/** Slot 0 is the bottom of the panel; later attempts stack upward from there. */
const slotY = (i: number) => CARD_BOTTOM_Y - i * CARD_STEP;
const slide = { duration: CARD_SLIDE_MS / 1000, ease: 'easeOut' } as const;

export function ScorePanel({ points, attempts }: { points: number; attempts: Attempt[] }) {
  const visible = attempts.slice(-VISIBLE_CARDS);
  return (
    <>
      <div className="img-fill" style={{ ...rectStyle(SCORE_PANEL), backgroundImage: `url("${ASSETS.scorePanel}")` }} />
      <div
        style={{
          ...rectStyle(SCORE_HEADER),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="hud-text" style={{ fontSize: 18 }}>Total</div>
        <motion.div
          key={points}
          className="hud-text"
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{ fontSize: points >= 100 ? 34 : 50 }}
        >
          {points}
        </motion.div>
        <div className="hud-text" style={{ fontSize: 18 }}>Points</div>
      </div>
      {/* Last 8 attempts; from the 9th on, everything slides down one slot and the oldest
          fades out past the foot of the panel. */}
      <AnimatePresence initial={false}>
        {visible.map((a, i) => (
          <motion.img
            key={a.id}
            src={a.correct ? ASSETS.rightCard : ASSETS.wrongCard}
            alt={a.correct ? 'Correct' : 'Wrong'}
            draggable={false}
            initial={{ opacity: 0, y: slotY(i), scale: 0.6 }}
            animate={{ opacity: 1, y: slotY(i), scale: 1 }}
            exit={{ opacity: 0, y: slotY(-1) }}
            transition={slide}
            style={{ position: 'absolute', left: CARD_X, top: 0, width: CARD_SIZE, height: CARD_SIZE }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
