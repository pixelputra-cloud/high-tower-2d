import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { ASSETS } from '../game/assets';
import {
  EXPLODE_MS,
  FLOOR_RISE_BOUNCE,
  FLOOR_RISE_MS,
  ROOF_Z,
  SETTLE_MS,
  TOP_FLOOR_H,
  TOWER_W,
  TOWER_X,
} from '../game/constants';
import { floorY, towerTopY } from '../game/gameMachine';
import type { Floor as FloorData, Resolution } from '../game/types';
import { Floor } from './Floor';

interface Props {
  floors: FloorData[];
  cameraOffsetY: number;
  resolution: Resolution | null;
}

/**
 * The single curve every moving part of the tower shares while it grows — the new
 * floor, the roof and the camera. Using one transition is what makes the tower read
 * as one structure rising; separate curves made the roof and the floor drift apart.
 */
const RISE: Transition = { type: 'spring', duration: FLOOR_RISE_MS / 1000, bounce: FLOOR_RISE_BOUNCE };
// After a wrong answer the bottom floor explodes first, then everything settles 119px.
const SETTLE: Transition = { delay: EXPLODE_MS / 1000, duration: SETTLE_MS / 1000, ease: 'easeOut' };

/**
 * Floors + roof inside a camera group. The camera translateY keeps the roof pinned
 * below the question row once the tower is tall enough; the stage's overflow clips
 * floors off the bottom.
 */
export function Tower({ floors, cameraOffsetY, resolution }: Props) {
  const wrong = resolution?.kind === 'wrong';
  const move = wrong ? SETTLE : RISE;
  return (
    <div className="layer" style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        initial={false}
        animate={{ y: cameraOffsetY }}
        transition={move}
        style={{ position: 'absolute', left: TOWER_X, top: 0, width: TOWER_W, height: '100%' }}
      >
        <AnimatePresence initial={false}>
          {floors.map((floor, i) => (
            <Floor key={floor.id} floor={floor} index={i} y={floorY(i)} transition={move} />
          ))}
        </AnimatePresence>
        <motion.div
          initial={false}
          animate={{ y: towerTopY(floors.length) }}
          transition={move}
          style={{ position: 'absolute', left: 0, top: 0, width: TOWER_W, height: TOP_FLOOR_H, zIndex: ROOF_Z }}
        >
          {/* With no floors to lose, a wrong answer just rattles the roof. */}
          <motion.img
            key={resolution?.kind === 'wrongEmpty' ? resolution.id : 'still'}
            src={ASSETS.topFloor}
            alt=""
            draggable={false}
            animate={resolution?.kind === 'wrongEmpty' ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'block', width: TOWER_W, height: TOP_FLOOR_H }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
