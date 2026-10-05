import { motion, type Transition } from 'framer-motion';
import { ASSETS } from '../game/assets';
import {
  EXPLODE_MS,
  FLOOR_DROP_FROM,
  FLOOR_DROP_MS,
  FLOOR_H,
  LABEL_FADE_MS,
  MINI_LEFT,
  MINI_RIGHT,
  MINI_SYMBOL,
  TOWER_W,
} from '../game/constants';
import { formatNumber } from '../game/questionGenerator';
import type { Floor as FloorData } from '../game/types';
import { MiniBlock } from './MiniBlock';

interface Props {
  floor: FloorData;
  y: number;
  transition: Transition;
}

const numberFont = (n: number) => (n >= 100 ? 28 : 36);

/** One stack plus the question it was earned with. */
export function Floor({ floor, y, transition }: Props) {
  return (
    <motion.div
      className="img-fill"
      initial={{ y: y - FLOOR_DROP_FROM, opacity: 0 }}
      animate={{ y, opacity: 1, scale: 1 }}
      exit={{ scale: 1.15, opacity: 0, transition: { duration: EXPLODE_MS / 1000, ease: 'easeOut' } }}
      transition={{
        ...transition,
        // A freshly mounted floor drops in with a little bounce.
        opacity: { duration: 0.1 },
      }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: TOWER_W,
        height: FLOOR_H,
        backgroundImage: `url("${ASSETS.stack[floor.art]}")`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: FLOOR_DROP_MS / 1000, duration: LABEL_FADE_MS / 1000 }}
      >
        <MiniBlock kind="number" rect={MINI_LEFT} fontSize={numberFont(floor.left)}>
          {formatNumber(floor.left)}
        </MiniBlock>
        <MiniBlock kind="symbol" rect={MINI_SYMBOL} fontSize={32}>
          {floor.symbol}
        </MiniBlock>
        <MiniBlock kind="number" rect={MINI_RIGHT} fontSize={numberFont(floor.right)}>
          {formatNumber(floor.right)}
        </MiniBlock>
      </motion.div>
    </motion.div>
  );
}
