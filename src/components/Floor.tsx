import { motion, type Transition } from 'framer-motion';
import { ASSETS } from '../game/assets';
import {
  EXPLODE_MS,
  FLOOR_H,
  FLOOR_RISE_MS,
  FLOOR_Z_BASE,
  LABEL_FADE_MS,
  MINI_LEFT,
  MINI_NUMBER_FONT,
  MINI_NUMBER_FONT_3DIGIT,
  MINI_RIGHT,
  MINI_SYMBOL,
  MINI_SYMBOL_FONT,
  TOWER_W,
} from '../game/constants';
import { formatNumber } from '../game/questionGenerator';
import type { Floor as FloorData } from '../game/types';
import { MiniBlock } from './MiniBlock';

interface Props {
  floor: FloorData;
  index: number;
  y: number;
  transition: Transition;
}

const numberFont = (n: number) => (n >= 100 ? MINI_NUMBER_FONT_3DIGIT : MINI_NUMBER_FONT);

/** One stack plus the question it was earned with. */
export function Floor({ floor, index, y, transition }: Props) {
  return (
    <motion.div
      className="img-fill"
      // Starts a floor-height lower, i.e. exactly behind the floor below it, and rises
      // into its slot. No fade: it is occluded until it clears the floor beneath.
      initial={{ y: y + FLOOR_H, opacity: 1 }}
      animate={{ y, opacity: 1, scale: 1 }}
      exit={{ scale: 1.15, opacity: 0, transition: { duration: EXPLODE_MS / 1000, ease: 'easeOut' } }}
      transition={transition}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: TOWER_W,
        height: FLOOR_H,
        // Lower floors paint over higher ones so the rising floor emerges from behind
        // the stack. Floors never overlap once settled, so this is free the rest of the time.
        zIndex: FLOOR_Z_BASE - index,
        backgroundImage: `url("${ASSETS.stack[floor.art]}")`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: FLOOR_RISE_MS / 1000, duration: LABEL_FADE_MS / 1000 }}
      >
        <MiniBlock kind="number" rect={MINI_LEFT} fontSize={numberFont(floor.left)}>
          {formatNumber(floor.left)}
        </MiniBlock>
        <MiniBlock kind="symbol" rect={MINI_SYMBOL} fontSize={MINI_SYMBOL_FONT}>
          {floor.symbol}
        </MiniBlock>
        <MiniBlock kind="number" rect={MINI_RIGHT} fontSize={numberFont(floor.right)}>
          {formatNumber(floor.right)}
        </MiniBlock>
      </motion.div>
    </motion.div>
  );
}
