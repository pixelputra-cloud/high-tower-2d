import { motion } from 'framer-motion';
import { ASSETS } from '../game/assets';
import { BLOCK_H, BLOCK_W, SNAP_BACK_MS, SYMBOL_FONT } from '../game/constants';
import type { DragState } from '../hooks/usePointerDrag';

/** The floating clone that follows the pointer, and snaps home on a missed drop. */
export function DragLayer({ drag }: { drag: DragState | null }) {
  if (!drag) return null;
  const target = drag.returning ? { x: drag.originX, y: drag.originY } : { x: drag.x, y: drag.y };
  return (
    <motion.div
      className="block img-fill"
      initial={{ x: drag.originX, y: drag.originY, scale: 1 }}
      animate={{ ...target, scale: drag.returning ? 1 : 1.08 }}
      transition={
        drag.returning
          ? { duration: SNAP_BACK_MS / 1000, ease: 'easeOut' }
          : { x: { duration: 0 }, y: { duration: 0 }, scale: { duration: 0.1 } }
      }
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: BLOCK_W,
        height: BLOCK_H,
        backgroundImage: `url("${ASSETS.symbolBlock}")`,
        fontSize: SYMBOL_FONT,
        pointerEvents: 'none',
        zIndex: 50,
        filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.35))',
      }}
    >
      {drag.symbol}
    </motion.div>
  );
}
