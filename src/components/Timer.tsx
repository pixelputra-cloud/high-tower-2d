import { motion } from 'framer-motion';
import { PANEL_NAVY_RGB, TIMER_RECT, TIMER_WARNING_MS } from '../game/constants';
import { rectStyle } from '../game/layout';

/** Rendered `0:90` → `0:00`, as the PRD specifies. */
const formatTime = (ms: number) => `0:${String(Math.max(0, Math.ceil(ms / 1000))).padStart(2, '0')}`;

export function Timer({ timeRemaining, running }: { timeRemaining: number; running: boolean }) {
  const warning = timeRemaining <= TIMER_WARNING_MS;
  const pulsing = warning && running;
  return (
    <motion.div
      animate={pulsing ? { scale: [1, 1.08] } : { scale: 1 }}
      transition={
        pulsing ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : { duration: 0.2 }
      }
      style={{
        ...rectStyle(TIMER_RECT),
        // Matches UI Panel.png: translucent navy, no border, flat against the left
        // edge of the stage and rounded only on the side that shows.
        background: warning ? 'rgba(183, 20, 20, 0.92)' : `rgba(${PANEL_NAVY_RGB}, 0.92)`,
        border: 0,
        // ~19px corner in the source art, at the same 78% scale as the panel below.
        borderRadius: '0 15px 15px 0',
        boxShadow: '0 5px 16px rgba(0, 6, 60, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        zIndex: 5,
        transition: 'background-color 0.3s',
      }}
    >
      <div className="hud-text" style={{ fontSize: 12, letterSpacing: 1 }}>TIME</div>
      <div className="hud-text" style={{ fontSize: 28 }}>{formatTime(timeRemaining)}</div>
    </motion.div>
  );
}
