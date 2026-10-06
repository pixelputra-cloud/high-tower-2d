import { motion } from 'framer-motion';
import {
  REVIEW_FOOTER_H,
  REVIEW_HEADER_H,
  REVIEW_PANEL,
  REVIEW_ROW_GAP,
  REVIEW_VIEWPORT,
} from '../game/constants';
import { rectStyle } from '../game/layout';
import type { Attempt } from '../game/types';
import { ReviewRow } from './ReviewRow';

export function ReviewScreen({ attempts, onBack }: { attempts: Attempt[]; onBack: () => void }) {
  const correct = attempts.filter((a) => a.correct).length;
  const P = REVIEW_PANEL;
  return (
    <div className="layer" style={{ zIndex: 70 }}>
      <div className="backdrop" style={{ background: 'rgba(5,8,40,0.6)' }} />
      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={rectStyle(P)}
      />
      {/* Header */}
      <div
        style={{
          ...rectStyle({ x: P.x, y: P.y, w: P.w, h: REVIEW_HEADER_H }),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <span style={{ color: '#ffd600', fontSize: 24 }}>YOUR ANSWERS</span>
        <span style={{ color: '#fff', fontSize: 18 }}>
          {correct} / {attempts.length} correct
        </span>
      </div>
      {/* Native scroll; the viewport lives inside the scaled stage so no coordinate maths needed. */}
      <div
        className="review-scroll"
        style={{
          ...rectStyle(REVIEW_VIEWPORT),
          display: 'flex',
          flexDirection: 'column',
          gap: REVIEW_ROW_GAP,
        }}
      >
        {attempts.length === 0 ? (
          <div style={{ margin: 'auto', color: '#fff', fontSize: 20 }}>No questions attempted</div>
        ) : (
          attempts.map((a) => <ReviewRow key={a.id} attempt={a} />)
        )}
      </div>
      {/* Footer */}
      <div
        style={{
          ...rectStyle({ x: P.x, y: P.y + P.h - REVIEW_FOOTER_H, w: P.w, h: REVIEW_FOOTER_H }),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button className="btn" style={{ height: 36, minWidth: 120 }} onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
