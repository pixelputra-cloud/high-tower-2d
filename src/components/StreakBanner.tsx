import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  BANNER_DELAY_MS,
  BANNER_ENTER_MS,
  BANNER_EXIT_MS,
  BANNER_HOLD_MS,
  BANNER_Y,
  STAGE_W,
  YELLOW,
} from '../game/constants';

interface Props {
  message: string | null;
  id: number;
}

/**
 * Encouragement banner (§7.8). Appears once the new floor has landed, holds, then
 * floats away. Pointer-transparent so it can never block a drag; one at a time.
 */
export function StreakBanner({ message, id }: Props) {
  const [shown, setShown] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    if (!message || id === 0) return;
    const show = window.setTimeout(() => setShown({ id, message }), BANNER_DELAY_MS);
    const hide = window.setTimeout(
      () => setShown((s) => (s?.id === id ? null : s)),
      BANNER_DELAY_MS + BANNER_ENTER_MS + BANNER_HOLD_MS,
    );
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [id, message]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: BANNER_Y,
        width: STAGE_W,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <AnimatePresence mode="wait">
        {shown && (
          <motion.div
            key={shown.id}
            initial={{ scale: 0.6, opacity: 0, y: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: 'spring', duration: BANNER_ENTER_MS / 1000, bounce: 0.5 },
            }}
            exit={{ y: -30, opacity: 0, transition: { duration: BANNER_EXIT_MS / 1000, ease: 'easeIn' } }}
            style={{
              height: 56,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              background: YELLOW,
              border: '3px solid #000',
              borderRadius: 14,
              fontSize: 28,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 5px 0 rgba(0,0,0,0.3)',
            }}
          >
            {shown.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
