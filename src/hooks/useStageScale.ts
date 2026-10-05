import { useEffect, useState } from 'react';
import { STAGE_H, STAGE_W } from '../game/constants';

const compute = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);

/** Scale factor k that fits the fixed 800×600 stage inside the window. */
export function useStageScale(): number {
  const [k, setK] = useState(compute);
  useEffect(() => {
    const onResize = () => setK(compute());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return k;
}
