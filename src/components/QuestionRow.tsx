import { motion } from 'framer-motion';
import { ASSETS } from '../game/assets';
import {
  ANSWER_SLOT,
  LEFT_BLOCK,
  QUESTION_FONT,
  QUESTION_FONT_3DIGIT,
  RIGHT_BLOCK,
  SLOT_FLASH_MS,
  SYMBOL_FONT,
  type Rect,
} from '../game/constants';
import { rectStyle } from '../game/layout';
import { formatNumber } from '../game/questionGenerator';
import type { Question, Resolution, Symbol } from '../game/types';

interface Props {
  question: Question | null;
  droppedSymbol: Symbol | null;
  dragging: boolean;
  resolution: Resolution | null;
}

function NumberBlock({ image, rect, value }: { image: string; rect: Rect; value: number | undefined }) {
  return (
    <div
      className="block img-fill"
      style={{
        ...rectStyle(rect),
        backgroundImage: `url("${image}")`,
        fontSize: value !== undefined && value >= 100 ? QUESTION_FONT_3DIGIT : QUESTION_FONT,
      }}
    >
      {value === undefined ? '' : formatNumber(value)}
    </div>
  );
}

export function QuestionRow({ question, droppedSymbol, dragging, resolution }: Props) {
  const mask = `url("${ASSETS.answerBlock}")`;
  return (
    <>
      <NumberBlock image={ASSETS.blockLeft} rect={LEFT_BLOCK} value={question?.left} />
      <NumberBlock image={ASSETS.blockRight} rect={RIGHT_BLOCK} value={question?.right} />
      <motion.div
        className="block img-fill"
        initial={false}
        animate={dragging ? { scale: 1.06, filter: 'brightness(1.15)' } : { scale: 1, filter: 'brightness(1)' }}
        transition={{ duration: 0.15 }}
        style={{
          ...rectStyle(ANSWER_SLOT),
          backgroundImage: `url("${ASSETS.answerBlock}")`,
          fontSize: droppedSymbol ? SYMBOL_FONT : QUESTION_FONT,
          zIndex: 1,
        }}
      >
        {/* Flash tint, masked to the block's own silhouette. */}
        {resolution && droppedSymbol && (
          <motion.div
            key={resolution.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: (SLOT_FLASH_MS * 2) / 1000, times: [0, 0.5, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              background: resolution.kind === 'correct' ? '#2ecc40' : '#f44336',
              WebkitMaskImage: mask,
              maskImage: mask,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          />
        )}
        <span style={{ position: 'relative' }}>{droppedSymbol ?? '?'}</span>
      </motion.div>
    </>
  );
}
