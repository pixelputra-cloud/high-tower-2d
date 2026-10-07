import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ASSETS } from '../game/assets';
import {
  BG_LAYERS,
  CLOUD_BAND,
  CLOUD_COUNT,
  CLOUD_DEPTH,
  PARALLAX_HALF_AT,
  PARALLAX_MAX_SHIFT,
  PARALLAX_MS,
  STAGE_W,
} from '../game/constants';

/**
 * How far the parallax has travelled, 0 → 1, as a function of tower height.
 * Saturating rather than linear: every answer still nudges the scene, but the
 * total travel is bounded, so no layer can ever drift far enough to show an edge.
 */
const parallaxProgress = (floorCount: number) => floorCount / (floorCount + PARALLAX_HALF_AT);

interface Cloud {
  id: number;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
}

/**
 * Cloud_01 and Cloud_02 duplicated and scattered across the sky. Each cloud gets
 * its own column so they spread out instead of clumping, with the position, size
 * and opacity jittered inside that column.
 */
function scatterClouds(): Cloud[] {
  const column = STAGE_W / CLOUD_COUNT;
  const band = CLOUD_BAND.bottom - CLOUD_BAND.top;
  return Array.from({ length: CLOUD_COUNT }, (_, i) => {
    const useFirst = i % 2 === 0;
    const scale = 0.75 + Math.random() * 0.75;
    const w = (useFirst ? 131 : 163) * scale;
    const h = (useFirst ? 85 : 89) * scale;
    return {
      id: i,
      src: useFirst ? ASSETS.cloud1 : ASSETS.cloud2,
      // Jitter within the column, allowing a little overhang past the stage edges.
      x: i * column + Math.random() * (column - w * 0.4) - w * 0.3,
      y: CLOUD_BAND.top + Math.random() * (band - h),
      w,
      h,
      opacity: 0.72 + Math.random() * 0.28,
    };
  });
}

/**
 * The layered, parallaxing scene behind the tower. As floors are added every layer
 * drifts down by an amount proportional to its depth — nearest moves most, the sky
 * not at all — and drifts back up when floors are destroyed.
 */
export function Background({ floorCount }: { floorCount: number }) {
  // Scattered once per mount; GameScreen is keyed by session, so Play Again reshuffles.
  const clouds = useMemo(scatterClouds, []);
  const shift = parallaxProgress(floorCount) * PARALLAX_MAX_SHIFT;
  const transition = { duration: PARALLAX_MS / 1000, ease: 'easeOut' } as const;

  const layer = (depth: number) => ({
    animate: { y: shift * depth },
    transition,
  });

  return (
    // `isolation` keeps this z-scale inside the background, so a building can never
    // outrank the timer, the question row or the streak banner above it.
    <div className="layer" style={{ overflow: 'hidden', pointerEvents: 'none', isolation: 'isolate' }}>
      {BG_LAYERS.map((l, i) => (
        <motion.img
          key={l.src}
          src={ASSETS[l.src]}
          alt=""
          draggable={false}
          initial={false}
          {...layer(l.depth)}
          style={{ position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.h, zIndex: i * 10 }}
        />
      ))}
      {/* Between the background buildings (z 20) and the middle ground (z 30). */}
      <motion.div className="layer" initial={false} {...layer(CLOUD_DEPTH)} style={{ zIndex: 25 }}>
        {clouds.map((c) => (
          <img
            key={c.id}
            src={c.src}
            alt=""
            draggable={false}
            style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, opacity: c.opacity }}
          />
        ))}
      </motion.div>
    </div>
  );
}
