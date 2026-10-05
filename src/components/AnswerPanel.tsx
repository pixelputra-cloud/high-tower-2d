import type { PointerEvent } from 'react';
import { ASSETS } from '../game/assets';
import { BLOCK_H, BLOCK_W, PALETTE_ORDER, PALETTE_X, PALETTE_Y, SYMBOL_FONT, UI_PANEL } from '../game/constants';
import { rectStyle } from '../game/layout';
import type { Symbol } from '../game/types';

interface Props {
  onGrab: (e: PointerEvent, symbol: Symbol, originX: number, originY: number) => void;
  enabled: boolean;
}

/** The `<` `=` `>` palette. Blocks are never consumed — dragging spawns a clone. */
export function AnswerPanel({ onGrab, enabled }: Props) {
  return (
    <>
      <div className="img-fill" style={{ ...rectStyle(UI_PANEL), backgroundImage: `url("${ASSETS.uiPanel}")` }} />
      {PALETTE_ORDER.map((symbol) => (
        <div
          key={symbol}
          role="button"
          aria-label={`Drag ${symbol}`}
          className={`block img-fill${enabled ? ' draggable' : ''}`}
          onPointerDown={(e) => enabled && onGrab(e, symbol, PALETTE_X, PALETTE_Y[symbol])}
          style={{
            ...rectStyle({ x: PALETTE_X, y: PALETTE_Y[symbol], w: BLOCK_W, h: BLOCK_H }),
            backgroundImage: `url("${ASSETS.symbolBlock}")`,
            fontSize: SYMBOL_FONT,
          }}
        >
          {symbol}
        </div>
      ))}
    </>
  );
}
