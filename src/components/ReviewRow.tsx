import { ASSETS } from '../game/assets';
import { REVIEW_CARD, REVIEW_COLS, REVIEW_MINI_H, REVIEW_ROW_H } from '../game/constants';
import { formatNumber } from '../game/questionGenerator';
import type { Attempt } from '../game/types';
import { MiniBlock } from './MiniBlock';

const col = (c: { x: number; w: number }, h = REVIEW_MINI_H) => ({ x: c.x, y: (REVIEW_ROW_H - h) / 2, w: c.w, h });

export function ReviewRow({ attempt: a }: { attempt: Attempt }) {
  return (
    <div
      style={{
        position: 'relative',
        height: REVIEW_ROW_H,
        borderRadius: 10,
        background: a.correct ? 'rgba(76,175,80,0.18)' : 'rgba(244,67,54,0.18)',
        flex: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: REVIEW_COLS.number.x,
          width: REVIEW_COLS.number.w,
          top: 0,
          height: REVIEW_ROW_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 16,
        }}
      >
        Q{a.questionNumber}
      </div>
      <MiniBlock kind="number" rect={col(REVIEW_COLS.left)} fontSize={26}>
        {formatNumber(a.left)}
      </MiniBlock>
      <MiniBlock kind="symbol" rect={col(REVIEW_COLS.symbol)} fontSize={28}>
        {a.chosenSymbol}
      </MiniBlock>
      <MiniBlock kind="number" rect={col(REVIEW_COLS.right)} fontSize={26}>
        {formatNumber(a.right)}
      </MiniBlock>
      <img
        src={a.correct ? ASSETS.rightCard : ASSETS.wrongCard}
        alt={a.correct ? 'Correct' : 'Wrong'}
        draggable={false}
        style={{
          position: 'absolute',
          left: REVIEW_COLS.verdict.x + (REVIEW_COLS.verdict.w - REVIEW_CARD) / 2,
          top: (REVIEW_ROW_H - REVIEW_CARD) / 2,
          width: REVIEW_CARD,
          height: REVIEW_CARD,
        }}
      />
      {!a.correct && (
        <div
          style={{
            position: 'absolute',
            left: REVIEW_COLS.correction.x,
            width: REVIEW_COLS.correction.w,
            top: 0,
            height: REVIEW_ROW_H,
            display: 'flex',
            alignItems: 'center',
            color: '#ffd600',
            fontSize: 18,
            whiteSpace: 'nowrap',
          }}
        >
          Correct: {formatNumber(a.left)} {a.correctSymbol} {formatNumber(a.right)}
        </div>
      )}
    </div>
  );
}
