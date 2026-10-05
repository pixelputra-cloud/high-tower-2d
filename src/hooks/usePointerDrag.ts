import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { STAGE_W, SNAP_BACK_MS } from '../game/constants';
import type { Symbol } from '../game/types';

export interface DragState {
  symbol: Symbol;
  pointerId: number;
  /** Clone's top-left in stage space. */
  x: number;
  y: number;
  originX: number;
  originY: number;
  /** Pointer offset inside the grabbed block. */
  grabX: number;
  grabY: number;
  returning: boolean;
}

interface Options {
  stageRef: RefObject<HTMLDivElement | null>;
  /** False once the game leaves the dragging phase (e.g. timer expiry) — any drag is cancelled. */
  active: boolean;
  onStart: () => void;
  /** Return true if the drop was accepted; the pointer position is in stage space. */
  onRelease: (symbol: Symbol, x: number, y: number) => boolean;
  onCancel: () => void;
}

/**
 * Pointer-event drag (mouse + touch + pen). Client coordinates are converted into
 * stage space by dividing by the stage's current scale factor.
 */
export function usePointerDrag({ stageRef, active, onStart, onRelease, onCancel }: Options) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const timer = useRef<number>();
  const dragRef = useRef<DragState | null>(null);
  dragRef.current = drag;

  const toStage = useCallback(
    (clientX: number, clientY: number) => {
      const rect = stageRef.current!.getBoundingClientRect();
      const k = rect.width / STAGE_W;
      return { x: (clientX - rect.left) / k, y: (clientY - rect.top) / k };
    },
    [stageRef],
  );

  const startDrag = useCallback(
    (e: ReactPointerEvent, symbol: Symbol, originX: number, originY: number) => {
      if (drag || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      const p = toStage(e.clientX, e.clientY);
      setDrag({
        symbol,
        pointerId: e.pointerId,
        x: originX,
        y: originY,
        originX,
        originY,
        grabX: p.x - originX,
        grabY: p.y - originY,
        returning: false,
      });
      onStart();
    },
    [drag, toStage, onStart],
  );

  const following = drag !== null && !drag.returning;
  const pointerId = drag?.pointerId;

  useEffect(() => {
    if (!following) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const p = toStage(e.clientX, e.clientY);
      setDrag((d) => d && { ...d, x: p.x - d.grabX, y: p.y - d.grabY });
    };
    const finish = (e: PointerEvent, cancelled: boolean) => {
      const d = dragRef.current;
      if (e.pointerId !== pointerId || !d) return;
      const p = toStage(e.clientX, e.clientY);
      if (!cancelled && onRelease(d.symbol, p.x, p.y)) {
        setDrag(null);
        return;
      }
      setDrag({ ...d, returning: true });
      timer.current = window.setTimeout(() => {
        setDrag(null);
        onCancel();
      }, SNAP_BACK_MS);
    };
    const onUp = (e: PointerEvent) => finish(e, false);
    const onCancelEvt = (e: PointerEvent) => finish(e, true);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancelEvt);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancelEvt);
    };
  }, [following, pointerId, toStage, onRelease, onCancel]);

  // Timer expiry (or any phase change away from dragging) kills the drag immediately.
  useEffect(() => {
    if (!active && drag) {
      window.clearTimeout(timer.current);
      setDrag(null);
    }
  }, [active, drag]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { drag, startDrag };
}
