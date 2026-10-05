import { useEffect } from 'react';
import { TICK_MS } from '../game/constants';

/** Emits elapsed-ms ticks while `running`; uses wall-clock deltas so it never drifts. */
export function useCountdown(running: boolean, onTick: (dt: number) => void) {
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      onTick(now - last);
      last = now;
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [running, onTick]);
}
