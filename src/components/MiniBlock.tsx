import type { CSSProperties } from 'react';
import type { Rect } from '../game/constants';
import { rectStyle } from '../game/layout';

interface Props {
  kind: 'number' | 'symbol';
  rect: Rect;
  fontSize: number;
  children: string;
  style?: CSSProperties;
}

/** Small read-only block used for floor labels and the review list. */
export function MiniBlock({ kind, rect, fontSize, children, style }: Props) {
  return (
    <div className={`mini mini--${kind}`} style={{ ...rectStyle(rect), fontSize, ...style }}>
      {children}
    </div>
  );
}
