import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { RESULTS_RECT } from '../game/constants';
import { rectStyle } from '../game/layout';

interface Props {
  points: number;
  floors: number;
  correct: number;
  wrong: number;
  bestScore: number;
  isNewBest: boolean;
  onReview: () => void;
  onPlayAgain: () => void;
  onHome: () => void;
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 18 }}>
      <span style={{ color: '#fff', fontWeight: 600 }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}

export function ResultsOverlay(p: Props) {
  return (
    <div className="layer" style={{ zIndex: 60 }}>
      <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div
        className="panel"
        role="dialog"
        aria-label="Time up"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.35 }}
        style={{
          ...rectStyle(RESULTS_RECT),
          padding: '18px 28px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 34, textAlign: 'center', lineHeight: 1 }}>TIME UP!</div>
        <div style={{ position: 'relative', textAlign: 'center', margin: '6px 0 8px' }}>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, letterSpacing: 1 }}>FINAL SCORE</div>
          <div style={{ fontSize: 52, lineHeight: 1 }}>{p.points}</div>
          {p.isNewBest && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 12 }}
              transition={{ type: 'spring', delay: 0.35, bounce: 0.6 }}
              style={{
                position: 'absolute',
                right: 0,
                top: 14,
                background: '#ff1744',
                color: '#fff',
                borderRadius: 12,
                padding: '5px 10px',
                fontSize: 16,
                boxShadow: '0 4px 0 rgba(120, 0, 25, 0.5)',
              }}
            >
              NEW BEST!
            </motion.div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <Stat label="Tower Height">
            {p.floors} {p.floors === 1 ? 'floor' : 'floors'}
          </Stat>
          <Stat label="Correct / Wrong">
            <span style={{ color: '#69f0ae' }}>{p.correct}</span> / <span style={{ color: '#ff8a80' }}>{p.wrong}</span>
          </Stat>
          <Stat label="Best Score">{p.bestScore}</Stat>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn btn--info" onClick={p.onReview}>
            Review Answers
          </button>
          <button className="btn" onClick={p.onPlayAgain}>
            Play Again
          </button>
          <button className="btn btn--alt" onClick={p.onHome}>
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
