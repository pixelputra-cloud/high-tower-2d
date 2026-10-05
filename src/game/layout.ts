import type { CSSProperties } from 'react';
import type { Rect } from './constants';

export const rectStyle = (r: Rect): CSSProperties => ({
  position: 'absolute',
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

export const inRect = (r: Rect, x: number, y: number, margin = 0) =>
  x >= r.x - margin && x <= r.x + r.w + margin && y >= r.y - margin && y <= r.y + r.h + margin;
