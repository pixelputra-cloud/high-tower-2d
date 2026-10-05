import { motion } from 'framer-motion';
import { NAVY, TIMER_RECT, TIMER_WARNING_MS } from '../game/constants';
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
        background: warning ? '#d32f2f' : NAVY,
        border: '3px solid #000',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        zIndex: 5,
        transition: 'background-color 0.3s',
      }}
    >
      <div className="hud-text" style={{ fontSize: 12, letterSpacing: 1 }}>TIME</div>
      <div className="hud-text" style={{ fontSize: 28 }}>{formatTime(timeRemaining)}</div>
    </motion.div>
  );
}
